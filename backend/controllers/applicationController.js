import pool from '../config/db.js';

// POST: Apply to join a project
export const applyToProject = async (req, res) => {
    try {
        const applicantId = req.user.id;
        const projectId = Number(req.params.projectId);
        const { desired_role, application_message = '' } = req.body;

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID.'
            });
        }

        if (!desired_role || !desired_role.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Desired role is required.'
            });
        }

        const projectResult = await pool.query(
            'SELECT id, owner_id FROM projects WHERE id = $1',
            [projectId]
        );

        if (projectResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        if (Number(projectResult.rows[0].owner_id) === Number(applicantId)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot apply to your own project.'
            });
        }

        const result = await pool.query(
            `INSERT INTO applications
                (project_id, applicant_id, desired_role, application_message, status)
             VALUES ($1, $2, $3, $4, 'pending')
             ON CONFLICT (project_id, applicant_id) DO NOTHING
             RETURNING id, project_id, applicant_id, desired_role,
                       application_message, status, created_at`,
            [
                projectId,
                applicantId,
                desired_role.trim(),
                application_message.trim()
            ]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({
                success: false,
                message: 'You have already applied to this project.'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully.',
            application: result.rows[0]
        });

    } catch (error) {
        console.error('Apply to project error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to submit application.'
        });
    }
};

// GET: Applications submitted by logged-in user
export const getMyApplications = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                a.id AS application_id,
                a.project_id,
                a.desired_role,
                a.application_message,
                a.status,
                a.created_at,
                p.project_name,
                p.description,
                p.project_stage,
                p.collaboration_type,
                p.expected_commitment,
                owner.id AS owner_id,
                owner_profile.full_name AS owner_name
             FROM applications a
             JOIN projects p ON p.id = a.project_id
             JOIN users owner ON owner.id = p.owner_id
             LEFT JOIN profiles owner_profile
                ON owner_profile.user_id = owner.id
             WHERE a.applicant_id = $1
             ORDER BY a.created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            applications: result.rows
        });

    } catch (error) {
        console.error('Get my applications error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch your applications.'
        });
    }
};

// GET: Applications received for a project owned by logged-in user
export const getProjectApplications = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID.'
            });
        }

        const projectResult = await pool.query(
            `SELECT id
             FROM projects
             WHERE id = $1 AND owner_id = $2`,
            [projectId, req.user.id]
        );

        if (projectResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or you are not its owner.'
            });
        }

        const result = await pool.query(
            `SELECT
                a.id AS application_id,
                a.applicant_id,
                a.desired_role,
                a.application_message,
                a.status,
                a.created_at,
                p.full_name,
                p.profile_picture,
                p.headline,
                p.bio
             FROM applications a
             LEFT JOIN profiles p ON p.user_id = a.applicant_id
             WHERE a.project_id = $1
             ORDER BY a.created_at DESC`,
            [projectId]
        );

        return res.status(200).json({
            success: true,
            applications: result.rows
        });

    } catch (error) {
        console.error('Get project applications error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch project applications.'
        });
    }
};

// PATCH: Accept or reject an application
export const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = Number(req.params.applicationId);
        const { status } = req.body;

        if (!Number.isInteger(applicationId) || applicationId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID.'
            });
        }

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be accepted or rejected.'
            });
        }

        const result = await pool.query(
            `UPDATE applications a
             SET status = $1
             FROM projects p
             WHERE a.id = $2
             AND p.id = a.project_id
             AND p.owner_id = $3
             AND a.status = 'pending'
             RETURNING a.id, a.project_id, a.applicant_id,
                       a.desired_role, a.status`,
            [status, applicationId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pending application not found, or you do not own its project.'
            });
        }

        return res.status(200).json({
            success: true,
            message: `Application ${status} successfully.`,
            application: result.rows[0]
        });

    } catch (error) {
        console.error('Update application status error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to update application status.'
        });
    }
};

// DELETE: Withdraw your own pending application
export const withdrawApplication = async (req, res) => {
    try {
        const applicationId = Number(req.params.applicationId);

        if (!Number.isInteger(applicationId) || applicationId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID.'
            });
        }

        const result = await pool.query(
            `DELETE FROM applications
             WHERE id = $1
             AND applicant_id = $2
             AND status = 'pending'
             RETURNING id`,
            [applicationId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pending application not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Application withdrawn successfully.'
        });

    } catch (error) {
        console.error('Withdraw application error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to withdraw application.'
        });
    }
};