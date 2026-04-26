import { useState } from 'react'
import { PageShell } from '../components/shell/page-shell'
import { KRA_CYCLE_TEMPLATES } from '../data/mock-kras'
import { Badge } from '../components/shell/badge'

export function HrKraTemplatesPage() {
  const [selected, setSelected] = useState<string>(KRA_CYCLE_TEMPLATES[0]?.id ?? '')

  const template = KRA_CYCLE_TEMPLATES.find(t => t.id === selected)

  return (
    <PageShell breadcrumb="KRA Templates">
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 style={{ fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontWeight: 600, fontSize: '24px', color: 'var(--text-strong,#14182a)' }}>
            KRA Templates
          </h1>
          <button disabled className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed">
            + New Template
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {KRA_CYCLE_TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                selected === t.id
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-brand-200'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {template && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{template.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {template.kras.length} KRAs · total weight {template.kras.reduce((s, k) => s + k.weight, 0)}%
                </p>
              </div>
              <Badge tone="brand">{template.position}</Badge>
            </div>

            <div className="space-y-3">
              {template.kras.map((kra, idx) => (
                <div key={kra.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">KRA {idx + 1}</p>
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-600">{kra.weight}%</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{kra.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{kra.description}</p>
                  <p className="text-xs text-brand-600 font-medium mt-1">Target: {kra.target}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400">Templates are read-only in this demo.</p>
      </div>
    </PageShell>
  )
}
