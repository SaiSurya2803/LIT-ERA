# 🌟 Litera Club – Literary Platform

A modern full-stack literary magazine platform built with **React, Node.js, and PostgreSQL**, featuring submission management, admin dashboard, authentication,  and file upload capabilities.

---

## 🚀 Quick Start

### 📌 Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (or SQLite for development)
- npm or yarn

---

## ⚙️ Installation

### 1️⃣ Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd litera-club
npm install
```

---

### 2️⃣ Database Setup

#### 🔹 Option A: PostgreSQL (Production)

```bash
# Install PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create Database
psql -U postgres -c "CREATE DATABASE litera_club;"

# Configure Environment
cp .env.example .env
```

Update `.env` file:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/litera_club
SESSION_SECRET=your-secret-key
ADMIN_CODE=admin123
NODE_ENV=development
```

---

#### 🔹 Option B: SQLite (Development)

```bash
npm install better-sqlite3 @types/better-sqlite3
cp .env.example .env
```

Update `.env`:

```env
DATABASE_URL=sqlite:./litera_club.db
SESSION_SECRET=your-secret-key
ADMIN_CODE=admin123
NODE_ENV=development
```

---

### 3️⃣ Run Database Migration

```bash
npm run db:push
```

---

### 4️⃣ Start Development Server

```bash
npm run dev
```

Application runs at:

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000  

---

# 📁 Project Structure

```
litera-club/
├── client/              # React frontend
├── server/              # Express backend
├── shared/              # Shared schemas and types
├── uploads/             # File storage
└── drizzle.config.ts
```

---

# 🎯 Features

## 🌍 Public Features
- Browse literary content (thoughts, poems, riddles, quotes)
- View events and club zones
- Submit magazine work
- Contact form
- Interactive games (Strands, Spelling Bee)
- MUN information page

---

## 👤 User Features (Login Required)
- Register for events
- Join literary zones
- Register for MUN conferences
- Submit game scores
- Track personal registrations

---

## 👑 Admin Features
- Manage submissions
- Create and edit content
- Upload daily puzzles
- Manage users
- View analytics and game scores
- Monitor registrations

---

# 🛠️ Tech Stack

## Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Wouter
- Framer Motion
- Shadcn/ui

## Backend
- Node.js + Express
- PostgreSQL
- Drizzle ORM
- Express Session
- Bcrypt
- Zod Validation
- Multer (File Uploads)

---

# 🗄️ Database Tables

- users
- content
- events
- puzzles
- submissions
- game_scores
- contact_submissions
- event_registrations
- zone_memberships
- mun_registrations

---

# 🔐 Security Features

- Password hashing using bcrypt
- Session-based authentication
- Role-based access control
- Input validation with Zod
- SQL Injection prevention (Drizzle ORM)
- File type & size validation
- Secure file storage

---

# 🔌 API Endpoints

## Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

## Submissions
- POST /api/submissions
- GET /api/submissions (Admin)
- GET /api/submissions/:id/download (Admin)

## Content
- GET /api/content
- POST /api/content (Admin)

## Events
- GET /api/events
- POST /api/events (Admin)
- POST /api/events/:id/register

## Games
- GET /api/puzzles
- POST /api/game-scores

## Contact
- POST /api/contact
- GET /api/contacts (Admin)

---

# 📦 Available Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run db:push    # Push schema changes
npm run db:studio  # Open Drizzle Studio
npm run check      # Type checking
```

---

# 🚀 Deployment

### Production Environment Variables

```env
DATABASE_URL=your-production-db-url
SESSION_SECRET=strong-random-secret
ADMIN_CODE=secure-admin-code
NODE_ENV=production
```

Then run:

```bash
npm run build
npm run db:push
npm run start
```

---

# 🧪 Testing Checklist

### Public
- [ ] Browse content
- [ ] Submit magazine work
- [ ] Submit contact form
- [ ] Play games

### User
- [ ] Register / Login
- [ ] Join zones
- [ ] Register for events
- [ ] Submit scores

### Admin
- [ ] Create content
- [ ] Upload puzzles
- [ ] View submissions
- [ ] Manage users

---

# 📄 License

This project is licensed under the MIT License.

---

# 👥 Authors

**LIT'ERA Club Development Team**

---

**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Last Updated:** February 2026  
