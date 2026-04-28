import { Icon } from '@shared/layouts/icon';
import { Badge } from '@shared/ui/badge';
import { useState, useEffect } from 'react';
import { inputCls, GRADE_OPTIONS } from '../constants';
import type { CompletedAppraisal } from '../hooks/use-reports';
import { gradeFromScore } from '../utils';

interface CalibrationModalProps {
  open: boolean;
  appraisal: CompletedAppraisal | null;
  onClose: () => void;
  onSave: (id: number, score: number | null, grade: string | null) => void;
}

export function CalibrationModal({
  open,
  appraisal,
  onClose,
  onSave,
}: CalibrationModalProps) {
  const [score, setScore] = useState<string>('');
  const [grade, setGrade] = useState<string>('');

  useEffect(() => {
    if (!appraisal) return;
    setScore(String(appraisal.calibratedScore ?? appraisal.finalScore));
    setGrade(appraisal.finalGrade ?? gradeFromScore(appraisal.finalScore));
  }, [appraisal, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !appraisal) return null;

  const parsed = parseFloat(score);
  const valid = !isNaN(parsed) && parsed >= 1 && parsed <= 5 && grade !== '';
  const suggested = gradeFromScore(parsed || 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Calibrate · {appraisal.employee}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {appraisal.position} · {appraisal.dept} · NIP {appraisal.nip}
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]"
          >
            {Icon.x}
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-4">
          <div className="grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-3 dark:bg-white/[0.02]">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">
                Original
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900 dark:text-white">
                {appraisal.finalScore.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">
                Calibrated
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900 dark:text-white">
                {appraisal.calibratedScore !== null ? (
                  appraisal.calibratedScore.toFixed(2)
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">
                Status
              </p>
              <p className="mt-1">
                {appraisal.isCalibrated ? (
                  <Badge tone="success">Calibrated</Badge>
                ) : (
                  <Badge tone="warning">Pending</Badge>
                )}
              </p>
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Calibrated score (1.00 – 5.00){' '}
              <span className="text-error-500">*</span>
            </span>
            <input
              type="number"
              step="0.01"
              min="1"
              max="5"
              value={score}
              onChange={(e) => {
                setScore(e.target.value);
                setGrade(gradeFromScore(parseFloat(e.target.value) || 0));
              }}
              className={inputCls + ' tabular-nums'}
            />
            <span className="mt-1 block text-[11px] text-gray-400">
              Skala sama dengan rating self/reviewer
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Final grade <span className="text-error-500">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {GRADE_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`h-10 min-w-[56px] rounded-lg px-3 text-sm font-bold tabular-nums transition-colors ${
                    grade === g
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <span className="mt-1 block text-[11px] text-gray-400">
              Sistem nyaranin: {suggested} berdasarkan skor
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-white/[0.02]">
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200"
          >
            Cancel
          </button>
          {appraisal.isCalibrated && (
            <button
              onClick={() => {
                onSave(appraisal.id, null, null);
                onClose();
              }}
              className="h-9 rounded-lg border border-error-300 bg-white px-4 text-sm font-semibold text-error-600 hover:bg-error-50 dark:border-error-500/40 dark:bg-white/[0.03] dark:text-error-300"
            >
              Reset calibration
            </button>
          )}
          <button
            onClick={() => {
              onSave(appraisal.id, parsed, grade);
              onClose();
            }}
            disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save calibration
          </button>
        </div>
      </div>
    </div>
  );
}
