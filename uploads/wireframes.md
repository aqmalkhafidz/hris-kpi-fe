# Wireframes — HRIS KPI / Performa

Low-fidelity wireframe per halaman. Mirror kode di [hris-kpi-fe/src](../../hris-kpi-fe/src). Pasangan dokumen: [userflow.md](./userflow.md).

Konvensi notasi:
- `[Btn]` = button. `[Btn:primary]` = brand color. `[Btn:danger]` = destructive.
- `( )` = radio. `[ ]` = checkbox. `[v]` = dropdown. `____` = input.
- `█` = avatar/icon. `▓` = progress bar fill. `░` = progress bar empty.
- `⋯` = overflow / lebih banyak.
- Breakpoint default: desktop `≥ lg` (1024px+). Notasi mobile diberi label `Mobile`.

---

## 0. App Shell (Authenticated Layout)

Semua route auth pakai `AppLayout` ([app-layout.tsx](../../hris-kpi-fe/src/shared/layouts/app-layout.tsx)) — sidebar + header + content.

```
+-----+-----------------------------------------------------------+
| ▓▓  |  ☰  Performa · breadcrumb              🔔  ▓ Aqmal  [v]  |
| KPI |-----------------------------------------------------------+
|     |                                                           |
| ━━━ |                                                           |
| 📊 Dashboard                                                    |
| 🎯 Self-Appraisal       <-- staff, sl                          |
| 👥 Team Reviews   [2]   <-- sl, hodept, hodiv                  |
| 🕒 History                                                      |
| ━━━ HR Console (HR-only)                                        |
| 🏢 Organization                                                 |
| 🗂  KRA Templates  [4]                                          |
| 🔁 Cycles                                                       |
| 📄 Reports                                                      |
| ━━━                                                             |
| ⚙  My Account                                                   |
| ⏻  Logout                                                       |
+-----+-----------------------------------------------------------+
```

Annotations:
1. Sidebar fixed `w-64` di desktop, slide-in di mobile (hamburger toggle).
2. Header: breadcrumb kiri, notif + avatar dropdown kanan.
3. Sidebar items filtered by `user.role` ([app-sidebar.tsx](../../hris-kpi-fe/src/shared/layouts/app-sidebar.tsx)).
4. Badge angka di sidebar = pending count (mock di kode saat ini).

Mobile:
```
+----------------------------------+
| ☰   Performa            🔔  ▓   |
+----------------------------------+
|  [Sidebar overlay slide-in]     |
+----------------------------------+
```

---

## 1. Login (`/login`)

```
+---------------------------------------------------------------+
|                                                               |
|                          ▓▓                                   |
|                     Performa Login                            |
|                                                               |
|   Email                                                       |
|   [____________________________________________________]      |
|                                                               |
|   Password                                                    |
|   [____________________________________________________] 👁    |
|                                                               |
|   [ ] Remember me               [Forgot password?]            |
|                                                               |
|              [Sign in       :primary, full-width]             |
|                                                               |
|   ───────────────────  or pick demo  ────────────────────     |
|                                                               |
|   [v] Choose demo user (staff/sl/hodept/hodiv/hr)            |
|              [Login as demo  :secondary]                      |
|                                                               |
+---------------------------------------------------------------+
```

Annotations:
1. Centered card `max-w-md`. Background neutral.
2. Demo user picker → `GET /auth/demo-users` ([app.ts:80](../../hris-kpi-be/src/app.ts)).
3. Submit → `POST /auth/login`. Error inline above button.
4. Success → redirect: `hr` → `/hr/dashboard`, lainnya → `/dashboard`.

States: default · loading (spinner di button) · error (red banner above form).

---

## 2. Forgot Password (`/forgot-password`)

```
+---------------------------------------------------------------+
|                     Forgot Password                           |
|                                                               |
|   Masukkan email akun. Link reset dikirim ke email.           |
|                                                               |
|   Email                                                       |
|   [____________________________________________________]      |
|                                                               |
|              [Send reset link  :primary]                      |
|                                                               |
|                  [← Back to login]                            |
+---------------------------------------------------------------+
```

