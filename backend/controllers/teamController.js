import pool from '../config/db.js';

// GET: View members of a project
export const getProjectMembers = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID.'
            });
        }

        const project = await pool.query(
            'SELECT id FROM projects WHERE id = $1',
            [projectId]
        );

        if (project.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const result = await pool.query(
            `SELECT
                pm.id AS membership_id,
                pm.user_id,
                pm.role_name,
                pm.joined_at,
                p.full_name,
                p.profile_picture,
                p.headline
             FROM project_members pm
             LEFT JOIN profiles p ON p.user_id = pm.user_id
             WHERE pm.project_id = $1
             ORDER BY pm.joined_at ASC`,
            [projectId]
        );

        return res.status(200).json({
            success: true,
            members: result.rows
        });

    } catch (error) {
        console.error('Get project members error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch project members.'
        });
    }
};

// POST: Project owner adds a member
export const addProjectMember = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);
        const userId = Number(req.body.userId);
        const { role_name } = req.body;

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID.'
            });
        }

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'A valid userId is required.'
            });
        }

        if (!role_name || !role_name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Role name is required.'
            });
        }

        const project = await pool.query(
            'SELECT id FROM projects WHERE id = $1 AND owner_id = $2',
            [projectId, req.user.id]
        );

        if (project.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or you are not its owner.'
            });
        }

        const user = await pool.query(
            'SELECT id FROM users WHERE id = $1',
            [userId]
        );

        if (user.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const result = await pool.query(
            `INSERT INTO project_members
                (project_id, user_id, role_name)
             VALUES ($1, $2, $3)
             ON CONFLICT (project_id, user_id) DO NOTHING
             RETURNING id, project_id, user_id, role_name, joined_at`,
            [projectId, userId, role_name.trim()]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({
                success: false,
                message: 'This user is already a member of the project.'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Team member added successfully.',
            member: result.rows[0]
        });

    } catch (error) {
        console.error('Add project member error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to add team member.'
        });
    }
};

// PATCH: Project owner changes a member's role
export const updateMemberRole = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);
        const userId = Number(req.params.userId);
        const { role_name } = req.body;

        if (
            !Number.isInteger(projectId) || projectId <= 0 ||
            !Number.isInteger(userId) || userId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID or user ID.'
            });
        }

        if (!role_name || !role_name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Role name is required.'
            });
        }

        const result = await pool.query(
            `UPDATE project_members pm
             SET role_name = $1
             FROM projects p
             WHERE pm.project_id = $2
             AND pm.user_id = $3
             AND p.id = pm.project_id
             AND p.owner_id = $4
             RETURNING pm.id, pm.project_id, pm.user_id, pm.role_name`,
            [role_name.trim(), projectId, userId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project member not found or you are not the project owner.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Member role updated successfully.',
            member: result.rows[0]
        });

    } catch (error) {
        console.error('Update member role error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to update member role.'
        });
    }
};

// DELETE: Project owner removes a member
export const removeProjectMember = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);
        const userId = Number(req.params.userId);

        if (
            !Number.isInteger(projectId) || projectId <= 0 ||
            !Number.isInteger(userId) || userId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID or user ID.'
            });
        }

        const result = await pool.query(
            `DELETE FROM project_members pm
             USING projects p
             WHERE pm.project_id = $1
             AND pm.user_id = $2
             AND p.id = pm.project_id
             AND p.owner_id = $3
             AND pm.user_id <> p.owner_id
             RETURNING pm.id`,
            [projectId, userId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Member not found, or you cannot remove this member.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Team member removed successfully.'
        });

    } catch (error) {
        console.error('Remove project member error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to remove team member.'
        });
    }
};

// DELETE: Logged-in member leaves a project
export const leaveProject = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID.'
            });
        }

        const result = await pool.query(
            `DELETE FROM project_members pm
             USING projects p
             WHERE pm.project_id = $1
             AND pm.user_id = $2
             AND p.id = pm.project_id
             AND p.owner_id <> $2
             RETURNING pm.id`,
            [projectId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'You are not a member of this project, or the project owner cannot leave.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'You have left the project.'
        });

    } catch (error) {
        console.error('Leave project error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to leave project.'
        });
    }
};