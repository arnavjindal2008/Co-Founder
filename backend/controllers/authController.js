
import pool from '../config/db.js';
import bcrypt from 'bcrypt';

// SIGNUP API
export const signup = async (req, res) => {
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

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const result = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [email.toLowerCase(), hashedPassword]
    );

    const user = result.rows[0];

    // Create user profile
    await pool.query(
      `INSERT INTO profiles (user_id, full_name)
       VALUES ($1, $2)`,
      [user.id, name.trim()]
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: name.trim(),
        email: user.email,
        created_at: user.created_at,
      },
    });

  } catch (error) {
    console.error('Signup error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during signup',
    });
  }
};