States: default · success (banner hijau "Link sent") · error.

---

## 3. Employee Dashboard (`/dashboard`)

Role: `staff | sl | hodept | hodiv`.

```
+--------------------------------------------------------------------+
|  Home / Dashboard                                                  |
|  Hi, Aqmal                                       [Open appraisal] |
|  Q1 2026 Appraisal · 3 KRAs · deadline Mar 31                      |
+--------------------------------------------------------------------+
|  ⚠  Action needed                                                  |
|  [⚠] Acknowledge required               [Review & Acknowledge →]   |
|     Your appraisal is finalized. Sign-off to close cycle.          |
+--------------------------------------------------------------------+ <- only if status='acknowledge'
|  [👥] 2 reviews pending in your queue   [Open Team Reviews →]      |
+--------------------------------------------------------------------+ <- only sl/hodept/hodiv
|                                                                    |
|  +-----------+  +-----------+  +-----------+  +-----------+       |
|  | 🎯        |  | ⏳        |  | ✅        |  | 📈        |       |
|  | Active    |  | In Review |  | Completed |  | Avg Score |       |
|  |   1       |  |   0       |  |   3       |  |  4.2/5    |       |
|  +-----------+  +-----------+  +-----------+  +-----------+       |
|                                                                    |
|  +-------------------------------+  +----------------------------+ |
|  | Current Appraisal             |  | Recent Activity            | |
|  | Q1 2026 Appraisal             |  | • SL approved KRA review   | |
|  | Status: [draft]               |  | • You submitted self-app   | |
|  | Reviewer chain: SL→HoD→HoDiv  |  | • HR distributed cycle     | |
|  | KRA progress ▓▓▓▓░░░░ 50%     |  | • ⋯                        | |
|  | [Continue self-appraisal]     |  +----------------------------+ |
|  +-------------------------------+                                 |
+--------------------------------------------------------------------+
```

Annotations:
1. Hero strip: greeting + CTA primary (link to `/self-appraisal` or `/acknowledge/$id` jika acknowledge pending).
2. Action banners conditional:
   - `acknowledge` pending → kuning, link ke `/acknowledge/$appraisalId`.
   - Reviewer queue ≥ 1 → biru, link ke `/review/<role>/$appraisalId`.
3. KPI grid 4 kolom (sm:2, xl:4 — responsive).
4. Two-column section: appraisal aktif + audit log ringkas.

Empty state (no active appraisal): card centered "No active appraisal · cycle belum di-distribute".

---

## 4. Self-Appraisal (`/self-appraisal`)

Akses: `staff | sl`. Editable hanya saat `status==='draft'`.

```
+--------------------------------------------------------------------+
|  Self appraisal · Q1 2026                          [draft] (badge) |
|  Q1 2026 Appraisal                                                 |
|  Template: Tech KRA · weight 100% · Jan 1 - Mar 31, 2026          |
+--------------------------------------------------------------------+
|  Completion        2/3 KRAs · reflection pending · 50%             |
|  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░                                       |
|  Reviewer chain:  ▓SL → ▓HoD → ▓HoDiv                              |
|  Stepper: [draft●] → sl_review → hod_review → hodiv_review → ack   |
+--------------------------------------------------------------------+
| ⚠ Returned by HoD (HODEPT): "KRA evidence kurang"     2026-04-15  | <- only if return note exists
+--------------------------------------------------------------------+
|                                                                    |
|  +--- LEFT 4col -------+   +--- RIGHT 8col ---------------------+ |
|  | KRA list 2/3 scored |   | KRA 1: Ship feature X             | |
|  |  ✓ KRA 1            |   | Target: ship by Mar 15 · weight 40% | |
|  |  ✓ KRA 2            |   |-----------------------------------| |
|  |  · KRA 3            |   | Description block...              | |
|  |  · Reflection       |   |                                   | |
|  |                     |   | Self score                        | |
|  | Submit checklist    |   | ( )1  ( )2  ( )3  (●)4  ( )5      | |
|  |  [✓] All scored     |   | "Exceed expectations"             | |
|  |  [ ] Reflection     |   |                                   | |
|  |  [✓] Weight = 100%  |   | Achievement narrative             | |
|  | (sl-only) Note: SL  |   | [_________________________]       | |
|  | self-app skips SL   |   |                                   | |
|  | step → HoD direct.  |   | Evidence (2)                      | |
|  |                     |   |  📎 file1.pdf       [×]            | |
|  | History (timeline)  |   |  🔗 https://...     [×]            | |
|  |  • submit · today   |   |  [+ Add file]  [+ Add URL]        | |
|  |  • return · 4-15    |   |                                   | |
|  |                     |   | [Previous] [Next]   [Save draft]  | |
|  +---------------------+   |                    [Submit final] | |
|                            +-----------------------------------+ |
+--------------------------------------------------------------------+
```

