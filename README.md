# Notion Page Clone OS — headless workspace template

Notion-style workspace you own end-to-end: docs with block editor, databases
(11 views), sidebar tree nav — backed by **your own Convex** + deployed on
**your own Vercel**. Clone it, run the `/setup` wizard, publish. No code edits
needed; all content + branding live in Convex and are managed from the admin.

Live demo: https://silong-os.vercel.app

## Clone to your own stack

1. **Use this repo** → create your copy on GitHub (or fork).
2. **Vercel** → New Project → import your copy. Build command stays `npm run
   build:auto` (default `build` works too; `build:auto` deploys Convex when
   `CONVEX_DEPLOY_KEY` is set).
3. **Convex** → create a free project at convex.dev, then in Vercel set:
   - `NEXT_PUBLIC_CONVEX_URL` — your Convex prod URL
   - `CONVEX_DEPLOY_KEY` — prod deploy key (lets the Vercel build push the
     backend + auth keys automatically via `scripts/setup-auth.mjs`)
4. Deploy → open `https://your-app.vercel.app/setup` → first visitor claims
   the owner account → onboarding wizard (site name, branding, theme preset,
   sample content).

Your data stays in YOUR Convex. Re-deploying/re-cloning the frontend never
touches it — point the new deploy at the same `NEXT_PUBLIC_CONVEX_URL`.

## Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local           # fill NEXT_PUBLIC_CONVEX_URL etc.
npx convex dev --once                # generates convex/_generated + pushes schema
npm run dev
```

## Environment

| Var | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel + `.env.local` | Convex deployment URL (required) |
| `CONVEX_DEPLOY_KEY` | Vercel | lets `build:auto`/`build:vercel` deploy backend |
| `JWT_PRIVATE_KEY` / `JWKS` | Convex env | auth keys — auto-provisioned by `scripts/setup-auth.mjs` |
| `SITE_URL` | Convex env | auth callback origin |
| `VERCEL_DEPLOY_HOOK_URL` | Convex env | powers the admin **Update** card (rebuild button) |
| `ANTHROPIC_API_KEY` | Convex env | optional — enables the public AI assistant FAB |
| `NEXT_PUBLIC_DEMO` | Vercel | `1` shows the demo clone-ribbon CTA |

## What's inside

- **Public**: workspace home, `/d/[id]` docs (block editor render + threaded
  comments), `/db/[id]` databases (table/board/gallery/list/calendar/…).
- **Admin** (`/dashboard/admin`): settings, branding, signup policy, Update
  card (Vercel rebuild), Backup card (JSON export).
- **Headless core**: `version.json` + `lib/headless-core` + `convex/update.ts`
  — synced fleet-wide from personal-brand-os via `apply-core.mjs`.
- **Slices**: notion-shell, notion-sidebar, notion-database, selection,
  theme-presets, icon/image-picker, ai-chat, comments, onboarding-wizard.

## Hard rules

- **NO Clerk.** Auth = `@convex-dev/auth`.
- **shadcn primitives only** — no raw `<dialog>`, `<input type=date|file>`.
- Use `proxy.ts` (not `middleware.ts`) on Next 16.
- `convex/_generated` MUST be committed before deploy.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind 4 + shadcn |
| Backend | Convex Cloud (self-hosted compatible) |
| Auth | `@convex-dev/auth` (Password provider, first-visitor owner claim) |
