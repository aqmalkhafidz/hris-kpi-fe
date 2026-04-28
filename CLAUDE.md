# Performa — HRIS KPI Frontend

BE-backed SPA for HR performance management (KPI/KRA appraisal cycles, multi-stage review, HR admin).

## Stack

- React 18 + TypeScript (strict)
- Vite 5
- TanStack Router (code-defined routes, not file-based)
- TanStack Query (server state)
- TanStack Form, TanStack Table
- Tailwind 3 + custom CSS in `src/styles/friendly.css`
- Backend: Hono + Postgres (Drizzle) under `../hris-kpi-be`. All data via REST (`VITE_API_URL`)

## Scripts

```bash
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run preview  # preview prod build
```

## Path Aliases

Defined in `tsconfig.json` + `vite.config.ts`:

- `@app/*` → `src/app/*`
- `@features/*` → `src/features/*`
- `@shared/*` → `src/shared/*`

Use aliases. No deep relative imports across feature boundaries.

## Folder Layout

```
src/
  app/                 # entry + router wiring
    main.tsx           # ReactDOM root, QueryClient, AuthProvider
    router.tsx         # all routes defined here (code-based)
  features/
    auth/              # login, auth context (localStorage token)
    dashboard/         # employee + HR dashboards (BE-aggregated)
    appraisal/         # self-appraisal, acknowledge, stepper, hooks
    review/            # SL/HOD/HODIV review pages, bell curve, return modal
    cycles/            # HR cycle list + detail + distribution
    kra/               # HR KRA templates
    org/               # HR org chart
    reports/           # HR reports + calibration
    account/           # my-account page
  shared/
    domain/            # cross-feature business widgets (score-picker, audit-timeline, evidence-list)
    layouts/           # employee-layout, hr-layout, sidebars, header, footer, page-shell
    ui/                # primitives (button, badge, modal, form-field, etc.)
    lib/
      theme.ts
      types/appraisal.ts   # core domain types + state machine helpers
  styles/friendly.css
```

Each feature owns: `pages/`, `hooks/` (TanStack Query wrappers), optional `api/` (fetcher fns), `components/` (feature-local).

## Domain Model

Roles (`UserRole`): `staff | sl | hodept | hodiv | hr`.

Appraisal status flow:

```
draft → sl_review → hod_review → hodiv_review → acknowledge → completed
```

Helpers in `src/shared/lib/types/appraisal.ts`:

- `advanceStatusFor(appraisal, role)` — forward transition (SL on draft jumps to `hod_review`)
- `returnTargetFor(actorRole)` — kickback target per reviewer role
- `appendAudit(appraisal, entry)` — immutable audit log append
- `lastReturnEntry(appraisal)` — most recent return action

Always go through these helpers — do not hardcode status strings in transitions.

## Routing Rules

All routes live in `src/app/router.tsx`. Two protected layouts under `_auth` guard:

- `_employee` (EmployeeLayout): `/dashboard`, `/self-appraisal`, `/my-account`, `/review/:role/$appraisalId`, `/acknowledge/$appraisalId`
- `_hr` (HrLayout, HR-only): `/hr/dashboard`, `/hr/organization`, `/hr/kra-templates`, `/hr/cycles`, `/hr/cycles/$cycleId`, `/hr/reports`

Per-route `beforeLoad` enforces role checks (e.g. `slReviewRoute` accepts `sl` or `hr`). When adding a route, mirror this pattern — no role checks inside page components.

Index `/` redirects: HR → `/hr/dashboard`, others → `/dashboard`, unauth → `/login`.

## Data Layer

Real BE via `shared/api/client.ts` (`api<T>(path, init)`). Auth token stored in `localStorage[hris_auth_token]` and auto-attached. Hooks in `features/*/hooks/` wrap fetch calls in `useQuery`/`useMutation`.

Conventions:

- Query keys: namespaced const objects (`appraisalKeys.byId(id)`, `appraisalKeys.byUser(userId)`).
- Invalidation: shared helper per domain (e.g. `invalidateAppraisal(qc, data)`).
- Default `QueryClient`: `staleTime: 30_000`, `retry: 1` (set in `main.tsx`).
- Mutation `onSuccess` always invalidates affected keys.
- Primary keys are numeric (Postgres `serial`). FE `id` props always `number`.

## Auth

`AuthProvider` in `src/features/auth/context/auth-context.tsx`. Persists selected mock user to `localStorage[hris_auth]`. `useAuth()` returns `{ user, login, logout }`. Router context receives `auth` via `RouterProvider context`.

## UI Conventions

- Primitives in `shared/ui/` — never duplicate. Compose, don't fork.
- Cross-feature widgets in `shared/domain/`.
- Layout chrome (header, sidebar, page shell) in `shared/layouts/`.
- Tailwind utility-first. Project tokens in `friendly.css`. Do not introduce new CSS-in-JS or competing design system.
- Mobile sidebar via hamburger toggle (recent layout change).

## Conventions

- Strict TS — no `any`, prefer `unknown` + narrowing.
- Functional components + hooks only.
- Co-locate feature code; lift to `shared/` only when used by 2+ features.
- Files: `kebab-case.tsx`. Components: `PascalCase`. Hooks: `useCamelCase`.
- Comments only for non-obvious WHY. Don't narrate the WHAT.
- BE wiring is the source of truth. Don't reintroduce mock data files.

## Pitfalls

- Don't bypass role guards in pages — guards belong in route `beforeLoad`.
- Don't mutate appraisal objects in place — always return new objects (`appendAudit` style).
- Don't hardcode status transitions — use `advanceStatusFor` / `returnTargetFor`.
- Don't import across features (`@features/a` from `@features/b`) — promote to `@shared` instead.
- Routes are code-defined. Adding a page = edit `router.tsx`, not just dropping a file.