Reflection mode (right pane):
```
+-----------------------------------+
| Employee reflection               |
| Step back from KRAs and summarize |
|-----------------------------------|
| Overall reflection                |
| [_______________________________] |
| [_______________________________] |
| [_______________________________] |
|                                   |
| [Previous] [Save draft] [Submit]  |
+-----------------------------------+
```

Annotations:
1. Top: PageHeader + ApprovalStepper + completion progress.
2. Return banner conditional (kuning) jika `lastReturnEntry`.
3. Left aside (4col): list KRA + reflection toggle, submit checklist, audit history.
4. Right (8col): active KRA editor — description, ScorePicker (1-5), narrative textarea, evidence list + adder. Switch ke reflection mode replace block.
5. Submit gate FE: all KRA scored AND reflection filled.
6. Locked state (status ≠ draft): banner kuning "locked", semua input disabled.
7. Action: save draft → `PATCH /appraisals/:id`. Submit → patch + `POST /advance`.

Mobile: sidebar collapse jadi accordion atas, KRA editor full-width.

---

## 5. Review Pages (`/review/sl/$id`, `/review/hod/$id`, `/review/hodiv/$id`)

Layout sama untuk SL/HoD/HoDiv. Beda field skor (`sl_score | hod_score | hodiv_score`) + transisi target.

```
+--------------------------------------------------------------------+
|  Team Reviews / SL Review               Status: [sl_review] (badge)|
|  Aqmal Pratama · Q1 2026 Appraisal · Tech KRA                      |
+--------------------------------------------------------------------+
|  Stepper: draft → [sl_review●] → hod_review → hodiv_review → ack   |
|  Reviewer chain:  ▓SL → ▓HoD → ▓HoDiv                              |
+--------------------------------------------------------------------+
|                                                                    |
|  +--- LEFT 4col -------+   +--- RIGHT 8col ---------------------+ |
|  | KRA list            |   | KRA 1: Ship feature X             | |
|  |  · KRA 1 (active)   |   | Weight 40% · Target Mar 15        | |
|  |  · KRA 2            |   |-----------------------------------| |
|  |  · KRA 3            |   | Self submission                   | |
|  |  · Feedback notes   |   |  Self score: ●●●●○ 4              | |
|  |                     |   |  "Delivered feature on time..."   | |
|  | Submit checklist    |   |  Evidence: 📎 file1.pdf · 🔗 URL  | |
|  |  [✓] All scored     |   |-----------------------------------| |
|  |  [ ] Notes filled   |   | Your review                       | |
|  |                     |   | Score                             | |
|  | Audit timeline      |   |  ( )1 ( )2 ( )3 (●)4 ( )5         | |
|  |  • submit · 4-10    |   | Comment                           | |
|  |  • approve SL · ⋯   |   | [____________________________]    | |
|  |                     |   |                                   | |
|  +---------------------+   | [Previous] [Next]                 | |
|                            |                                   | |
|                            | [Return]   [Save draft] [Approve] | |
|                            +-----------------------------------+ |
|                                                                    |
+--------------------------------------------------------------------+
```

Return modal (overlay):
```
+----------------------------------------+
|  Return appraisal                  [×] |
|  This sends back to: draft (employee)  |
|----------------------------------------|
|  Reason (required)                     |
|  [____________________________________]|
|  [____________________________________]|
|                                        |
|  [Cancel]            [Return :danger]  |
+----------------------------------------+
```

