# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dental clinic appointment booking system (Aniversario Dental Care) with a public registration form and admin dashboard. Built with Next.js 16 App Router, React 19, Tailwind CSS 4, and PostgreSQL via Supabase.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Pages (App Router)
- `app/page.tsx` - Public landing page with patient registration form
- `app/login/page.tsx` - Admin login (password auth with httpOnly cookie)
- `app/leads/page.tsx` - Admin dashboard showing all registrations

### API Routes
- `POST /api/leads` - Create new lead (validates: nombre, telefono, edad required; cedula required if age >= 18)
- `GET /api/leads` - Fetch all leads
- `GET /api/limit` - Get current patient limit and count
- `PUT /api/limit` - Update patient appointment limit
- `POST /api/auth` - Admin login (sets 8-hour cookie)
- `DELETE /api/auth` - Admin logout

### Database
- `lib/db.ts` - PostgreSQL connection pool (singleton pattern)
- Tables configured via env vars: `TABLE_LEAD_CONTACTS` and `LIMIT_TABLE`

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (transaction pooler) |
| `DIRECT_URL` | PostgreSQL direct connection (for migrations) |
| `ADMIN_PASSWORD` | Admin panel password |
| `TABLE_LEAD_CONTACTS` | Leads table name |
| `LIMIT_TABLE` | Patient limit table name |
| `NEXT_PUBLIC_APP_URL` | Public app URL (client-accessible) |

## Key Patterns

- Form validation: cedula (ID) is optional for minors (age < 18)
- Slot management: When limit is reached, form shows "cupos agotados" (sold out) banner
- Admin auth: Simple password validation against `ADMIN_PASSWORD` env var
- Path alias: `@/*` maps to project root
