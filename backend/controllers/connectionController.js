import pool from '../config/db.js';

// POST: Send connection request
export const sendConnectionRequest = async (req, res) => {
    try {
        const requesterId = req.user.id;
        const recipientId = Number(req.body.recipientId);

        if (!Number.isInteger(recipientId) || recipientId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'A valid recipientId is required.'
            });
        }

        if (Number(requesterId) === recipientId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot connect with yourself.'
            });
        }

        const recipient = await pool.query(
            'SELECT id FROM users WHERE id = $1',
            [recipientId]
        );

        if (recipient.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const existing = await pool.query(
            `SELECT id, requester_id, recipient_id, status
             FROM connections
             WHERE (requester_id = $1 AND recipient_id = $2)
                OR (requester_id = $2 AND recipient_id = $1)
             ORDER BY id DESC
             LIMIT 1`,
            [requesterId, recipientId]
        );

        if (existing.rowCount > 0) {
            const connection = existing.rows[0];

            if (connection.status === 'accepted') {
                return res.status(409).json({
                    success: false,
                    message: 'You are already connected.'
                });
            }

            if (connection.status === 'pending') {
                return res.status(409).json({
                    success: false,
                    message: 'A connection request is already pending.'
                });
            }

            if (
                Number(connection.requester_id) === Number(requesterId) &&
                connection.status === 'rejected'
            ) {
                const updated = await pool.query(
                    `UPDATE connections
                     SET status = 'pending'
                     WHERE id = $1
                     RETURNING *`,
                    [connection.id]
                );

                return res.status(200).json({
                    success: true,
                    message: 'Connection request sent again.',
                    connection: updated.rows[0]
                });
            }
        }

        const result = await pool.query(
            `INSERT INTO connections
                (requester_id, recipient_id, status)
             VALUES ($1, $2, 'pending')
             RETURNING *`,
            [requesterId, recipientId]
        );

        return res.status(201).json({
            success: true,
            message: 'Connection request sent successfully.',
            connection: result.rows[0]
        });

    } catch (error) {
        console.error('Send connection request error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to send connection request.'
        });
    }
};

// GET: Incoming requests
export const getIncomingRequests = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                c.id AS connection_id,
                c.created_at,
                u.id AS user_id,
                p.full_name,
                p.profile_picture,
                p.headline,
                p.bio
             FROM connections c
             JOIN users u ON u.id = c.requester_id
             LEFT JOIN profiles p ON p.user_id = u.id
             WHERE c.recipient_id = $1
             AND c.status = 'pending'
             ORDER BY c.created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            requests: result.rows
        });

    } catch (error) {
        console.error('Incoming requests error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch incoming requests.'
        });
    }
};

// GET: Outgoing requests
export const getOutgoingRequests = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                c.id AS connection_id,
                c.created_at,
                u.id AS user_id,
                p.full_name,
                p.profile_picture,
                p.headline,
                p.bio
             FROM connections c
             JOIN users u ON u.id = c.recipient_id
             LEFT JOIN profiles p ON p.user_id = u.id
             WHERE c.requester_id = $1
             AND c.status = 'pending'
             ORDER BY c.created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            requests: result.rows
        });

    } catch (error) {
        console.error('Outgoing requests error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch outgoing requests.'
        });
    }
};

// PATCH: Accept request
export const acceptConnectionRequest = async (req, res) => {
    try {
        const connectionId = Number(req.params.connectionId);

        if (!Number.isInteger(connectionId) || connectionId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid connection ID.'
            });
        }

        const result = await pool.query(
            `UPDATE connections
             SET status = 'accepted'
             WHERE id = $1
             AND recipient_id = $2
             AND status = 'pending'
             RETURNING *`,
            [connectionId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pending request not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Connection request accepted.',
            connection: result.rows[0]
        });

    } catch (error) {
        console.error('Accept request error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to accept request.'
        });
    }
};

// PATCH: Reject request
export const rejectConnectionRequest = async (req, res) => {
    try {
        const connectionId = Number(req.params.connectionId);

        if (!Number.isInteger(connectionId) || connectionId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid connection ID.'
            });
        }

        const result = await pool.query(
            `UPDATE connections
             SET status = 'rejected'
             WHERE id = $1
             AND recipient_id = $2
             AND status = 'pending'
             RETURNING *`,
            [connectionId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pending request not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Connection request rejected.',
            connection: result.rows[0]
        });

    } catch (error) {
        console.error('Reject request error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to reject request.'
        });
    }
};

// DELETE: Cancel outgoing request
export const cancelConnectionRequest = async (req, res) => {
    try {
        const connectionId = Number(req.params.connectionId);

        if (!Number.isInteger(connectionId) || connectionId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid connection ID.'
            });
        }

        const result = await pool.query(
            `DELETE FROM connections
             WHERE id = $1
             AND requester_id = $2
             AND status = 'pending'
             RETURNING id`,
            [connectionId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pending outgoing request not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Connection request cancelled.'
        });

    } catch (error) {
        console.error('Cancel request error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to cancel request.'
        });
    }
};

// GET: Accepted connections
export const getMyConnections = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                c.id AS connection_id,
                c.created_at AS connected_at,
                u.id AS user_id,
                p.full_name,
                p.profile_picture,
                p.headline,
                p.bio
             FROM connections c
             JOIN users u
               ON u.id = CASE
                   WHEN c.requester_id = $1
                   THEN c.recipient_id
                   ELSE c.requester_id
               END
             LEFT JOIN profiles p ON p.user_id = u.id
             WHERE (
                 c.requester_id = $1 OR c.recipient_id = $1
             )
             AND c.status = 'accepted'
             ORDER BY c.created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            connections: result.rows
        });

    } catch (error) {
        console.error('Get connections error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch connections.'
        });
    }
};