Annotations per role:
- SL approve → `hod_review`. Return → `draft`.
- HoD approve → `hodiv_review`. Return → `sl_review`.
- HoDiv approve → `acknowledge`. Return → `hod_review`.
- HR boleh akses semua review page (override).
- Approve gate: semua KRA punya score reviewer. Return wajib reason.

Endpoints:
- Save draft: `PATCH /appraisals/:id`.
- Approve: `POST /appraisals/:id/advance`.
- Return: `POST /appraisals/:id/return` `{ reason }`.

---

## 6. Acknowledge (`/acknowledge/$appraisalId`)

```
+--------------------------------------------------------------------+
|  Final Sign-off                              [acknowledge] (badge) |
|  Acknowledge your appraisal                                        |
|  Q1 2026 Appraisal · Review final scores and acknowledge.          |
+--------------------------------------------------------------------+
|  Final Score: 4.15 / 5                                             |
|  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░  83%                                         |
+--------------------------------------------------------------------+
|  Score Comparison (per KRA)                                        |
|  +----------------------------------------------------------+     |
|  | KRA 1 · weight 40%                                       |     |
|  |  Self  ●●●●○ 4    SL ●●●●○ 4   HoD ●●●●○ 4  HoDiv ●●●●● 5|     |
|  |                                                          |     |
|  | KRA 2 · weight 30%                                       |     |
|  |  Self  ●●●○○ 3    SL ●●●●○ 4   HoD ●●●●○ 4  HoDiv ●●●●○ 4|     |
|  |                                                          |     |
|  | KRA 3 · weight 30%                                       |     |
|  |  ⋯                                                       |     |
|  +----------------------------------------------------------+     |
|                                                                    |
|  Evidence summary (read-only)                                      |
|  Audit Timeline                                                    |
|   • Submit · staff · 4-01                                         |
|   • Approve · SL · 4-05                                            |
|   • Approve · HoD · 4-10                                           |
|   • Approve · HoDiv · 4-15                                         |
|                                                                    |
|              [Acknowledge & Close  :primary]                       |
+--------------------------------------------------------------------+
```

Annotations:
1. Read-only kecuali tombol acknowledge.
2. Banner kuning "You can only acknowledge your own appraisal" jika bukan owner.
3. Final score formula: `Σ (hodiv_score ?? hod_score ?? sl_score ?? self_score) × (weight/100)`.
4. Click → `POST /appraisals/:id/acknowledge` → status `completed`, redirect `/dashboard`.

States: pending acknowledge · already completed (hide button, show "Acknowledged on …") · not owner (disabled).

---

## 7. History Appraisal (`/history-appraisal`)

```
+--------------------------------------------------------------------+
|  History Appraisal                                                 |
|  Semua appraisal completed kamu.                                   |
+--------------------------------------------------------------------+
|  Filter: Cycle [v all]   Year [v 2026]                  Search [_]|
+--------------------------------------------------------------------+
|  +----------------------------------------------------------+     |
|  | Q4 2025 · Tech KRA   completed · ack 2026-01-10          |     |
|  | Final score: 4.30 · Grade: B+                            |     |
|  |                                       [View detail →]    |     |
|  +----------------------------------------------------------+     |
|  | Q3 2025 · Tech KRA   completed · ack 2025-10-12          |     |
|  | Final score: 4.05 · Grade: B                             |     |
|  |                                       [View detail →]    |     |
|  +----------------------------------------------------------+     |
|  | ⋯                                                        |     |
|  +----------------------------------------------------------+     |
+--------------------------------------------------------------------+
```

Annotations:
1. Source: `GET /appraisals/user/:userId` filter `status='completed'`.
2. Detail link membuka modal atau page read-only (sama struktur acknowledge tanpa CTA).

Empty: "Belum ada appraisal completed."

---

## 8. My Account (`/my-account`)

