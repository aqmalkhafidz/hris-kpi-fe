export function ScorePicker({ value, onChange, disabled }: { value: number; onChange: (value: number) => void; disabled?: boolean }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5].map(score => {
        const selected = value === score
        return (
          <button
            key={score}
            type="button"
            disabled={disabled}
            onClick={() => onChange(score)}
            className={`h-11 rounded-xl border text-sm font-semibold transition ${
              selected
                ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20 dark:bg-brand-500/15 dark:text-brand-300'
                : 'border-gray-200 bg-white text-gray-500 hover:border-brand-200 hover:text-brand-600 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400'
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {score}
          </button>
        )
      })}
    </div>
  )
}
