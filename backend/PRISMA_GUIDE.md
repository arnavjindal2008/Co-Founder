
# Co-Founder - Prisma Developer Guide

## Database

We use PostgreSQL with Prisma ORM.

Database name: cofounder_db

## Prisma Connection

Always import the shared Prisma client:

```javascript
import prisma from "../config/prisma.js";
```

Do not create a new PrismaClient instance inside controllers.

## Examples

### 1. Get all users

```javascript
const users = await prisma.users.findMany();
```

### 2. Find a user by ID

```javascript
const user = await prisma.users.findUnique({
  where: {
    id: Number(userId),
  },
});
```

### 3. Create a project

```javascript
const project = await prisma.projects.create({
  data: {
    owner_id: Number(userId),
    project_name: "My Startup",
    description: "A startup project",
  },
});
```

### 4. Get projects

```javascript
const projects = await prisma.projects.findMany();
```

### 5. Update a project

```javascript
const project = await prisma.projects.update({
  where: {
    id: Number(projectId),
  },
  data: {
    project_name: "Updated Project",
  },
});
```

### 6. Delete a project

```javascript
const project = await prisma.projects.delete({
  where: {
    id: Number(projectId),
  },
});
```

## Important Rules

1. Use the shared Prisma client.
2. Do not create another database.
3. Do not use raw SQL for ordinary CRUD operations.
4. Do not modify the database manually.
5. Do not run prisma migrate dev independently.
6. All schema changes must be coordinated with the team.
7. Never commit .env files.
8. Use try/catch in controllers.
9. Validate request data before database operations.
10. Do not expose password_hash in API responses.

## Migration Commands

Generate Prisma Client:

npx prisma generate

Check migration status:

npx prisma migrate status

Create future migrations only after team approval.
