import pool from '../config/db.js';

// Convert database rows into the format used by the frontend.
function formatProject(row) {
  let details = {
    summary: row.description,
    solution: '',
    goals: '',
    location: row.collaboration_type || '',
  };

  try {
    const parsed = JSON.parse(row.description);

    if (parsed && typeof parsed === 'object' && parsed.summary) {
      details = { ...details, ...parsed };
    }
  } catch {
    // Older projects may contain plain text descriptions.
  }

  return {
    id: row.id,
    title: row.project_name,
    name: row.project_name,
    description: details.summary,
    solution: details.solution,
    goals: details.goals,
    location: details.location || 'Not specified',
    category: row.industry || 'Other',
    stage: row.project_stage || 'Idea',
    commitment: row.expected_commitment || 'Flexible',
    status: 'Recruiting',
    founder: row.founder_name || 'Founder',
    ownerId: row.owner_id,
    members: Number(row.member_count || 0),
    requiredMembers: Number(row.required_members || 0),
    skills: row.skills || [],
    roles: row.roles || [],
    date: row.created_at,
    createdAt: row.created_at,
  };
}

// Common query used to fetch projects.
const projectListQuery = `
  SELECT
    p.id,
    p.owner_id,
    p.project_name,
    p.description,
    p.industry,
    p.project_stage,
    p.collaboration_type,
    p.expected_commitment,
    p.created_at,
    pr.full_name AS founder_name,

    COALESCE(
      (
        SELECT json_agg(s.name ORDER BY s.name)
        FROM project_skills ps
        JOIN skills s ON s.id = ps.skill_id
        WHERE ps.project_id = p.id
      ),
      '[]'::json
    ) AS skills,

    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', r.id,
            'title', r.role_name,
            'openings', r.required_members
          )
          ORDER BY r.id
        )
        FROM project_roles r
        WHERE r.project_id = p.id
      ),
      '[]'::json
    ) AS roles,

    COALESCE(
      (
        SELECT SUM(r.required_members)
        FROM project_roles r
        WHERE r.project_id = p.id
      ),
      0
    ) AS required_members,

    (
      SELECT COUNT(*)
      FROM project_members pm
      WHERE pm.project_id = p.id
    ) AS member_count

  FROM projects p
  LEFT JOIN profiles pr ON pr.user_id = p.owner_id
`;

// CREATE PROJECT
export const createProject = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      title,
      category,
      description,
      problem,
      solution,
      goals,
      stage,
      commitment,
      location,
      skills,
      roles,
    } = req.body;

    if (
      !title?.trim() ||
      !category ||
      !description?.trim() ||
      !problem?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required project fields.',
      });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one required skill.',
      });
    }

    if (!Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project roles.',
      });
    }

    const cleanSkills = [
      ...new Set(
        skills
          .filter((skill) => typeof skill === 'string')
          .map((skill) => skill.trim())
          .filter(Boolean)
      ),
    ];

    if (cleanSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one valid skill.',
      });
    }

    const cleanRoles = roles
      .filter((role) => role.title?.trim())
      .map((role) => ({
        title: role.title.trim(),
        openings: Number(role.openings) || 1,
      }));

    if (
      cleanRoles.some(
        (role) =>
          role.openings < 1 ||
          role.openings > 5 ||
          !Number.isInteger(role.openings)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Each role must have between 1 and 5 openings.',
      });
    }

    const savedDescription = JSON.stringify({
      summary: description.trim(),
      solution: solution?.trim() || '',
      goals: goals?.trim() || '',
      location: location?.trim() || '',
    });

    await client.query('BEGIN');

    const projectResult = await client.query(
      `INSERT INTO projects (
        owner_id,
        project_name,
        description,
        problem_statement,
        industry,
        project_stage,
        collaboration_type,
        expected_commitment
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id`,
      [
        req.user.id,
        title.trim(),
        savedDescription,
        problem.trim(),
        category,
        stage || 'Idea',
        location?.trim() || null,
        commitment || 'Flexible',
      ]
    );

    const projectId = projectResult.rows[0].id;

    await client.query(
      `INSERT INTO project_members (project_id, user_id, role_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (project_id, user_id) DO NOTHING`,
      [projectId, req.user.id, 'Founder']
    );

    for (const skill of cleanSkills) {
      const skillResult = await client.query(
        `INSERT INTO skills (name)
         VALUES ($1)
         ON CONFLICT (name)
         DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [skill]
      );

      await client.query(
        `INSERT INTO project_skills (project_id, skill_id)
         VALUES ($1, $2)
         ON CONFLICT (project_id, skill_id) DO NOTHING`,
        [projectId, skillResult.rows[0].id]
      );
    }

    for (const role of cleanRoles) {
      await client.query(
        `INSERT INTO project_roles (
          project_id,
          role_name,
          required_members
        )
        VALUES ($1, $2, $3)`,
        [projectId, role.title, role.openings]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      projectId,
    });
  } catch (error) {
    await client.query('ROLLBACK');

    console.error('Create project error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to create project.',
    });
  } finally {
    client.release();
  }
};

// GET ALL PROJECTS CREATED BY OTHER USERS
export const getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      `${projectListQuery}
       WHERE p.owner_id != $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      projects: result.rows.map(formatProject),
    });
  } catch (error) {
    console.error('Get projects error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch projects.',
    });
  }
};

// GET PROJECTS CREATED BY LOGGED-IN USER
export const getMyProjects = async (req, res) => {
  try {
    const result = await pool.query(
      `${projectListQuery}
       WHERE p.owner_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      projects: result.rows.map(formatProject),
    });
  } catch (error) {
    console.error('Get my projects error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch your projects.',
    });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      });
    }

    const result = await pool.query(
      `DELETE FROM projects
       WHERE id = $1 AND owner_id = $2
       RETURNING id`,
      [projectId, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you do not own this project.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    console.error('Delete project error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete project.',
    });
  }
};