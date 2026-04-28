import { Modal } from '@shared/ui/modal';
import { useState } from 'react';
import { inp } from '../../constants';
import type { Department, Division, Squad } from '../../types';
import { Field } from '../shared/field';

export function SquadModal({
  open,
  onClose,
  onSave,
  initial,
  divisions,
  departments,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: Omit<Squad, 'id'>, id?: number) => void;
  initial?: Squad | null;
  divisions: Division[];
  departments: Department[];
}) {
  const blank: Omit<Squad, 'id'> = {
    code: '',
    name: '',
    division: divisions[0]?.name ?? '',
    divId: divisions[0]?.id ?? 0,
    department: departments[0]?.name ?? '',
    deptId: departments[0]?.id ?? 0,
    description: '',
  };
  const [form, setForm] = useState<Omit<Squad, 'id'>>(
    initial
      ? {
          code: initial.code,
          name: initial.name,
          division: initial.division,
          divId: initial.divId,
          department: initial.department,
          deptId: initial.deptId,
          description: initial.description,
        }
      : blank
  );
  const update = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const filteredDepts = departments.filter(
    (d) => !form.division || d.division === form.division
  );

  const onDivChange = (name: string) => {
    const div = divisions.find((d) => d.name === name);
    const firstDept = departments.find((d) => d.division === name);
    update({
      division: name,
      divId: div?.id ?? 0,
      department: firstDept?.name ?? '',
      deptId: firstDept?.id ?? 0,
    });
  };

  const onDeptChange = (name: string) => {
    const dept = departments.find((d) => d.name === name);
    update({ department: name, deptId: dept?.id ?? 0 });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? `Edit squad · ${initial.name}` : 'Add squad'}
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            disabled={!form.code.trim() || !form.name.trim()}
            onClick={() => {
              onSave(form, initial?.id);
              onClose();
            }}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {initial ? 'Save changes' : 'Add squad'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Code" required hint="e.g. SQ-01">
            <input
              value={form.code}
              onChange={(e) => update({ code: e.target.value.toUpperCase() })}
              className={inp + ' tabular-nums'}
            />
          </Field>
          <div className="col-span-2">
            <Field label="Squad name" required>
              <input
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Squad Alpha"
                className={inp}
              />
            </Field>
          </div>
        </div>
        <Field label="Division" required>
          <select
            value={form.division}
            onChange={(e) => onDivChange(e.target.value)}
            className={inp}
          >
            {divisions.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Department" required>
          <select
            value={form.department}
            onChange={(e) => onDeptChange(e.target.value)}
            className={inp}
          >
            {filteredDepts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Description" hint="Optional">
          <input
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Brief description of this squad"
            className={inp}
          />
        </Field>
      </div>
    </Modal>
  );
}
