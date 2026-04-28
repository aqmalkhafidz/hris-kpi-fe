import { Modal } from '@shared/ui/modal';
import { useState } from 'react';
import { inp } from '../../constants';
import type { Division } from '../../types';
import { Field } from '../shared/field';

export function DivisionModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: Omit<Division, 'id'>, id?: number) => void;
  initial?: Division | null;
}) {
  const blank: Omit<Division, 'id'> = {
    code: '',
    name: '',
    head: '',
    headId: 0,
    headcount: 0,
    departments: [],
  };
  const [form, setForm] = useState<Omit<Division, 'id'>>(
    initial
      ? {
          code: initial.code ?? '',
          name: initial.name,
          head: initial.head,
          headId: initial.headId,
          headcount: initial.headcount,
          departments: [...initial.departments],
        }
      : blank
  );
  const update = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? `Edit division · ${initial.name}` : 'Add division'}
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
            {initial ? 'Save changes' : 'Add division'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Division code" hint="e.g. TECH, BIZ">
          <input
            value={form.code}
            onChange={(e) => update({ code: e.target.value.toUpperCase() })}
            placeholder="TECH"
            className={inp + ' tabular-nums'}
          />
        </Field>
        <Field label="Division name" required>
          <input
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Technology"
            className={inp}
          />
        </Field>
      </div>
    </Modal>
  );
}
