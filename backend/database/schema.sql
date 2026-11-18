BEGIN;

-- 1. DROP EXISTING TABLES
-- Drop child tables before parent tables.

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS project_roles CASCADE;
DROP TABLE IF EXISTS project_skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;


-- 2. USERS
-- Stores user account and authentication information.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- 3. PROFILES
-- One user can have one professional profile.

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    profile_picture TEXT,
    headline VARCHAR(255),
    bio TEXT,
    education TEXT,
    experience TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    availability VARCHAR(100),
    collaboration_preferences TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- 4. SKILLS
-- Stores available technical and non-technical skills.

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- 5. USER_SKILLS
-- Many-to-many relationship between users and skills.

CREATE TABLE user_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE CASCADE,

    UNIQUE (user_id, skill_id)
);


-- 6. INTERESTS
-- Stores areas of interest such as EdTech and FinTech.

CREATE TABLE interests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- 7. USER_INTERESTS
-- Many-to-many relationship between users and interests.

CREATE TABLE user_interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    interest_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (interest_id)
        REFERENCES interests(id)
        ON DELETE CASCADE,

    UNIQUE (user_id, interest_id)
);


-- 8. PROJECTS
-- Stores startup and project information.

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    problem_statement TEXT,
    industry VARCHAR(150),
    project_stage VARCHAR(100),
    collaboration_type VARCHAR(100),
    expected_commitment VARCHAR(150),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- 9. PROJECT_SKILLS
-- Many-to-many relationship between projects and skills.

CREATE TABLE project_skills (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE CASCADE,

    UNIQUE (project_id, skill_id)
);


-- 10. PROJECT_ROLES
-- Stores roles and the number of members required.

CREATE TABLE project_roles (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    role_name VARCHAR(150) NOT NULL,
    description TEXT,
    required_members INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CHECK (required_members > 0)
);


-- 11. CONNECTIONS
-- Stores connection requests between users.

CREATE TABLE connections (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (requester_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (recipient_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CHECK (requester_id <> recipient_id),
    CHECK (status IN ('pending', 'accepted', 'rejected')),

    UNIQUE (requester_id, recipient_id)
);


-- 12. APPLICATIONS
-- Stores applications submitted by users to projects.
-- The applicant can optionally specify the role they want.

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    applicant_id INTEGER NOT NULL,
    desired_role VARCHAR(150),
    application_message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (applicant_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CHECK (status IN ('pending', 'accepted', 'rejected')),

    UNIQUE (project_id, applicant_id)
);


-- 13. PROJECT_MEMBERS
-- Stores users who are part of a project team.

CREATE TABLE project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role_name VARCHAR(150),
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE (project_id, user_id)
);


-- 14. NOTIFICATIONS
-- Stores notifications received by users.

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    actor_id INTEGER,
    notification_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (actor_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- 15. INDEXES
-- Indexes on foreign keys used for joins and filtering.

CREATE INDEX idx_profiles_user_id
ON profiles(user_id);

CREATE INDEX idx_user_skills_user_id
ON user_skills(user_id);

CREATE INDEX idx_user_skills_skill_id
ON user_skills(skill_id);

CREATE INDEX idx_user_interests_user_id
ON user_interests(user_id);

CREATE INDEX idx_user_interests_interest_id
ON user_interests(interest_id);

CREATE INDEX idx_projects_owner_id
ON projects(owner_id);

CREATE INDEX idx_projects_industry
ON projects(industry);

CREATE INDEX idx_projects_stage
ON projects(project_stage);

CREATE INDEX idx_project_skills_project_id
ON project_skills(project_id);

CREATE INDEX idx_project_skills_skill_id
ON project_skills(skill_id);

CREATE INDEX idx_project_roles_project_id
ON project_roles(project_id);

CREATE INDEX idx_connections_requester_id
ON connections(requester_id);

CREATE INDEX idx_connections_recipient_id
ON connections(recipient_id);

CREATE INDEX idx_connections_status
ON connections(status);

CREATE INDEX idx_applications_project_id
ON applications(project_id);

CREATE INDEX idx_applications_applicant_id
ON applications(applicant_id);

CREATE INDEX idx_applications_status
ON applications(status);

CREATE INDEX idx_project_members_project_id
ON project_members(project_id);

CREATE INDEX idx_project_members_user_id
ON project_members(user_id);

CREATE INDEX idx_notifications_user_id
ON notifications(user_id);

COMMIT;