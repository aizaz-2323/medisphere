# MediSphere Project Memory

## Step 1 — Project Setup

### What we built
- Backend and frontend initialized
- Git/GitHub connected
- Docker/PostgreSQL configured

### Important files
- docker-compose.yml
- Dockerfile
- package.json

### Important concepts
- Docker image vs container
- Environment variables
- Git commits/pushes

---

## Step 2 — Database

### What we built
- PostgreSQL database
- Users table
- Roles table

### Important concepts
- Primary key
- Foreign key
- role_id connects users → roles

---

## Step 3 — Authentication

### What we built
- Signup
- Password hashing with bcrypt
- Login

### Important concepts
- Passwords are never stored as plain text
- bcrypt compares entered password with hash

---

## Step 4 — JWT Authentication

### What we built
- JWT generated during login
- verifyToken middleware

### Important concept
Authentication asks:

"Who are you?"

---

## Step 5 — Google OAuth

### What we built
- Google login
- OAuth callback
- JWT generated after Google authentication

### Important concept
Google verifies the user's identity,
then MediSphere creates its own JWT.

---

## Step 6 — RBAC

### What we built
- requireRole middleware
- Doctor/Admin/multi-role route protection
- Role-aware frontend UI

### Important concept
Authorization asks:

"What are you allowed to do?"

### Important files
- backend/middleware/requireRole.js
- backend/routes/clinicRoutes.js
- frontend/src/pages/Dashboard.jsx

### Testing
- No token → 401
- Wrong role → 403
- Correct role → 200