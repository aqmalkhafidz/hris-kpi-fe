# Performa — HRIS KPI Frontend

BE-backed SPA for HR performance management (KPI/KRA appraisal cycles, multi-stage review, HR admin).

## Stack

- React 18 + TypeScript (strict)
- Vite 5
- TanStack Router (code-defined routes, not file-based)
- TanStack Query (server state)
- TanStack Form, TanStack Table
- Tailwind 3 + custom CSS in `src/styles/friendly.css`
- Backend: Hono + Postgres (Drizzle) under `../hris-kpi-be`. All data via REST (`VITE_API_URL`).

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

```text
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
    org/               # HR org management (divisions, depts, positions, employees, squads, job titles)
    reports/           # HR reports + calibration
    account/           # my-account page (avatar, contact, password change)
  shared/
    api/client.ts      # api(), apiBlob(), token storage, auth-cleared event bus
    hooks/             # use-paginate, use-protected-object-url
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

Roles (`UserRole`): `staff` / `sl` / `hodept` / `hodiv` / `hr`.

`orgRole` di employees (lowercase) adalah sumber role. JWT hanya berisi `{ id, email, name, role }` — tidak ada initials/dept/div/avatar.

Appraisal status flow:

```text
draft → sl_review → hod_review → hodiv_review → acknowledge → completed
```

Helpers in `src/shared/lib/types/appraisal.ts`:

- `advanceStatusFor(appraisal, role)` — forward transition
- `returnTargetFor(actorRole)` — kickback target per reviewer role
- `appendAudit(appraisal, entry)` — immutable audit log append
- `lastReturnEntry(appraisal)` — most recent return action

Selalu lewat helpers — jangan hardcode status string di transition.

## Org Types (`src/features/org/types.ts`)

```ts
interface Employee {
  id: number;
  name: string; initials: string; email: string; nip: string;
  posId: number | null; position: string;
  deptId: number; divId: number; squadId: number | null;
  jobTitleId: number | null;
  orgRole: string;              // 'staff' | 'sl' | 'hodept' | 'hodiv' | 'hr'
  reviewerSlId: number | null;  // FK → employees.id
  reviewerHodId: number | null;
  reviewerHodivId: number | null;
  status: 'active' | 'inactive' | 'probation' | 'onboarding';
  joined: string;
}

