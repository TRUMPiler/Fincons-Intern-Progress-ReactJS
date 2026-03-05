# Day 7 — React (Vite + TypeScript)

This folder contains the Day 7 exercise: a React + TypeScript app scaffolded with Vite. The project demonstrates a Kanban-style tasks UI with drag-and-drop, teams management, a sidebar, theming, and a few UI utilities/components.

## Features

- Kanban-style task columns with drag & drop
- Teams and user models (simple local storage-based data)
- Sidebar and responsive UI
- Theme provider and UI primitives

## Quick start

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Lint the project:

```bash
npm run lint
```

## Scripts

Available npm scripts (from `package.json`):

- `dev` — start Vite dev server
- `build` — run TypeScript build then Vite build
- `lint` — run ESLint
- `preview` — preview the production build

## Libraries used

Below are the main libraries used in this Day 7 project (from `package.json`).

Runtime / UI dependencies:

- `react` & `react-dom` — React library (v19)
- `@dnd-kit/core` (^6.3.1) — drag & drop primitives used for Kanban interactions
- `tailwindcss` (^4.2.1) & `@tailwindcss/vite` (^4.2.1) — Tailwind CSS and Vite integration
- `class-variance-authority` (^0.7.1) & `clsx` (^2.1.1) — utilities for composing class names
- `lucide-react` (^0.575.0) — icon components
- `primereact` (^10.9.7) — ready-made UI components used in parts of the UI
- `radix-ui` (^1.4.3) — headless UI primitives
- `react-router` (^7.13.1) — client-side routing
- `tailwind-merge` (^3.5.0) — safely merge Tailwind class lists
- `vercel` (^50.25.4) — deployment helper (optional/devops)

Dev / build tools:

- `vite` (^7.3.1) — dev server & build tool
- `typescript` (~5.9.3) — TypeScript
- `@vitejs/plugin-react` (^5.1.1) — Vite React plugin
- `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` — linting & rules
- `@types/*` packages — TypeScript type definitions for Node/React
- `shadcn` (^3.8.5) & `tw-animate-css` (^1.4.0) — UI helper/animation utilities (used in styling)
- `typescript-eslint` — TypeScript ESLint tooling

If you want a compact list you can copy from `package.json`'s `dependencies` and `devDependencies`.

## Where to look in the code

- `src/components/` — main UI components (columns, tasks, sidebar, draggable/droppable, etc.)
- `src/pages/` — pages such as `Home`, `Todo`, `Teams`, `Login`, `Register`
- `src/lib/` and `src/models/` — helpers, context and simple data models (Teams, Todo, user)

## Notes

- Data in this example is kept locally (models in `src/models`) and seeded at runtime for demo purposes.
- This README is intentionally concise — let me know if you want expanded docs (component map, data model details, or deployment steps to Vercel).

---
