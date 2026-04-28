import { Modal } from '@shared/ui/modal';
import { useState } from 'react';
import { inp } from '../../constants';
import type { Department } from '../../types';
import { Field } from '../shared/field';

export function DepartmentModal({
  open,
  onClose,
  onSave,
  initial,
  divisionNames,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: Omit<Department, 'id'>, id?: number) => void;
  initial?: Department | null;
  divisionNames: string[];
}) {
  const blank: Omit<Department, 'id'> = {
    name: '',
    division: divisionNames[0] ?? '',
    divId: 0,
    headId: 0,
    hod: '',
    positions: 0,
    headcount: 0,
  };
  const [form, setForm] = useState<Omit<Department, 'id'>>(
    initial
      ? {
          name: initial.name,
          division: initial.division,
          divId: initial.divId,
          headId: initial.headId,
          hod: initial.hod,
          positions: initial.positions,
          headcount: initial.headcount,
        }
      : blank
  );
  const update = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? `Edit department · ${initial.name}` : 'Add department'}
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            disabled={!form.name.trim()}
            onClick={() => {
              onSave(form, initial?.id);
              onClose();
            }}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {initial ? 'Save changes' : 'Add department'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Department name" required>
          <input
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Engineering"
            className={inp}
          />
        </Field>
        <Field label="Division" required>
          <select
            value={form.division}
            onChange={(e) => update({ division: e.target.value })}
            className={inp}
          >
            {divisionNames.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </Modal>
  );
}
