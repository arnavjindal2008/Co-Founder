import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { randomBytes } from 'crypto';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =====================================
// SIGNUP API
// =====================================

export const signup = async (req, res) => {
    const client = await pool.connect();

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

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

        const hashedPassword = await bcrypt.hash(password, 10);

        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO users (email, password_hash)
             VALUES ($1, $2)
             RETURNING id, email, created_at`,
            [cleanEmail, hashedPassword]
        );

        const user = result.rows[0];

        await client.query(
            `INSERT INTO profiles (user_id, full_name)
             VALUES ($1, $2)`,
            [user.id, cleanName]
        );

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


// =====================================
// LOGIN API
// =====================================

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is missing in .env');
        }

        const cleanEmail = email.trim().toLowerCase();

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


// =====================================
// GOOGLE LOGIN API
// =====================================

export const googleLogin = async (req, res) => {
    const client = await pool.connect();

    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: 'Google credential is required',
            });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            throw new Error('GOOGLE_CLIENT_ID is missing in .env');
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is missing in .env');
        }

        // Verify Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email || payload.email_verified !== true) {
            return res.status(401).json({
                success: false,
                message: 'Google account email could not be verified',
            });
        }

        const email = payload.email.trim().toLowerCase();
        const name = payload.name || email.split('@')[0];

        await client.query('BEGIN');

        // Find existing account
        let userResult = await client.query(
            `SELECT id, email
             FROM users
             WHERE email = $1`,
            [email]
        );

        let user;

        if (userResult.rows.length > 0) {
            // Existing account: sign in
            user = userResult.rows[0];

            // Google has verified this email
            await client.query(
                `UPDATE users
                 SET email_verified = TRUE
                 WHERE id = $1`,
                [user.id]
            );

        } else {
            // Create a random password hash for Google-only accounts.
            // This avoids requiring password_hash to be nullable.
            const randomPassword = randomBytes(32).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            userResult = await client.query(
                `INSERT INTO users (email, password_hash, email_verified)
                 VALUES ($1, $2, TRUE)
                 RETURNING id, email`,
                [email, hashedPassword]
            );

            user = userResult.rows[0];
        }

        // Ensure the user has a profile
        await client.query(
            `INSERT INTO profiles (user_id, full_name)
             VALUES ($1, $2)
             ON CONFLICT (user_id) DO NOTHING`,
            [user.id, name]
        );

        // Fetch profile name
        const profileResult = await client.query(
            `SELECT full_name
             FROM profiles
             WHERE user_id = $1`,
            [user.id]
        );

        const fullName = profileResult.rows[0]?.full_name || name;

        await client.query('COMMIT');

        // Generate the same JWT format as normal login
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
            message: 'Google login successful',
            token,
            user: {
                id: user.id,
                name: fullName,
                email: user.email,
            },
        });

    } catch (error) {
        await client.query('ROLLBACK');

        console.error('Google login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Google login failed',
        });

    } finally {
        client.release();
    }
};


// =====================================
// GET LOGGED-IN USER API
// =====================================

export const getMe = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                u.id,
                u.email,
                u.email_verified,
                p.full_name,
                p.profile_picture,
                p.headline,
                p.bio,
                p.education,
                p.experience,
                p.github_url,
                p.portfolio_url,
                p.availability,
                p.collaboration_preferences
             FROM users u
             JOIN profiles p ON u.id = p.user_id
             WHERE u.id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            user: result.rows[0],
        });

    } catch (error) {
        console.error('Get user error:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error while fetching user',
        });
    }
};
