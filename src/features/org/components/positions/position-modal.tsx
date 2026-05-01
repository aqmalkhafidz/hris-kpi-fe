import { Modal } from '@shared/ui/modal';
import { useState, useEffect } from 'react';
import { inp } from '../../constants';
import type { Department, Division, Position } from '../../types';
import { Field } from '../shared/field';

export function PositionModal({
  open,
  onClose,
  onSave,
  initial,
  departments,
  divisions,
  kraTemplateNames,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: Omit<Position, 'id'>, id?: number) => void;
  initial?: Position | null;
  departments: Department[];
  divisions: Division[];
  kraTemplateNames: string[];
}) {
  const firstDivId = divisions[0]?.id ?? 0;
  const firstDept =
    departments.find((d) => d.divId === firstDivId) ?? departments[0];
  const blank: Omit<Position, 'id'> = {
    code: '',
    title: '',
    level: 'IC2',
    deptId: firstDept?.id ?? 0,
    divId: firstDivId,
    template: kraTemplateNames[0] ?? '',
    headcount: 0,
  };
  const [form, setForm] = useState<Omit<Position, 'id'>>(blank);

  useEffect(() => {
    if (initial) {
      setForm({
        code: initial.code,
        title: initial.title,
        level: initial.level,
        deptId: initial.deptId,
        divId: initial.divId,
        template: initial.template,
        headcount: initial.headcount,
      });
    } else {
      setForm(blank);
    }
  }, [initial, open]);

  const update = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const onDivisionChange = (divId: number) => {
    const firstDeptInDiv = departments.find((d) => d.divId === divId);
    update({ divId, deptId: firstDeptInDiv?.id ?? 0 });
  };

  const deptsForDiv = departments.filter((d) => d.divId === form.divId);

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
        <div className="grid grid-cols-2 gap-3">
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
              onChange={(e) => update({ deptId: Number(e.target.value) })}
              className={inp}
            >
              <option value="">— Select department —</option>
              {deptsForDiv.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
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