```
+--------------------------------------------------------------------+
|  My Account                                                        |
+--------------------------------------------------------------------+
|  +-- Profile -----------------------+  +-- Security ------------+ |
|  | ▓▓ Aqmal Pratama                |  | Change password         | |
|  | Tech · Squad Alpha               |  |  Current   [_________]  | |
|  | Email   aqmal@…                  |  |  New       [_________]  | |
|  | NIP     EMP-001                  |  |  Confirm   [_________]  | |
|  | Role    staff                    |  |  [Update password]      | |
|  | Manager Jane SL                  |  +-------------------------+ |
|  | Reviewer chain: SL→HoD→HoDiv     |                              |
|  +----------------------------------+                              |
|                                                                    |
|  +-- Preferences -------------------+                              |
|  | Theme   ( ) Light  (●) Dark      |                              |
|  | Notifications [✓] Email [ ] In-app|                             |
|  +----------------------------------+                              |
+--------------------------------------------------------------------+
```

Read-only info kiri, security action kanan.

---

## 9. HR Dashboard (`/hr/dashboard`)

Role: `hr` only.

```
+--------------------------------------------------------------------+
|  HR / Dashboard                          [+ New cycle  :primary]   |
|  Performa Console · 2026-04-30                                     |
+--------------------------------------------------------------------+
|  +---------+ +---------+ +---------+ +---------+ +---------+      |
|  | Cycles  | | Active  | | Distrib | | In Rev. | | Done    |      |
|  |   8     | |   1     | |   142   | |   38    | |   104   |      |
|  +---------+ +---------+ +---------+ +---------+ +---------+      |
|                                                                    |
|  +-- Active cycle: Q1 2026 ----------------------------------+    |
|  | Window: 2026-01-01 → 2026-03-31                           |    |
|  | Distributed: 142 / 142 employees                          |    |
|  | Status mix:                                               |    |
|  |  draft       ▓▓▓▓░░░░░░░░░░░  18                          |    |
|  |  sl_review   ▓▓░░░░░░░░░░░░░  10                          |    |
|  |  hod_review  ▓░░░░░░░░░░░░░░   6                          |    |
|  |  hodiv_review▓░░░░░░░░░░░░░░   4                          |    |
|  |  acknowledge ░░░░░░░░░░░░░░░░  0                          |    |
|  |  completed   ▓▓▓▓▓▓▓▓▓▓▓▓░░░ 104                          |    |
|  | [Open cycle detail →] [Distribute →] [Reports →]          |    |
|  +-----------------------------------------------------------+    |
|                                                                    |
|  +-- Pending calibration --+   +-- Org coverage ----------+      |
|  | 12 appraisal pending    |   | Divisions covered  4/4    |      |
|  | [Open Reports →]        |   | Templates active   8      |      |
|  +-------------------------+   | Employees active   142    |      |
|                                +---------------------------+      |
|                                                                    |
|  Recent activity (audit feed)                                      |
|  • HR distribute Q1 2026 · 2026-01-02                             |
|  • HoDiv approve Aqmal · 2026-04-20                                |
|  • ⋯                                                               |
+--------------------------------------------------------------------+
```

---

## 10. HR Organization (`/hr/organization`)

```
+--------------------------------------------------------------------+
|  HR / Organization                                                 |
|  Master data: divisions, departments, positions, employees, etc.   |
+--------------------------------------------------------------------+
|  Tabs:  [Divisions]  [Departments]  [Positions]                    |
|         [Employees]  [Job Titles]   [Squads]                       |
+--------------------------------------------------------------------+
|  Search [____________]   Filter [v Division]      [+ New entity]   |
+--------------------------------------------------------------------+
|  +-- Table -----------------------------------------------------+ |
|  | Code | Name              | Division | Headcount | Actions    | |
|  +------+-------------------+----------+-----------+------------+ |
|  | TEC  | Technology        | -        |    42     | [Edit][🗑] | |
|  | OPS  | Operations        | -        |    28     | [Edit][🗑] | |
|  | ⋯    | ⋯                 | ⋯        | ⋯         | ⋯          | |
|  +--------------------------------------------------------------+ |
|  Pagination: ‹ 1 2 3 ⋯ ›                                           |
+--------------------------------------------------------------------+
```

