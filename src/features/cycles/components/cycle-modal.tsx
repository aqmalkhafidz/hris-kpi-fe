import { Modal } from '@shared/ui/modal';
import { useState } from 'react';
import { inputCls, BLANK_CYCLE_FORM } from '../constants';
import type { CycleForm } from '../constants';
import type { Cycle, CycleStatus } from '../types';

export function CycleModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (f: CycleForm) => void;
  initial: Cycle | null;
}) {
  const [form, setForm] = useState<CycleForm>(
    initial
      ? {
          name: initial.name,
          startDate: initial.startDate,
          endDate: initial.endDate,
          selfDeadline: initial.selfDeadline ?? '',
          status: initial.status,
          description: initial.description,
        }
      : BLANK_CYCLE_FORM
  );
  const up = (p: Partial<CycleForm>) => setForm((f) => ({ ...f, ...p }));
  const valid =
    form.name.trim() &&
    form.startDate &&
    form.endDate &&
    new Date(form.startDate) <= new Date(form.endDate);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? `Edit cycle · ${initial.name}` : 'Cycle baru'}
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
            {initial ? 'Simpan' : 'Buat cycle'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Nama cycle <span className="text-error-500">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => up({ name: e.target.value })}
            placeholder="Q2 2026 Appraisal"
            className={inputCls}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Mulai <span className="text-error-500">*</span>
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
              Selesai <span className="text-error-500">*</span>
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
            <p className="mt-1 text-[11px] text-gray-400">
              Default: akhir periode − 7 hari
            </p>
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
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
          Distribusi hanya bisa dijalankan setelah cycle ber-status{' '}
          <span className="rounded bg-white px-1 font-mono dark:bg-gray-800">
            active
          </span>
          .
        </div>
      </div>
    </Modal>
  );
}
