import { Modal } from '@shared/ui/modal';
import { useState } from 'react';
import { inputCls } from '../constants';
import type { CycleForm } from '../constants';
import type { Cycle, CycleStatus } from '../types';

export function EditCycleModal({
  open,
  onClose,
  cycle,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  cycle: Cycle;
  onSave: (f: CycleForm) => void;
}) {
  const [form, setForm] = useState<CycleForm>({
    name: cycle.name,
    startDate: cycle.startDate,
    endDate: cycle.endDate,
    selfDeadline: cycle.selfDeadline ?? '',
    status: cycle.status,
    description: cycle.description,
  });
  const up = (p: Partial<CycleForm>) => setForm((f) => ({ ...f, ...p }));
  const valid = form.name.trim() && form.startDate && form.endDate;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit cycle · ${cycle.name}`}
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Simpan
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Nama cycle
          </label>
          <input
            value={form.name}
            onChange={(e) => up({ name: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Mulai
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => up({ startDate: e.target.value })}
              className={inputCls + ' tabular-nums'}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Selesai
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => up({ endDate: e.target.value })}
              className={inputCls + ' tabular-nums'}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Deadline self-appraisal
            </label>
            <input
              type="date"
              value={form.selfDeadline}
              onChange={(e) => up({ selfDeadline: e.target.value })}
              className={inputCls + ' tabular-nums'}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => up({ status: e.target.value as CycleStatus })}
              className={inputCls}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Deskripsi
          </label>
          <textarea
            value={form.description}
            onChange={(e) => up({ description: e.target.value })}
            rows={2}
            className={inputCls}
          />
        </div>
      </div>
    </Modal>
  );
}
