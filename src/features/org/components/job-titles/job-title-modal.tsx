import { Modal } from '@shared/ui/modal';
import { useState } from 'react';
import { inp } from '../../constants';
import type { JobTitle } from '../../types';
import { Field } from '../shared/field';

export function JobTitleModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: Omit<JobTitle, 'id'>, id?: number) => void;
  initial?: JobTitle | null;
}) {
  const blank: Omit<JobTitle, 'id'> = {
    code: '',
    name: '',
    level: '',
    department: '',
    description: '',
    headcount: 0,
  };
  const [form, setForm] = useState<Omit<JobTitle, 'id'>>(
    initial
      ? {
          code: initial.code,
          name: initial.name,
          level: initial.level,
          department: initial.department,
          description: initial.description,
          headcount: initial.headcount,
        }
      : blank
  );
  const update = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? `Edit job title · ${initial.name}` : 'Add job title'}
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
            {initial ? 'Save changes' : 'Add job title'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Job title name" required>
          <input
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Software Engineer"
            className={inp}
          />
        </Field>
        <Field label="Description" hint="Optional">
          <input
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Brief description of this role"
            className={inp}
          />
        </Field>
      </div>
    </Modal>
  );
}
