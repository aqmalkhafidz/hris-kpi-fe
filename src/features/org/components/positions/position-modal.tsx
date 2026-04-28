import { Modal } from '@shared/ui/modal';
import { useState } from 'react';
import { inp } from '../../constants';
import type { Position } from '../../types';
import { Field } from '../shared/field';

export function PositionModal({
  open,
  onClose,
  onSave,
  initial,
  departments,
  kraTemplateNames,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: Omit<Position, 'id'>, id?: number) => void;
  initial?: Position | null;
  departments: Department[];
  kraTemplateNames: string[];
}) {
  const blank: Omit<Position, 'id'> = {
    code: '',
    title: '',
    level: 'IC2',
    dept: departments[0]?.name ?? '',
    deptId: departments[0]?.id ?? 0,
    template: kraTemplateNames[0] ?? '',
    headcount: 0,
  };
  const [form, setForm] = useState<Omit<Position, 'id'>>(
    initial
      ? {
          code: initial.code,
          title: initial.title,
          level: initial.level,
          dept: initial.dept,
          deptId: initial.deptId,
          template: initial.template,
          headcount: initial.headcount,
        }
      : blank
  );
  const update = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const onDeptChange = (name: string) => {
    const dept = departments.find((d) => d.name === name);
    update({ dept: name, deptId: dept?.id ?? 0 });
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? `Edit position · ${initial.title}` : 'Add position'}
      maxWidth="max-w-[95vw] md:max-w-3xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            disabled={!form.code.trim() || !form.title.trim()}
            onClick={() => {
              onSave(form, initial?.id);
              onClose();
            }}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {initial ? 'Save changes' : 'Add position'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Code" required hint="e.g. ENG-SE-1">
            <input
              value={form.code}
              onChange={(e) => update({ code: e.target.value.toUpperCase() })}
              className={inp + ' tabular-nums'}
            />
          </Field>
          <div className="col-span-2">
            <Field label="Position title" required>
              <input
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Software Engineer"
                className={inp}
              />
            </Field>
          </div>
        </div>
        <Field label="Department" required>
          <select
            value={form.dept}
            onChange={(e) => onDeptChange(e.target.value)}
            className={inp}
          >
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="KRA template">
          <select
            value={form.template}
            onChange={(e) => update({ template: e.target.value })}
            className={inp}
          >
            <option value="">— No template —</option>
            {kraTemplateNames.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </Modal>
  );
}
