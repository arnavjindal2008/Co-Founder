import pool from '../config/db.js';

// GET LOGGED-IN USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        u.id,
        u.email,
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
        message: 'Profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      profile: result.rows[0],
    });
  } catch (error) {
    console.error('Get profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch profile',
    });
  }
};


// UPDATE LOGGED-IN USER PROFILE
export const updateProfile = async (req, res) => {
  try {
    const {
      full_name,
      headline,
      bio,
      education,
      experience,
      github_url,
      portfolio_url,
      availability,
    } = req.body;

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required',
      });
    }

    const result = await pool.query(
      `UPDATE profiles
       SET
         full_name = $1,
         headline = $2,
         bio = $3,
         education = $4,
         experience = $5,
         github_url = $6,
         portfolio_url = $7,
         availability = $8,
         updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $9
       RETURNING *`,
      [
        full_name.trim(),
        headline || null,
        bio || null,
        education || null,
        experience || null,
        github_url || null,
        portfolio_url || null,
        availability || null,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: result.rows[0],
    });
  } catch (error) {
    console.error('Update profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update profile',
    });
  }
};