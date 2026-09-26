# PRESEC GHANA

> One Community. Many Generations. One Future.

The digital home of Presbyterian Secondary School alumni, students, teachers, and staff across Ghana.

## What It Is

PRESEC GHANA is a full-stack community platform that connects PRESEC branches across all 16 regions of Ghana. It begins with **PRESEC Tema Community 11** and is architected to support every PRESEC branch.

## Features

### For Alumni
- 📇 Searchable alumni directory with filters
- 🎓 Year group communities
- 📅 Event registration with QR tickets
- 💼 Jobs, internships, and scholarships
- 🤝 Mentorship matching
- 🏢 Business directory
- 🏗️ Project contributions with transparency
- 📰 News and announcements
- 📸 Heritage archive and gallery

### For Administrators
- ✅ Alumni verification workflow
- 📅 Event creation and check-in
- 🏗️ Project management
- 📰 Content publishing
- 👥 User and role management

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | NestJS 12, Node.js |
| Database | PostgreSQL 18 |
| ORM | TypeORM |
| Auth | JWT + Passport |
| Styling | Custom PRESEC brand palette |

## Project Structure

\`\`\`
presec-ghana/
├── backend/         # NestJS API
├── frontend/        # Next.js website
├── database/        # SQL schema
└── docs/            # Documentation
\`\`\`

## Getting Started (Development)

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm 10+

### Backend Setup

\`\`\`bash
cd backend
npm install
cp .env.example .env   # configure DB credentials
npm run start:dev
\`\`\`

Runs on http://localhost:3000/api/v1

### Frontend Setup

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Runs on http://localhost:3001

### Database Setup

\`\`\`bash
psql -U presec_admin -d presec_ghana -f database/schema.sql
\`\`\`

## API Overview

All endpoints are prefixed with `/api/v1`. Public endpoints are marked 🌐, authenticated with 🔒.

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /auth/register | 🌐 |
| POST | /auth/login | 🌐 |
| GET | /auth/me | 🔒 |
| GET | /schools | 🌐 |
| GET | /alumni/search | 🌐 |
| GET | /alumni/me | 🔒 |
| PUT | /alumni/me | 🔒 |
| GET | /events | 🌐 |
| POST | /events/:id/register | 🔒 |
| GET | /projects | 🌐 |
| POST | /projects/:id/contribute | 🔒 |
| GET | /announcements | 🌐 |
| GET | /opportunities | 🌐 |
| GET | /mentorship/offers | 🌐 |
| GET | /businesses | 🌐 |

See the docs folder for full API reference.

## Roadmap

- [x] Phase 1 — Requirements
- [x] Phase 2 — Architecture & database
- [x] Phase 3 — UI/UX design
- [x] Phase 4 — Backend (11 modules)
- [x] Phase 5 — Frontend (20 pages)
- [ ] Phase 6 — Deployment
- [ ] Phase 7 — Email verification & password reset
- [ ] Phase 8 — Admin dashboard
- [ ] Phase 9 — Mobile app (Flutter)
- [ ] Phase 10 — Multi-branch expansion
- [ ] Phase 11 — AI assistant

## Brand

- **Primary Blue:** #1B3A6B
- **Secondary Gold:** #C9A227
- **Font:** Inter
- **Motto:** LUMINE — Let Your Light Shine

## License

© PRESEC GHANA. All rights reserved.

Built with ❤️ for the PRESEC community.
\`\`\`

Save.

---

## 🔒 Step 3: Commit the README

```bash
git add README.md
git commit -m "docs: add comprehensive project README"
