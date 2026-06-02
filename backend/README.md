# Nexus Project Management Backend

This is a production-ready backend for the Nexus Project Management System. It provides a RESTful API using Node.js, Express, and MongoDB.

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy the `.env.example` file to `.env` and configure your environment variables:
```bash
cp .env.example .env
```
Ensure you have a MongoDB instance running and update the `MONGO_URI` in `.env`. Update `JWT_SECRET` to a strong random string.

### 3. Run the Server
For development (with nodemon):
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user & get token
- `GET /api/auth/profile` - Get current user profile (requires token)

### Projects (Requires Token)
- `GET /api/projects` - Get all projects for current user
- `POST /api/projects` - Create a project
- `GET /api/projects/:id` - Get a single project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks (Requires Token)
- `GET /api/tasks` - Get all tasks (can filter by `?projectId=...`)
- `POST /api/tasks` - Create a task
- `GET /api/tasks/:id` - Get a single task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Example Payloads

### Register User
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Project
```json
{
  "title": "Website Redesign",
  "description": "Redesign the corporate website.",
  "dueDate": "2023-12-31",
  "status": "Active"
}
```

### Create Task
```json
{
  "title": "Design homepage mockup",
  "description": "Create Figma designs for the new homepage.",
  "priority": "High",
  "status": "Pending",
  "dueDate": "2023-11-15",
  "projectId": "<PROJECT_ID>"
}
```
