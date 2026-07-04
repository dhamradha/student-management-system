# Student Data Management System

Official student records portal for **Hunuwala Dharmaraja Vidyalaya** (1,000 students).
Built to the [SRS V2](./School%20Management%20System%20-%20Student%20Data%20SRS%20V2.pdf).

## Stack

| Layer     | Choice                                                        |
| --------- | ------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, TypeScript, Turbopack)                |
| UI        | shadcn/ui (`base-nova` / Base UI) + Tailwind v4               |
| Backend   | Firebase — Auth + Cloud Firestore (Blaze plan)               |
| Forms     | react-hook-form + zod                                         |
| i18n      | Custom EN/Sinhala context, LocalStorage-persisted, no reload  |

## Architecture

```
src/
  app/                 Routes (App Router)
    (auth)/            login (student + staff), register
    dashboard/         post-login role router
    student/           onboarding wizard + student dashboard
    admin/             ADMIN console (verify + filter cohorts)
    super-admin/       SUPER_ADMIN console (stats + oversight)
  components/          ui/ (shadcn) · layout/ · brand/ · status-badge
  features/
    auth/              AuthProvider, RoleGate
    onboarding/        two-phase wizard (academic → guardian)
    admin/             students table + verification
  lib/
    firebase/          client.ts, admin.ts (server-only), config.ts
    i18n/              provider + en/si dictionaries
    services/          Firestore data access (users)
    validations/       zod schemas
    constants/         academic structure, roles
    auth/              admission-number → email mapping
  types/               domain model
firestore.rules        RBAC enforcement (source of truth)
firestore.indexes.json cohort-query indexes
scripts/               provision-staff.mjs (bootstrap admins)
```

### RBAC (SRS §3)

| Role          | Access                                                    |
| ------------- | --------------------------------------------------------- |
| `SUPER_ADMIN` | Full read/write/delete; manage roles; review logs         |
| `ADMIN`       | Read all students; verify submissions; filter by cohort   |
| `STUDENT`     | Read/write **own** document only; complete onboarding      |

Enforcement is **defense-in-depth**: `firestore.rules` is the real boundary;
`RoleGate` only governs UI routing.

### Authentication

- **Students** log in with their **admission number** + password. The admission
  number is mapped to a synthetic Firebase Auth email
  (`<admissionNo>@students.hunuwala.lk`) so Firebase enforces uniqueness and
  password security. See `src/lib/auth/admission.ts`.
- **Staff** (ADMIN / SUPER_ADMIN) log in with email + password.

## Setup

1. **Install**
   ```bash
   npm install
   ```
2. **Configure Firebase** — copy `.env.local.example` to `.env.local` and fill in
   the web config + Admin service-account values (Firebase Console → Project
   settings).
3. **Deploy security rules & indexes**
   ```bash
   npx firebase deploy --only firestore:rules,firestore:indexes
   ```
4. **Bootstrap the first super admin**
   ```bash
   node --env-file=.env.local scripts/provision-staff.mjs admin@school.lk "StrongPass1" SUPER_ADMIN
   ```
5. **Run**
   ```bash
   npm run dev
   ```

## Scripts

| Command                 | Purpose                          |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Dev server (Turbopack)           |
| `npm run build`         | Production build                 |
| `npm run lint`          | ESLint                           |
| `provision-staff.mjs`   | Create ADMIN / SUPER_ADMIN users |
