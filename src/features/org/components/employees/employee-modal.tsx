import { Modal } from '@shared/ui/modal';
import { useState } from 'react';
import { DEPT_DIV, NEEDS_SQUAD, ORG_ROLES, inp } from '../../constants';
import type {
  Department,
  Division,
  Employee,
  Position,
  Squad,
} from '../../types';
import { Field } from '../shared/field';

export function EmployeeModal({
  open,
  onClose,
  onSave,
  initial,
  departments,
  divisions,
  positions,
  squads,
  employees,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: Omit<Employee, 'id' | 'initials'>, id?: number) => void;
  initial?: Employee | null;
  departments: Department[];
  divisions: Division[];
  positions: Position[];
  squads: Squad[];
  employees: Employee[];
}) {
  const deptNames = departments.map((d) => d.name);

  const blank: Omit<Employee, 'id' | 'initials'> = {
    nip: '',
    name: '',
    email: '',
    position: positions[0]?.title ?? '',
    dept: deptNames[0] ?? '',
    div: 'Technology',
    division: 'Technology',
    manager: '',
    squad: null,
    grade: 'IC2',
    status: 'active',
    joined: '',
    orgRole: 'staff',
    reviewerSl: null,
    reviewerHod: null,
    reviewerHodiv: null,
  };

  const [form, setForm] = useState<Omit<Employee, 'id' | 'initials'>>(
    initial
      ? {
          nip: initial.nip,
          name: initial.name,
          email: initial.email,
          position: initial.position,
          dept: initial.dept,
          div: initial.div,
          division: initial.division,
          manager: initial.manager,
          squad: initial.squad,
          grade: initial.grade,
          status: initial.status,
          joined: initial.joined,
          orgRole: initial.orgRole ?? 'staff',
          reviewerSl: initial.reviewerSl ?? null,
          reviewerHod: initial.reviewerHod ?? null,
          reviewerHodiv: initial.reviewerHodiv ?? null,
        }
      : blank
  );

  const update = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const onDeptChange = (v: string) => {
    const dept = departments.find((d) => d.name === v);
    const divName =
      divisions.find((d) => d.id === dept?.divId)?.name ??
      DEPT_DIV[v] ??
      form.division;
    const divHead = divisions.find((d) => d.name === divName)?.head ?? '';
    update({
      dept: v,
      div: divName,
      division: divName,
      reviewerHod: dept?.hod ?? form.reviewerHod,
      reviewerHodiv: divHead || form.reviewerHodiv,
    });
  };

  const onManagerChange = (v: string) => {
    update({ manager: v, reviewerSl: v || null });
  };

  const onSquadChange = (v: string) => {
    update({ squad: v || null });
  };

  const positionsForDept = positions.filter((p) => p.dept === form.dept);
  const squadsForDept = squads.filter(
    (s) => !form.dept || s.department === form.dept
  );
  const managers = employees
    .filter((e) => e.dept === form.dept && e.name !== form.name)
    .map((e) => e.name);

  const needsSquad = NEEDS_SQUAD(form.orgRole);
  const showReviewers =
    needsSquad && !!(form.squad || form.dept || form.division);

  const valid =
    form.nip.trim() && form.name.trim() && form.position.trim() && form.dept;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? `Edit · ${initial.name}` : 'Add employee'}
      maxWidth="max-w-[95vw] md:max-w-5xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => {
              onSave(form, initial?.id);
              onClose();
            }}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {initial ? 'Save changes' : 'Add employee'}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="NIP / Employee ID" required hint="e.g. EMP-2026-1042">
          <input
            value={form.nip}
            onChange={(e) => update({ nip: e.target.value.toUpperCase() })}
            className={inp + ' tabular-nums'}
          />
        </Field>
        <Field label="Full name" required>
          <input
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Full name"
            className={inp}
          />
        </Field>
        <Field label="Work email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="name@company.id"
            className={inp}
          />
        </Field>
        <Field label="Org role" required>
          <select
            value={form.orgRole}
            onChange={(e) => update({ orgRole: e.target.value })}
            className={inp}
          >
            {ORG_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Department"
          required
          hint="Division updates automatically"
        >
          <select
            value={form.dept}
            onChange={(e) => onDeptChange(e.target.value)}
            className={inp}
          >
            {deptNames.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Division">
          <input
            value={form.division}
            disabled
            className={
              inp +
              ' cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-white/[0.02]'
            }
          />
        </Field>
        <Field label="Position" required>
          <select
            value={form.position}
            onChange={(e) => update({ position: e.target.value })}
            className={inp}
          >
            <option value="">— Select position —</option>
            {positionsForDept.map((p) => (
              <option key={p.id} value={p.title}>
                {p.title}
              </option>
            ))}
            {form.position &&
              !positionsForDept.find((p) => p.title === form.position) && (
                <option value={form.position}>{form.position}</option>
              )}
          </select>
        </Field>
        <Field label="Reports to">
          <select
            value={form.manager ?? ''}
            onChange={(e) => onManagerChange(e.target.value)}
            className={inp}
          >
            <option value="">— Select manager —</option>
            {managers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        {needsSquad && (
          <Field label="Squad">
            <select
              value={form.squad ?? ''}
              onChange={(e) => onSquadChange(e.target.value)}
              className={inp}
            >
              <option value="">— No squad —</option>
              {squadsForDept.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Employment status">
          <select
            value={form.status}
            onChange={(e) =>
              update({ status: e.target.value as Employee['status'] })
            }
            className={inp}
          >
            <option value="active">Active</option>
            <option value="probation">Probation</option>
            <option value="onboarding">Onboarding</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
        <Field label="Joined" hint="e.g. Jan 2026">
          <input
            value={form.joined}
            onChange={(e) => update({ joined: e.target.value })}
            placeholder="Jan 2026"
            className={inp}
          />
        </Field>
      </div>

      {showReviewers && (
        <div className="mt-5 space-y-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-700 dark:bg-white/[0.02]">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Route reviewers
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Squad Leader (SL)">
              <select
                value={form.reviewerSl ?? ''}
                onChange={(e) => update({ reviewerSl: e.target.value || null })}
                className={inp}
              >
                <option value="">— Select —</option>
                {employees
                  .filter((e) => e.name !== form.name)
                  .map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Head of Dept (HOD)">
              <select
                value={form.reviewerHod ?? ''}
                onChange={(e) =>
                  update({ reviewerHod: e.target.value || null })
                }
                className={inp}
              >
                <option value="">— Select —</option>
                {employees
                  .filter((e) => e.name !== form.name)
                  .map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Head of Division (HODiv)">
              <select
                value={form.reviewerHodiv ?? ''}
                onChange={(e) =>
                  update({ reviewerHodiv: e.target.value || null })
                }
                className={inp}
              >
                <option value="">— Select —</option>
                {employees
                  .filter((e) => e.name !== form.name)
                  .map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name}
                    </option>
                  ))}
              </select>
            </Field>
          </div>
        </div>
      )}
    </Modal>
  );
}
