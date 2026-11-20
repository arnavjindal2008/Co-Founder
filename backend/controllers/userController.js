import pool from '../config/db.js';

// GET: Discover users with search, filters and pagination
export const discoverUsers = async (req, res) => {
    try {
        const {
            q = '',
            skill = '',
            interest = '',
            availability = '',
            page = 1,
            limit = 10
        } = req.query;

        const currentPage = Math.max(parseInt(page, 10) || 1, 1);
        const pageLimit = Math.min(
            Math.max(parseInt(limit, 10) || 10, 1),
            50
        );

        const offset = (currentPage - 1) * pageLimit;

        const values = [req.user.id];
        const conditions = ['u.id <> $1'];

        // Search by name, headline or bio
        if (q.trim()) {
            values.push(`%${q.trim()}%`);
            const index = values.length;

            conditions.push(`
                (
                    p.full_name ILIKE $${index}
                    OR p.headline ILIKE $${index}
                    OR p.bio ILIKE $${index}
                )
            `);
        }

        // Filter by skill name
        if (skill.trim()) {
            values.push(skill.trim());
            const index = values.length;

            conditions.push(`
                EXISTS (
                    SELECT 1
                    FROM user_skills us
                    JOIN skills s ON s.id = us.skill_id
                    WHERE us.user_id = u.id
                    AND s.name ILIKE $${index}
                )
            `);
        }

        // Filter by interest name
        if (interest.trim()) {
            values.push(interest.trim());
            const index = values.length;

            conditions.push(`
                EXISTS (
                    SELECT 1
                    FROM user_interests ui
                    JOIN interests i ON i.id = ui.interest_id
                    WHERE ui.user_id = u.id
                    AND i.name ILIKE $${index}
                )
            `);
        }

        // Filter by availability
        if (availability.trim()) {
            values.push(availability.trim());
            const index = values.length;

            conditions.push(`p.availability ILIKE $${index}`);
        }

        const whereClause = conditions.join(' AND ');

        // Count matching users
        const countResult = await pool.query(
            `
                SELECT COUNT(*) AS total
                FROM users u
                LEFT JOIN profiles p ON p.user_id = u.id
                WHERE ${whereClause}
            `,
            values
        );

        const totalUsers = Number(countResult.rows[0].total);

        // Fetch matching users and their skills/interests
        const result = await pool.query(
            `
                SELECT
                    u.id AS user_id,
                    p.full_name,
                    p.profile_picture,
                    p.headline,
                    p.bio,
                    p.education,
                    p.experience,
                    p.github_url,
                    p.portfolio_url,
                    p.availability,
                    p.collaboration_preferences,

                    COALESCE(
                        (
                            SELECT JSONB_AGG(
                                JSONB_BUILD_OBJECT(
                                    'id', s.id,
                                    'name', s.name
                                )
                                ORDER BY s.name
                            )
                            FROM user_skills us
                            JOIN skills s ON s.id = us.skill_id
                            WHERE us.user_id = u.id
                        ),
                        '[]'::jsonb
                    ) AS skills,

                    COALESCE(
                        (
                            SELECT JSONB_AGG(
                                JSONB_BUILD_OBJECT(
                                    'id', i.id,
                                    'name', i.name
                                )
                                ORDER BY i.name
                            )
                            FROM user_interests ui
                            JOIN interests i ON i.id = ui.interest_id
                            WHERE ui.user_id = u.id
                        ),
                        '[]'::jsonb
                    ) AS interests

                FROM users u
                LEFT JOIN profiles p ON p.user_id = u.id
                WHERE ${whereClause}
                ORDER BY p.full_name ASC NULLS LAST, u.id ASC
                LIMIT $${values.length + 1}
                OFFSET $${values.length + 2}
            `,
            [...values, pageLimit, offset]
        );

        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully.',
            pagination: {
                currentPage,
                limit: pageLimit,
                totalUsers,
                totalPages: Math.ceil(totalUsers / pageLimit)
            },
            users: result.rows
        });

    } catch (error) {
        console.error('Discover users error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to discover users.'
        });
    }
};