Edit modal (overlay):
```
+----------------------------------------+
|  Edit Division                     [×] |
|  Code     [_____________]              |
|  Name     [_____________]              |
|  Head     [v Select user ]             |
|  Headcount[_____________]              |
|  [Cancel]            [Save :primary]   |
+----------------------------------------+
```

Tab Employees punya extra field: `manager`, `squad`, `reviewerSl`, `reviewerHod`, `reviewerHodiv`.

CRUD endpoints: `/org/divisions|departments|positions|employees|job-titles|squads`.

---

## 11. HR KRA Templates (`/hr/kra-templates`)

```
+--------------------------------------------------------------------+
|  HR / KRA Templates                       [+ New template :primary]|
|  Template terikat ke Department + nama (substring of position).    |
+--------------------------------------------------------------------+
|  Filter: Department [v all]      Search [_____________]            |
+--------------------------------------------------------------------+
|  +-- Card grid --------------------------------------------------+ |
|  |  Tech KRA                          [Edit] [Duplicate] [🗑]    | |
|  |  Dept: Technology · Items: 5 · Total weight: 100%             | |
|  |  Match: position contains "Tech"                              | |
|  +---------------------------------------------------------------+ |
|  |  Ops KRA                           [Edit] [Duplicate] [🗑]    | |
|  |  Dept: Operations · Items: 4 · Total weight: 100%             | |
|  +---------------------------------------------------------------+ |
+--------------------------------------------------------------------+
```

Editor modal/page:
```
+--------------------------------------------------------------+
|  Edit Template: Tech KRA                                  [×]|
|--------------------------------------------------------------|
|  Name        [Tech KRA__________]                            |
|  Department  [v Technology      ]                            |
|--------------------------------------------------------------|
|  KRA items                                  [+ Add KRA]     |
|  +----+--------------------+--------------+--------+---+    |
|  | #  | Title              | KPI/Target   | Weight |   |    |
|  +----+--------------------+--------------+--------+---+    |
|  | 1  | Ship feature X     | by Mar 15    | 40%    |🗑 |    |
|  | 2  | Code quality       | review pass  | 30%    |🗑 |    |
|  | 3  | Mentor juniors     | 2 sessions/m | 30%    |🗑 |    |
|  +----+--------------------+--------------+--------+---+    |
|                              Total weight: ▓▓▓▓▓ 100% ✓     |
|                                                              |
|  [Cancel]                          [Save template :primary] |
+--------------------------------------------------------------+
```

Annotations:
1. Save gate: `total weight === 100`. Banner merah jika tidak.
2. Duplicate = preset baru dengan items copy.

---

## 12. HR Cycles List (`/hr/cycles`)

```
+--------------------------------------------------------------------+
|  HR / Cycles                                  [+ New cycle :primary]|
+--------------------------------------------------------------------+
|  Stats:  Total 8   Active 1   Draft 2   Closed 5                   |
|  Filter: [All] [Draft] [Active] [Closed]    Search [__________]    |
+--------------------------------------------------------------------+
|  +-- Cycle card ------------------------------------------------+  |
|  |  Q1 2026 Appraisal                              [active]     |  |
|  |  Window 2026-01-01 → 2026-03-31 · Self deadline 2026-02-15   |  |
|  |  Distributed 142 · In review 38 · Completed 104              |  |
|  |  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░ 73% completed                            |  |
|  |                          [Open detail →] [Edit] [🗑]          |  |
|  +--------------------------------------------------------------+  |
|  |  Q4 2025 Appraisal                              [closed]     |  |
|  |  ⋯                                                           |  |
|  +--------------------------------------------------------------+  |
+--------------------------------------------------------------------+
```

New/edit cycle modal:
```
+--------------------------------------------------+
|  New Cycle                                  [×]  |
|--------------------------------------------------|
|  Name           [Q2 2026 Appraisal__________]    |
|  Start date     [2026-04-01]                     |
|  End date       [2026-06-30]                     |
|  Self deadline  [2026-05-15]   (optional)        |
|  Status         (●) draft  ( ) active            |
|  Description    [_________________________]      |
|                                                  |
|  [Cancel]                  [Create :primary]     |
+--------------------------------------------------+
```

