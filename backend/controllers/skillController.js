
import pool from '../config/db.js';

// GET: All available skills
export const getAllSkills = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name FROM skills ORDER BY name ASC'
        );

        return res.status(200).json({
            success: true,
            skills: result.rows
        });
    } catch (error) {
        console.error('Get skills error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch skills.'
        });
    }
};

// GET: Skills of logged-in user
export const getMySkills = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.id, s.name
             FROM skills s
             JOIN user_skills us ON s.id = us.skill_id
             WHERE us.user_id = $1
             ORDER BY s.name ASC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            skills: result.rows
        });
    } catch (error) {
        console.error('Get my skills error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch your skills.'
        });
    }
};

// POST: Add skill to logged-in user's profile
export const addSkill = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Skill name is required.'
            });
        }

        const skillName = name.trim();

        const skillResult = await pool.query(
            `INSERT INTO skills (name)
             VALUES ($1)
             ON CONFLICT (name)
             DO UPDATE SET name = EXCLUDED.name
             RETURNING id, name`,
            [skillName]
        );

        const skill = skillResult.rows[0];

        await pool.query(
            `INSERT INTO user_skills (user_id, skill_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, skill_id) DO NOTHING`,
            [req.user.id, skill.id]
        );

        return res.status(201).json({
            success: true,
            message: 'Skill added successfully.',
            skill
        });
    } catch (error) {
        console.error('Add skill error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to add skill.'
        });
    }
};

// DELETE: Remove skill from logged-in user's profile
export const deleteSkill = async (req, res) => {
    try {
        const skillId = Number(req.params.skillId);

        if (!Number.isInteger(skillId) || skillId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid skill ID.'
            });
        }

        const result = await pool.query(
            `DELETE FROM user_skills
             WHERE user_id = $1 AND skill_id = $2
             RETURNING skill_id`,
            [req.user.id, skillId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found in your profile.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Skill removed successfully.'
        });
    } catch (error) {
        console.error('Delete skill error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to remove skill.'
        });
    }
};
