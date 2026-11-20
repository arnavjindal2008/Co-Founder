import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const onlineUsers = new Map();

export default function initializeSocket(io) {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error('Authentication token required'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = String(decoded.id);

            next();
        } catch {
            next(new Error('Invalid or expired token'));
        }
    });

    io.on('connection', async (socket) => {
        const userId = socket.userId;

        try {
            // Every device/tab belonging to this user joins this room.
            socket.join(`user:${userId}`);

            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }

            onlineUsers.get(userId).add(socket.id);

            await pool.query(
                'UPDATE users SET last_seen_at = NULL WHERE id = $1',
                [userId]
            );

            socket.broadcast.emit('presence:update', {
                userId,
                status: 'online',
                lastSeen: null
            });

        } catch (error) {
            console.error('Socket connection setup error:', error);
        }

        socket.on('presence:check', async (userIds) => {
            try {
                if (!Array.isArray(userIds)) return;

                const validIds = [...new Set(
                    userIds
                        .map(Number)
                        .filter(id => Number.isInteger(id) && id > 0)
                )].slice(0, 100);

                if (validIds.length === 0) {
                    return socket.emit('presence:status', []);
                }

                const result = await pool.query(
                    `SELECT id, last_seen_at
                     FROM users
                     WHERE id = ANY($1::int[])`,
                    [validIds]
                );

                const statuses = result.rows.map(user => {
                    const id = String(user.id);
                    const isOnline = onlineUsers.has(id);

                    return {
                        userId: id,
                        status: isOnline ? 'online' : 'offline',
                        lastSeen: isOnline ? null : user.last_seen_at
                    };
                });

                socket.emit('presence:status', statuses);

            } catch (error) {
                console.error('Presence check error:', error);
            }
        });

        socket.on('disconnect', async () => {
            const userSockets = onlineUsers.get(userId);

            if (!userSockets) return;

            userSockets.delete(socket.id);

            if (userSockets.size === 0) {
                onlineUsers.delete(userId);

                try {
                    const result = await pool.query(
                        `UPDATE users
                         SET last_seen_at = CURRENT_TIMESTAMP
                         WHERE id = $1
                         RETURNING last_seen_at`,
                        [userId]
                    );

                    io.emit('presence:update', {
                        userId,
                        status: 'offline',
                        lastSeen: result.rows[0]?.last_seen_at ?? null
                    });

                } catch (error) {
                    console.error('Last seen update error:', error);
                }
            }
        });
    });

    console.log('Socket.IO initialized with presence and user rooms');
}