---

## 13. HR Cycle Detail / Distribution (`/hr/cycles/$cycleId`)

```
+--------------------------------------------------------------------+
|  HR / Cycles / Q1 2026 Appraisal               Status: [active]    |
|  Window 2026-01-01 → 2026-03-31                                    |
|  [Edit cycle]   [Activate]   [Distribute now :primary]             |
+--------------------------------------------------------------------+
|  Stats: Total 168 · Matched 142 · Skipped 26                       |
|         (already 12 · no_template 8 · no_reviewer 6)               |
+--------------------------------------------------------------------+
|  Filter:  Status [v all]   Dept [v all]   Search [____________]    |
+--------------------------------------------------------------------+
|  +-- Distribution preview table -------------------------------+   |
|  | Employee  | Dept | Position    | Template | SL/HoD/HoDiv  | Status      | Reason                  | |
|  +-----------+------+-------------+----------+---------------+-------------+-------------------------+ |
|  | Aqmal     | Tech | Sr Engineer | Tech KRA | J · M · K     | matched     | -                       | |
|  | Budi      | Ops  | Specialist  | -        | -             | no_template | Belum ada template Ops  | |
|  | Citra     | Tech | Engineer    | Tech KRA | J · M · K     | already     | Sudah punya appraisal   | |
|  | Dewi      | Tech | Engineer    | Tech KRA | - · M · -     | no_reviewer | HoDiv kosong            | |
|  | ⋯         | ⋯    | ⋯           | ⋯        | ⋯             | ⋯           | ⋯                       | |
|  +-----------+------+-------------+----------+---------------+-------------+-------------------------+ |
+--------------------------------------------------------------------+
|  After distribute: created N · skipped M.                          |
|  Reviewer snapshot saved per appraisal (no live re-read).          |
+--------------------------------------------------------------------+
```

Annotations:
1. `Distribute now` disabled jika `status !== 'active'`.
2. Confirm modal sebelum distribute. Banner sukses setelah selesai dengan `created/skipped` count.
3. Skipped row diberi color coding: kuning (already), abu (no_template), merah (no_reviewer).

---

## 14. HR Reports & Calibration (`/hr/reports`)

```
+--------------------------------------------------------------------+
|  HR / Reports                                    [Export CSV  :sec]|
|  Q1 2026 Appraisal · 142 completed · 12 pending calibration        |
+--------------------------------------------------------------------+
|  Filter:  Cycle [v Q1 2026]   Status [All|Pending|Calibrated]      |
|           Dept  [v all]        Grade  [v all]                      |
+--------------------------------------------------------------------+
|  +-- Bell curve ------------------------------------------------+  |
|  |             ▁▂▄▆█▆▄▂▁                                        |  |
|  |    1   2   3   4   5   (effective score: calibrated ?? final)|  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  Stats: Total 142  Calibrated 130  Pending 12  Avg 4.05            |
+--------------------------------------------------------------------+
|  +-- Table -----------------------------------------------------+  |
|  | Emp ID | Name   | Dept | Cycle | Final | Calibrated | Grade | Status     | Action      | |
|  +--------+--------+------+-------+-------+------------+-------+------------+-------------+ |
|  | EMP-01 | Aqmal  | Tech | Q1'26 | 4.15  | 4.20       | B+    | calibrated | [Detail]    | |
|  | EMP-02 | Budi   | Ops  | Q1'26 | 3.80  | -          | -     | pending    | [Calibrate] | |
|  | ⋯      | ⋯      | ⋯    | ⋯     | ⋯     | ⋯          | ⋯     | ⋯          | ⋯           | |
|  +--------+--------+------+-------+-------+------------+-------+------------+-------------+ |
+--------------------------------------------------------------------+
```

Calibration modal:
```
+--------------------------------------------------+
|  Calibrate · Aqmal · Q1 2026               [×]   |
|--------------------------------------------------|
|  Original final score: 4.15                      |
|                                                  |
|  Calibrated score   [4.20___]  (0-5)            |
|  Final grade        [v B+]                       |
|  Notes (optional)   [____________________]       |
|                                                  |
|  [Cancel]                  [Save :primary]       |
+--------------------------------------------------+
```

