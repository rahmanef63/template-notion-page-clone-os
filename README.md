<div align="center">

# Notion Page Clone OS

**A 100% headless Notion-style workspace you fully own.**
Clone it to your own Vercel + Convex, sign in, and run everything — docs with a
block editor, databases with 11 views, sidebar tree nav, branding — from one
admin dashboard. No code required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-notion-page-clone-os)

![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![React 19](https://img.shields.io/badge/React-19-149eca)
![Convex](https://img.shields.io/badge/Convex-cloud-orange)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

[**Live demo**](https://silong-os.vercel.app)

</div>

---

## What is this?

A **clone-to-own** workspace template. Deploy it to **your** infrastructure and you
get a Notion-style site whose docs, databases and branding live in **your** Convex
database — managed entirely from the admin panel. The frontend is stateless, so
re-deploying or re-cloning never touches your data.

- 📄 **For visitors** — a fast public workspace: docs rendered from the block editor and databases you can browse across views.
- 🛠️ **For you** — an admin dashboard to edit content, branding and settings, with zero coding.
- 🔒 **Yours** — your repo, your Vercel, your Convex. No vendor lock-in.

## ✨ Features

- **Notion-style workspace** — a block editor (text, headings, lists, toggles,
  callouts, code, equations, tables, columns, images, embeds) backing docs that
  the public site renders. Anonymous/demo visitors run on `localStorage`; once
  the owner signs in, state hydrates from and debounce-saves to Convex.
- **Databases, 11 views** — Table · Board · Gallery · List · Calendar · Timeline ·
  Chart · Feed · Form · Map · Dashboard, with per-property config, sort/filter/search.
- **Sidebar tree navigation** — collapsible workspace tree for docs and databases.
- **Threaded comments** — polymorphic comment threads anchored to docs (and any
  target kind), with replies and resolve.
- **Headless settings on Convex** — site name, tagline, owner identity, branding,
  SEO, analytics id and signup policy stored in one `siteSettings` row, read by
  the public site at runtime.
- **Onboarding wizard** — after the owner claims the account: site name, branding,
  **theme preset** (live preview) and one-click sample content.
- **Theme presets** — light / dark / system plus curated presets (refined, bold,
  warm, artistic, moody), applied site-wide.
- **One-button image picker** — gallery · upload · paste-URL · curated Unsplash.
- **`/setup` health page** — a plain-language checklist of what's done and what's
  left (owner claimed, onboarding, invite key), each step linking to its fix.
- **Secure admin** — keyless first-visitor owner claim, then signup policy is
  `open` / `invite` (admin-menu) or the legacy `ADMIN_SIGNUP_KEY` env fallback.
- **Real roles** — owner / editor are **derived** (first account = owner, later
  admins = editors) and surfaced in the dashboard.
- **Admin panel** — settings, users, analytics, audit log, webhooks and AI config
  under `/dashboard/admin`.
- **In-app updates** — admin sees running vs upstream version and can trigger a
  one-click rebuild when a Vercel deploy hook is wired.
- **Backup & restore** — download / re-import all your content as a JSON snapshot, no terminal.
- **AI assistant FAB** — optional public chat assistant, enabled by a Convex `ANTHROPIC_API_KEY`.
- **Demo / clone stages** — a "Deploy your own" ribbon shows on the demo only (`NEXT_PUBLIC_DEMO`).
- **Tested clones** — `npm run smoke` checks a clone can deploy (local, no CI cost).

## 🚀 Quick start (non-coder)

1. Click **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-notion-page-clone-os)** → connect GitHub → import your copy → Deploy.
2. Create a free Convex project at [convex.dev](https://convex.dev) and set `NEXT_PUBLIC_CONVEX_URL` + `CONVEX_DEPLOY_KEY` in Vercel — the build pushes the backend and auto-provisions the auth keys.
3. Open `https://your-app.vercel.app/setup` → first visitor **claims the owner account** → the onboarding wizard walks you through name, branding, theme preset and sample content. Done.

Your data stays in **your** Convex. Re-deploying or re-cloning the frontend never
touches it — point the new deploy at the same `NEXT_PUBLIC_CONVEX_URL`.

## 💻 Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local        # set NEXT_PUBLIC_CONVEX_URL
npx convex dev --once             # generates convex/_generated + pushes schema
npm run dev                       # http://localhost:3000
```

## 🔐 Environment — two places

Variables live in **two** dashboards. The Deploy/clone button only fills the Vercel
ones; set the Convex ones in the Convex dashboard (or let the build do it).

| Variable | Where | Required | Purpose |
|----------|-------|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel + `.env.local` | ✅ | Convex deployment URL (`.convex.cloud`) |
| `CONVEX_DEPLOY_KEY` | Vercel | ✅ | deploys functions + schema at build via `build:auto` |
| `JWT_PRIVATE_KEY` / `JWKS` / `SITE_URL` | Convex | ✅ | login signing — **auto-set at build** by `scripts/setup-auth.mjs` |
| `ADMIN_SIGNUP_KEY` | Convex | – | legacy invite key for extra admins (fallback to the admin-menu signup policy) |
| `VERCEL_DEPLOY_HOOK_URL` | Convex | – | enables the admin **Rebuild now** button |
| `ANTHROPIC_API_KEY` | Convex | – | enables the public AI assistant FAB |
| `NEXT_PUBLIC_DEMO` | Vercel | – | demo only — shows the "Deploy your own" ribbon |

> `vercel.json` sets the build command to `npm run build:auto`, which runs
> `convex deploy` automatically when `CONVEX_DEPLOY_KEY` is present — no manual
> build-command change needed (the default `next build` works without it).

## 🧱 Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 · Tailwind CSS 4 · shadcn/ui · Radix |
| Backend / DB | Convex (Cloud, self-hosted compatible) — realtime |
| Auth | `@convex-dev/auth` (Password, first-visitor owner claim) |
| Theme | next-themes + theme-presets (light / dark / system + presets) |
| Editor | block editor · `@dnd-kit` drag-and-drop · KaTeX · highlight.js |
| Images | `image-picker` slice (gallery · upload · link · Unsplash) |

## 🗂️ Project structure

```
app/
  (public)/        public site — workspace home, /d/[id] docs, /db/[id] databases, /[...slug]
  admin/           redirect → /dashboard/admin
  dashboard/admin/ admin panel (settings · users · analytics · audit-log · webhooks · ai-config)
  setup/           /setup health page
  api/unsplash/    Unsplash proxy for the image picker
components/
  templates/notion-page-clone/  workspace + database slices (notion-app, admin)
  onboarding/      onboarding wizard
  setup/           setup health UI
  admin/           backup-card · update-card
  ai-chat-fab.tsx · demo-ribbon.tsx · admin-gate.tsx
frontend/slices/   notion-shell · notion-database · notion-sidebar · selection ·
                   theme-presets · icon-picker · image-picker · comments · onboarding-wizard
convex/
  schema.ts        auth + notion docs + comments + siteSettings
  features/        notion (docs/databases) · comments · aiChat
  settings.ts setup.ts users.ts seed.ts files.ts backup.ts update.ts http.ts
lib/headless-core/ index.ts · settings.ts · version.ts  (fleet-synced core engine)
scripts/           setup-auth.mjs (build-time JWT keys) · smoke-test.mjs
proxy.ts           Next 16 request proxy (replaces middleware.ts)
```

## 🗺️ Roadmap

- [x] **headless-core** module + version manifest (`lib/headless-core/`)
- [x] Onboarding wizard with theme presets + sample content
- [x] Databases with 11 views + threaded comments
- [x] One-click **backup / restore** and in-app **Update** card
- [x] Roles (owner / editor) — derived, surfaced in the dashboard
- [x] `/setup` health page + clone **smoke-test**
- [ ] **FASE-6** — full Notion editor parity on the public surface (in progress)
- [ ] Viewer role tier + per-action RBAC
- [ ] Optional Resend "forgot password" flow

## 📄 License

MIT © Rahman ([rahmanef.com](https://rahmanef.com))

<div align="center"><sub>Built with <a href="https://resource.rahmanef.com">rahman-resources</a>.</sub></div>
</content>
</invoke>