interface Department { id; name; divId; positions; headcount }
interface Division   { id; code; name; headcount; departments: string[] }
interface Position   { id; code; title; level; divId; deptId; template; headcount }
interface Squad      { id; code; name; divId; deptId; description }
interface JobTitle   { id; code; name; level; deptId; description; headcount }
```

BE `GET /org/employees` me-redact field non-org untuk role non-HR — kalau bukan HR jangan andalkan `email`, `nip`, `joined`, `reviewer*Id`.

## Org Modal Patterns

**Cascading selects** — selalu pakai urutan ini agar filter konsisten:

1. Division → filter departments by `divId`
2. Department → filter positions by `deptId`
3. Squad → (opsional, filter by `divId`)

**Employee modal auto-fill reviewers**: saat division/dept/squad berubah, reviewer di-auto-fill dari employees dengan `orgRole` yang sesuai di scope tersebut:

- Division berubah → `reviewerHodivId` = employee `orgRole=hodiv` di division itu
- Department berubah → `reviewerHodId` = employee `orgRole=hodept` di dept itu
- Squad berubah → `reviewerSlId` = employee `orgRole=sl` di squad itu

**NIP auto-generate**: format `EMP-YEAR-XXXX`, dibuat di FE berdasarkan NIP existing terbesar. Field disabled di modal.

**Route reviewers** hanya tampil jika `orgRole = 'staff'`.

## Routing Rules

All routes live in `src/app/router.tsx`. Two protected layouts under `_auth` guard:

- `_employee` (EmployeeLayout): `/dashboard`, `/self-appraisal`, `/my-account`, `/review/:role/$appraisalId`, `/acknowledge/$appraisalId`
- `_hr` (HrLayout, HR-only): `/hr/dashboard`, `/hr/organization`, `/hr/kra-templates`, `/hr/cycles`, `/hr/cycles/$cycleId`, `/hr/reports`

Per-route `beforeLoad` enforces role checks. When adding a route, mirror this pattern — no role checks inside page components.

Index `/` redirects: HR → `/hr/dashboard`, others → `/dashboard`, unauth → `/login`.

## Data Layer

`shared/api/client.ts`:

- `api<T>(path, init)` — JSON fetcher. Auto-attach `Authorization: Bearer <token>` dari `localStorage[hris_auth_token]`. Throws `ApiError(status, message)`.
- `apiBlob(path, init)` — sama tapi return `Blob`. Dipakai download authed (`/uploads/*`).
- `getToken/setToken/clearToken` — token storage primitives.
- `clearAuthSession()` + `onAuthCleared(listener)` — global event bus untuk cabut session (mis. 401 handler) tanpa hard-coupling ke `AuthProvider`.

Hooks in `features/*/hooks/` wrap fetch calls in `useQuery`/`useMutation`.

Conventions:

- Query keys: namespaced const objects.
- Default `QueryClient`: `staleTime: 30_000`, `retry: 1` (set in `main.tsx`).
- Mutation `onSuccess` selalu invalidate affected keys.
- Primary keys numeric (Postgres `serial`). FE `id` props selalu `number`.

## Auth

`AuthProvider` di `src/features/auth/context/auth-context.tsx`. Token di `localStorage[hris_auth_token]`. `useAuth()` returns `{ user, login, logout }`.

`AuthUser` dari BE: `{ id: number, email: string, name: string, role: UserRole }`. Tidak ada `initials`, `dept`, `div`, `avatar` di JWT — kalau perlu data itu fetch via `GET /auth/me` (return enriched profile) atau `/org/employees`.

BE bisa revoke token via password change (bumps `tokenVersion`). FE handling: ApiError 401 → call `clearAuthSession()` → redirect `/login`.

## Shared Hooks

| Hook                                                                  | Fungsi                                                                                                                            |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [usePaginate](src/shared/hooks/use-paginate.ts)                       | Client-side pagination atas array. Return `{rows, page, size, total, from, to, canPrev, canNext, prevPage, nextPage, setSize}`.   |
| [useProtectedObjectUrl](src/shared/hooks/use-protected-object-url.ts) | Fetch `/uploads/*` sebagai Blob authed → `URL.createObjectURL`. Dipakai untuk preview avatar/evidence di `<img>`/`<a download>`. Auto-revoke saat unmount. |

Jangan render `/uploads/*` langsung di `<img src>` — BE force `Content-Disposition: attachment` jadi browser akan download bukan inline. Pakai `useProtectedObjectUrl` lalu pasang `state.src`.

## Account Page

`features/account/pages/my-account.tsx`:

- Avatar upload → `POST /auth/avatar` (multipart, max 2 MB, MIME whitelist).
- Contact → `PATCH /auth/me/contact` (`phone`, `emergencyName`, `emergencyPhone`).
- Change password → `POST /auth/change-password`. Server policy: min 10 char, 3 of {lower, upper, digit, symbol}. Sukses = `tokenVersion` bumped → token lama jadi invalid → AuthProvider harus re-login (currently UX: show toast & redirect).

## UI Conventions

- Primitives di `shared/ui/` — jangan duplicate. Compose, jangan fork.
- Cross-feature widgets di `shared/domain/`.
- Layout chrome (header, sidebar, page shell) di `shared/layouts/`.
- Tailwind utility-first. Project tokens di `friendly.css`.
- Input class reuse: `inp` constant dari `features/org/constants.ts`.

## Conventions

- Strict TS — no `any`, prefer `unknown` + narrowing.
- Functional components + hooks only.
- Co-locate feature code; lift to `shared/` only when used by 2+ features.
- Files: `kebab-case.tsx`. Components: `PascalCase`. Hooks: `useCamelCase`.
- Comments only for non-obvious WHY.
- BE wiring is the source of truth. Jangan reintroduce mock data files.

## Pitfalls

- Jangan bypass role guards di pages — guards belong in route `beforeLoad`.
- Jangan mutate appraisal objects in place — always return new objects.
- Jangan hardcode status transitions — pakai `advanceStatusFor` / `returnTargetFor`.
- Jangan import across features — promote ke `@shared`.
- Routes code-defined. Adding a page = edit `router.tsx`.
- `reviewer*Id` di Employee adalah integer FK, bukan string nama. Untuk tampilkan nama, lookup dari list employees.
- Jangan simpan `initials` / `avatar` di auth context — fetch via `/auth/me` saat butuh enriched profile.
- `/uploads/*` butuh auth + Bearer token — pakai `useProtectedObjectUrl`, jangan `<img src="/uploads/...">`.
- Setelah change-password, semua token lama 401 — handle "Token revoked" → redirect login.