Detail / print preview:
```
+--------------------------------------------------------------------+
|  Print Preview · Aqmal Pratama · Q1 2026                  [Print]  |
|  -- header company/logo --                                         |
|  Employee · Cycle · Template · Reviewer chain                      |
|                                                                    |
|  KRA detail: per item self/SL/HoD/HoDiv score + comments           |
|  Evidence list                                                     |
|  Audit timeline                                                    |
|  Final score · Calibrated · Grade                                  |
+--------------------------------------------------------------------+
```

CSV columns: `Employee ID, Name, Department, Job Title, Cycle, Original Final Score, Calibrated Score, Final Grade, Calibration Status`.

---

## 15. Shared Components (referenced lintas page)

### ApprovalStepper
```
[draft●]──[sl_review]──[hod_review]──[hodiv_review]──[acknowledge]──[completed]
   ✓          ●            ○             ○                ○              ○
```
Active dot = current status. Tickmark = passed.

### StatusBadge
```
[draft]  [sl_review]  [hod_review]  [hodiv_review]  [acknowledge]  [completed]
gray     blue         indigo        purple          orange         green
```

### ScorePicker
```
( )1   ( )2   ( )3   (●)4   ( )5
Far      Below   Meet   Exceed   Far
Below                            Exceed
```

### EvidenceList
```
📎 file1.pdf · 1.2 MB · uploaded 2026-04-15  [Download][×]
🔗 https://github.com/.../pr/123             [Open]    [×]
[+ Add file]  [+ Add URL]
```

### ReturnModal
```
+-- Return ---------------------+
| Sends back to: <target>       |
| Reason (required)             |
| [_________________________]   |
| [Cancel]   [Return :danger]   |
+-------------------------------+
```

### AuditTimeline
```
●─ submit · staff · 2026-04-01 09:12
│
●─ approve · SL · 2026-04-05 14:30
│
●─ return · HoD · 2026-04-10 11:00
│   "KRA evidence kurang"
│
●─ submit · staff · 2026-04-12 10:00
│
●─ approve · HoDiv · 2026-04-15 16:45
```

---

## 16. Responsive Breakpoints

- `< 640px` (sm-): single column, sidebar slide-in via hamburger, table → card list.
- `640-1024px` (md/sm): 2-col grids, sidebar still slide-in.
- `≥ 1024px` (lg+): sidebar sticky, two-pane editor (4col aside + 8col main).
- `≥ 1280px` (xl): KPI grid 4-col, max-width content centered.

---

## 17. State Matrix per Page

| Page | Default | Loading | Empty | Error | Locked |
|---|---|---|---|---|---|
| Dashboard | KPI + active card | Skeleton cards | "No active appraisal" | Toast | n/a |
| Self-Appraisal | Editor | "Loading appraisal..." | "No active appraisal found" | Toast | banner if status≠draft |
| Review pages | Editor | "Loading appraisal..." | "Appraisal not found" | Toast | banner if status≠expected |
| Acknowledge | Comparison | "Loading..." | "Appraisal not found" | Toast | hide CTA if owned≠true |
| HR Cycles | Card grid | Skeleton | "No cycles" | Toast | n/a |
| Cycle Detail | Distribution table | Skeleton | "No employees" | Toast | distribute disabled if not active |
| HR Reports | Bell curve + table | Skeleton | "No completed appraisal" | Toast | n/a |

---

## 18. Handoff Checklist

- [ ] Konfirmasi naming sidebar item (label final).
- [ ] Konfirmasi format final grade (A/B/C atau A+/B+/C+).
- [ ] Final layout reviewer queue di dashboard (card vs list).
- [ ] Confirm whether HR butuh button "Force advance" / "Force complete" untuk override (saat ini tidak ada di kode).
- [ ] Confirm bulk actions di Reports (bulk calibrate?).
- [ ] Mobile design sign-off untuk self-appraisal & review pages (paling kompleks).
