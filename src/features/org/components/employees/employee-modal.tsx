import { Modal } from '@shared/ui/modal';
import { useState, useEffect } from 'react';
import { inp } from '../../constants';
import type {
  Department,
  Division,
  Employee,
  JobTitle,
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
  jobTitles,
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
  jobTitles: JobTitle[];
}) {
  const firstDivId = divisions[0]?.id ?? 0;
  const firstDeptId = departments.find((d) => d.divId === firstDivId)?.id ?? 0;

  function nextNip() {
    const year = new Date().getFullYear();
    const prefix = `EMP-${year}-`;
    const taken = employees
      .map((e) => e.nip)
      .filter((n) => n.startsWith(prefix))
      .map((n) => parseInt(n.slice(prefix.length), 10))
      .filter((n) => !isNaN(n));
    const next = taken.length > 0 ? Math.max(...taken) + 1 : 1;
    return `${prefix}${String(next).padStart(4, '0')}`;
  }

  const blank: Omit<Employee, 'id' | 'initials'> = {
    nip: nextNip(),
    name: '',
    email: '',
    posId: positions[0]?.id ?? null,
    position: '',
    deptId: firstDeptId,
    divId: firstDivId,
    squadId: null,
    jobTitleId: null,
    manager: '',
    grade: 'IC2',
    status: 'active',
    joined: '',
    orgRole: 'STAFF',
    reviewerSlId: null,
    reviewerHodId: null,
    reviewerHodivId: null,
  };

  const [form, setForm] = useState<Omit<Employee, 'id' | 'initials'>>(blank);

  useEffect(() => {
    if (initial) {
      setForm({
        nip: initial.nip,
        name: initial.name,
        email: initial.email,
        posId: initial.posId,
        position: initial.position,
        deptId: initial.deptId,
        divId: initial.divId,
        squadId: initial.squadId,
        jobTitleId: initial.jobTitleId,
        manager: initial.manager,
        grade: initial.grade,
        status: initial.status,
        joined: initial.joined,
        orgRole: initial.orgRole ?? 'STAFF',
        reviewerSlId: initial.reviewerSlId ?? null,
        reviewerHodId: initial.reviewerHodId ?? null,
        reviewerHodivId: initial.reviewerHodivId ?? null,
      });
    } else {
      setForm(blank);
    }
  }, [initial, open]);

  const update = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const onDivisionChange = (divId: number) => {
    const firstDeptInDiv = departments.find((d) => d.divId === divId);
    const hodiv = employees.find(
      (e) => e.orgRole.toLowerCase() === 'hodiv' && e.divId === divId
    );
    update({
      divId,
      deptId: firstDeptInDiv?.id ?? 0,
      squadId: null,
      reviewerHodivId: hodiv?.id ?? null,
    });
  };

  const onDeptChange = (deptId: number) => {
    const hod = employees.find(
      (e) => e.orgRole.toLowerCase() === 'hodept' && e.deptId === deptId
    );
    update({
      deptId,
      squadId: null,
      reviewerHodId: hod?.id ?? null,
    });
  };

  const onSquadChange = (squadId: number | null) => {
    const sl = squadId
      ? employees.find(
          (e) => e.orgRole.toLowerCase() === 'sl' && e.squadId === squadId
        )
      : null;
    update({ squadId, reviewerSlId: sl?.id ?? null });
  };

  const depsForDiv = departments.filter((d) => d.divId === form.divId);
  const positionsForDept = positions.filter((p) => p.deptId === form.deptId);
  const squadsForDiv = squads.filter(
    (s) => !form.divId || s.divId === form.divId
  );
  const showReviewers =
    !!(form.divId && form.deptId) && form.orgRole.toUpperCase() === 'STAFF';

  const valid =
    form.nip.trim() &&
    form.name.trim() &&
    form.posId != null &&
    form.divId &&
    form.deptId;

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
        <Field label="NIP / Employee ID" required hint="Auto-generated">
          <input
            value={form.nip}
            disabled
            className={inp + ' tabular-nums opacity-60 cursor-not-allowed'}
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
            value={form.jobTitleId ?? ''}
            onChange={(e) => {
              const jt = jobTitles.find((j) => j.id === Number(e.target.value));
              update({
                jobTitleId: jt?.id ?? null,
                orgRole: jt?.code ?? 'STAFF',
              });
            }}
            className={inp}
          >
            <option value="">— Select role —</option>
            {jobTitles.map((jt) => (
              <option key={jt.id} value={jt.id}>
                {jt.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Division" required>
          <select
            value={form.divId}
            onChange={(e) => onDivisionChange(Number(e.target.value))}
            className={inp}
          >
            <option value="">— Select division —</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Department" required>
          <select
            value={form.deptId}
            onChange={(e) => onDeptChange(Number(e.target.value))}
            className={inp}
          >
            <option value="">— Select department —</option>
            {depsForDiv.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Position" required>
          <select
            value={form.posId ?? ''}
            onChange={(e) =>
              update({ posId: e.target.value ? Number(e.target.value) : null })
            }
            className={inp}
          >
            <option value="">— Select position —</option>
            {positionsForDept.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Squad">
          <select
            value={form.squadId ?? ''}
            onChange={(e) =>
              onSquadChange(e.target.value ? Number(e.target.value) : null)
            }
            className={inp}
          >
            <option value="">— No squad —</option>
            {squadsForDiv.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
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
                value={form.reviewerSlId ?? ''}
                onChange={(e) =>
                  update({
                    reviewerSlId: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className={inp}
              >
                <option value="">— Select —</option>
                {employees
                  .filter((e) => e.name !== form.name)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Head of Dept (HOD)">
              <select
                value={form.reviewerHodId ?? ''}
                onChange={(e) =>
                  update({
                    reviewerHodId: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className={inp}
              >
                <option value="">— Select —</option>
                {employees
                  .filter((e) => e.name !== form.name)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Head of Division (HODiv)">
              <select
                value={form.reviewerHodivId ?? ''}
                onChange={(e) =>
                  update({
                    reviewerHodivId: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className={inp}
              >
                <option value="">— Select —</option>
                {employees
                  .filter((e) => e.name !== form.name)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
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
