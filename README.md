# finwatch-hub — Expense Tracker

This repository contains a full-stack Expense Tracker application separated into two independently runnable parts: the frontend (React + Vite) and the backend (Node.js + Express).

---

## Project layout ✅

Root structure (standardized):

```
project-root/
├── frontend/        # React app (Vite + TypeScript)
│   ├── src/
│   └── package.json
├── backend/         # Express API
│   ├── controllers/
│   ├── routes/
│   └── package.json
└── README.md        # this file (how to run and structure)
```

Notes:
- The repository already has `frontend/` and `backend/` folders with their own `package.json` and source files.
- I did **not** move core source files because they are already organized correctly.

---

## How to run locally 🔧

Prerequisites: Node.js (v18+) and npm or bun.

Backend (API):

```powershell
cd backend
npm install
npm run dev
```

Frontend (UI):

```powershell
cd frontend
npm install
npm run dev
```

Each part runs independently and can be developed/tested independently.

---

## Files moved / cleanup decisions ✏️

- No code files needed to be moved — the project already follows the desired structure.
- **Flagged duplicates / recommended cleanup (do not delete automatically):**
	- `package.json` at repository root duplicates the frontend `package.json` (same content). Recommendation: keep one canonical `frontend/package.json` and either remove or replace the root `package.json` with a lightweight top-level orchestrator if you want top-level scripts.
	- `bun.lockb` exists both at root and under `frontend/`. Keep the lockfile where your package manager is used; consider removing the duplicate lockfile if unused.

---

## Path & script changes required

- No import path changes were necessary because no source files were moved.
- If you decide to remove the root `package.json`, be sure to run `npm install` in `frontend/` and `backend/` separately and update any CI/CD scripts that reference the root package.json.

---

## Risks & edge cases ⚠️

- Deleting the duplicate `package.json` or `bun.lockb` without updating CI, deployment, or contributor instructions can break tooling that expects those files at the repo root.
- If you later consolidate into a monorepo (workspaces), you will need to harmonize devDependencies and update scripts.

---

If you'd like, I can:
- apply the recommended clean-up (remove or replace the root `package.json`, remove duplicate lockfiles) and update CI scripts accordingly, or
- generate a minimal top-level `package.json` with scripts to start frontend and backend from the root.

Tell me which option you prefer and I will proceed. ✅
