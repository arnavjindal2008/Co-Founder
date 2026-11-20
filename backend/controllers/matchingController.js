import pool from '../config/db.js';

// GET: Find potential co-founder matches for logged-in user
export const getMatches = async (req, res) => {
    try {
        const currentPage = Math.max(
            parseInt(req.query.page, 10) || 1,
            1
        );

        const pageLimit = Math.min(
            Math.max(parseInt(req.query.limit, 10) || 10, 1),
            50
        );

        const offset = (currentPage - 1) * pageLimit;

        const result = await pool.query(
            `
            WITH my_skills AS (
                SELECT skill_id
                FROM user_skills
                WHERE user_id = $1
            ),
            my_interests AS (
                SELECT interest_id
                FROM user_interests
                WHERE user_id = $1
            ),
            my_profile AS (
                SELECT COALESCE(
                (SELECT availability FROM profiles WHERE user_id = $1),'') AS availability),
                
            candidate_matches AS (
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

                    (
                        SELECT COUNT(*)
                        FROM user_skills us
                        JOIN my_skills ms
                            ON ms.skill_id = us.skill_id
                        WHERE us.user_id = u.id
                    ) AS shared_skill_count,

                    (
                        SELECT COUNT(*)
                        FROM user_interests ui
                        JOIN my_interests mi
                            ON mi.interest_id = ui.interest_id
                        WHERE ui.user_id = u.id
                    ) AS shared_interest_count,

                    (
                        SELECT COALESCE(
                            JSONB_AGG(s.name ORDER BY s.name),
                            '[]'::jsonb
                        )
                        FROM user_skills us
                        JOIN skills s ON s.id = us.skill_id
                        JOIN my_skills ms ON ms.skill_id = us.skill_id
                        WHERE us.user_id = u.id
                    ) AS shared_skills,

                    (
                        SELECT COALESCE(
                            JSONB_AGG(i.name ORDER BY i.name),
                            '[]'::jsonb
                        )
                        FROM user_interests ui
                        JOIN interests i ON i.id = ui.interest_id
                        JOIN my_interests mi
                            ON mi.interest_id = ui.interest_id
                        WHERE ui.user_id = u.id
                    ) AS shared_interests,

                    CASE
                        WHEN p.availability IS NOT NULL
                        AND p.availability <> ''
                        AND p.availability = mp.availability
                        THEN 2
                        ELSE 0
                    END AS availability_score

                FROM users u
                LEFT JOIN profiles p ON p.user_id = u.id
                CROSS JOIN my_profile mp
                WHERE u.id <> $1
            )
            SELECT
                *,
                (
                    shared_skill_count * 2
                    + shared_interest_count
                    + availability_score
                ) AS match_score
            FROM candidate_matches
            ORDER BY
                match_score DESC,
                shared_skill_count DESC,
                shared_interest_count DESC,
                user_id ASC
            LIMIT $2
            OFFSET $3
            `,
            [req.user.id, pageLimit, offset]
        );

        const countResult = await pool.query(
            `SELECT COUNT(*) AS total
             FROM users
             WHERE id <> $1`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: 'Potential co-founder matches fetched successfully.',
            pagination: {
                currentPage,
                limit: pageLimit,
                totalUsers: Number(countResult.rows[0].total),
                totalPages: Math.ceil(
                    Number(countResult.rows[0].total) / pageLimit
                )
            },
            matchingCriteria: {
                sharedSkillPoints: 2,
                sharedInterestPoints: 1,
                sameAvailabilityPoints: 2
            },
            matches: result.rows
        });

    } catch (error) {
        console.error('Get matches error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to find co-founder matches.'
        });
    }
};