import { Modal } from '@shared/ui/modal';
import { useState, useEffect } from 'react';
import { inp } from '../../constants';
import type { Department, Division } from '../../types';
import { Field } from '../shared/field';

export function DepartmentModal({
  open,
  onClose,
  onSave,
  initial,
  divisions,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: Omit<Department, 'id'>, id?: number) => void;
  initial?: Department | null;
  divisions: Division[];
}) {
  const blank: Omit<Department, 'id'> = {
    name: '',
    divId: divisions[0]?.id ?? 0,
    positions: 0,
    headcount: 0,
  };
  const [form, setForm] = useState<Omit<Department, 'id'>>(blank);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        divId: initial.divId,
        positions: initial.positions,
        headcount: initial.headcount,
      });
    } else {
      setForm(blank);
    }
  }, [initial, open]);

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
            value={form.divId}
            onChange={(e) => update({ divId: Number(e.target.value) })}
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
      </div>
    </Modal>
  );
}
