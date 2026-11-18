import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// SIGNUP API
export const signup = async (req, res) => {
  const client = await pool.connect();

  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters',
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      return res.status(400).json({
        success: false,
        message: 'Name and email cannot be empty',
      });
    }

    // Check whether email already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [cleanEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction
    await client.query('BEGIN');

    // Create user
    const result = await client.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [cleanEmail, hashedPassword]
    );

    const user = result.rows[0];

    // Create profile
    await client.query(
      `INSERT INTO profiles (user_id, full_name)
       VALUES ($1, $2)`,
      [user.id, cleanName]
    );

    // Save both changes
    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: cleanName,
        email: user.email,
        created_at: user.created_at,
      },
    });

  } catch (error) {
    await client.query('ROLLBACK');

    console.error('Signup error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during signup',
    });

  } finally {
    client.release();
  }
};


// LOGIN API
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing in .env');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const result = await pool.query(
      `SELECT
        u.id,
        u.email,
        u.password_hash,
        p.full_name
       FROM users u
       JOIN profiles p ON u.id = p.user_id
       WHERE u.email = $1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};