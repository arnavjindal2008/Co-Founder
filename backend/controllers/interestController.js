
import pool from '../config/db.js';

// GET all available interests
export const getAllInterests = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM interests ORDER BY name ASC'
    );

    return res.status(200).json({
      success: true,
      interests: result.rows,
    });
  } catch (error) {
    console.error('Get interests error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch interests.',
    });
  }
};

// GET interests selected by logged-in user
export const getMyInterests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.id, i.name
       FROM user_interests ui
       JOIN interests i ON i.id = ui.interest_id
       WHERE ui.user_id = $1
       ORDER BY i.name ASC`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      interests: result.rows,
    });
  } catch (error) {
    console.error('Get my interests error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch your interests.',
    });
  }
};

// ADD an interest to logged-in user's profile
export const addInterest = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Interest name is required.',
      });
    }

    const interestName = name.trim();

    if (interestName.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Interest name cannot exceed 100 characters.',
      });
    }

    const interestResult = await pool.query(
      `INSERT INTO interests (name)
       VALUES ($1)
       ON CONFLICT (name)
       DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name`,
      [interestName]
    );

    const interest = interestResult.rows[0];

    await pool.query(
      `INSERT INTO user_interests (user_id, interest_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, interest_id) DO NOTHING`,
      [req.user.id, interest.id]
    );

    return res.status(201).json({
      success: true,
      message: 'Interest added successfully.',
      interest,
    });
  } catch (error) {
    console.error('Add interest error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to add interest.',
    });
  }
};

// REMOVE an interest from logged-in user's profile
export const removeInterest = async (req, res) => {
  try {
    const interestId = Number(req.params.interestId);

    if (!Number.isInteger(interestId) || interestId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid interest ID.',
      });
    }

    const result = await pool.query(
      `DELETE FROM user_interests
       WHERE user_id = $1 AND interest_id = $2
       RETURNING interest_id`,
      [req.user.id, interestId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Interest not found in your profile.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Interest removed successfully.',
    });
  } catch (error) {
    console.error('Remove interest error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to remove interest.',
    });
  }
};
