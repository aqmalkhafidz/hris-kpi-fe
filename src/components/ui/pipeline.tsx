export interface PipelineStep {
  label: string
  value: number
  tone?: 'brand' | 'success' | 'warning' | 'error' | 'neutral'
}

export function CyclePipeline({ steps }: { steps: PipelineStep[] }) {
  const max = Math.max(...steps.map(step => step.value), 1)
  const tones = {
    brand: 'bg-brand-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    neutral: 'bg-gray-400',
  }
  return (
    <div className="space-y-3">
      {steps.map(step => (
        <div key={step.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-300">{step.label}</span>
            <span className="tabular-nums text-gray-500">{step.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className={`h-full rounded-full ${tones[step.tone ?? 'brand']}`} style={{ width: `${(step.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
