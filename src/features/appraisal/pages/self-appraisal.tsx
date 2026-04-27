import { FormEvent, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@features/auth/context/auth-context'
import { useAdvanceAppraisal, useMyAppraisals, useSubmitAppraisal } from '../hooks/use-appraisal'
import { Badge } from '@shared/layouts/sidebar-badge'
import { Icon } from '@shared/layouts/icon'
import { PageShell } from '@shared/layouts/page-shell'
import { Avatar } from '@shared/layouts/avatar'
import { Button } from '@shared/ui/button'
import { EmptyState } from '@shared/ui/empty-state'
import { EvidenceList } from '@shared/domain/evidence-list'
import { FormField, Input, Textarea } from '@shared/ui/form-field'
import { PageHeader } from '@shared/ui/page-header'
import { ScorePicker } from '@shared/domain/score-picker'
import { SectionCard } from '@shared/ui/section-card'
import { StatusBadge } from '@shared/ui/status-badge'
import { ApprovalStepper } from '../components/stepper'
import { AuditTimeline } from '@shared/domain/audit-timeline'
import { Evidence, Kra, lastReturnEntry } from '../data/mock-appraisals'

const SCORE_LABELS: Record<number, string> = {
  1: 'Far Below Expectation',
  2: 'Below Expectation',
  3: 'Meet Expectation',
  4: 'Exceed Expectation',
  5: 'Far Exceed Expectation',
}

interface KraDraft {
  score: number
  comment: string
  evidence: Evidence[]
}

function EvidenceAdder({ onAdd, disabled }: { onAdd: (item: Evidence) => void; disabled?: boolean }) {
  const [kind, setKind] = useState<Evidence['kind']>('url')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [fileName, setFileName] = useState('')

  const canAdd = kind === 'url'
    ? url.trim().length > 0 && description.trim().length > 0
    : fileName.trim().length > 0 && description.trim().length > 0

  const add = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canAdd) return

    if (kind === 'url') {
      onAdd({
        kind,
        name: description.trim(),
        description: description.trim(),
        url: url.trim(),
        date: 'Today',
      })
      setUrl('')
    } else {
      onAdd({
        kind,
        name: fileName.trim(),
        description: description.trim(),
        date: 'Today',
      })
      setFileName('')
    }
    setDescription('')
    event.currentTarget.reset()
  }

  return (
    <form onSubmit={add} className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="grid gap-3 lg:grid-cols-[8rem_1fr_auto]">
        <FormField label="Evidence type">
          <select
            value={kind}
            disabled={disabled}
            onChange={event => {
              setKind(event.target.value as Evidence['kind'])
              setUrl('')
              setFileName('')
              setDescription('')
            }}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-100"
          >
            <option value="url">URL</option>
            <option value="file">File</option>
          </select>
        </FormField>

        {kind === 'url' ? (
          <FormField label="URL" hint="Paste the evidence link, then describe what it proves.">
            <Input type="url" value={url} disabled={disabled} onChange={event => setUrl(event.target.value)} placeholder="https://example.com/report" />
          </FormField>
        ) : (
          <FormField label="Upload file" hint={fileName ? `Selected: ${fileName}` : 'Choose a local file for this evidence.'}>
            <Input
              type="file"
              disabled={disabled}
              onChange={event => setFileName(event.target.files?.[0]?.name ?? '')}
              className="cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700 dark:file:bg-brand-500/15 dark:file:text-brand-300"
            />
          </FormField>
        )}

        <div className="flex items-end">
          <Button type="submit" size="sm" disabled={disabled || !canAdd} icon={Icon.plus}>Add</Button>
        </div>
      </div>

      <div className="mt-3">
        <FormField label="Description">
          <Textarea
            rows={3}
            disabled={disabled}
            value={description}
            onChange={event => setDescription(event.target.value)}
            placeholder={kind === 'url' ? 'Example: Grafana snapshot showing P95 latency after the rollout.' : 'Example: Signed-off UAT report and rollout checklist.'}
            className="min-h-24"
          />
        </FormField>
      </div>
    </form>
  )
}

function ChecklistItem({ done, children }: { done: boolean; children: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-success-500 text-white' : 'border border-gray-300 text-transparent dark:border-gray-700'}`}>
        {Icon.check}
      </span>
      <span className={done ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}>{children}</span>
    </li>
  )
}

export function SelfAppraisalPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: appraisals, isLoading } = useMyAppraisals(user?.id ?? '')
  const submitMut = useSubmitAppraisal()
  const advanceMut = useAdvanceAppraisal()
  const appraisal = appraisals?.[0]

  const [activeKraId, setActiveKraId] = useState('')
  const [showReflection, setShowReflection] = useState(false)
  const [kraDrafts, setKraDrafts] = useState<Record<string, KraDraft>>({})
  const [reflection, setReflection] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  const activeId = activeKraId || appraisal?.kras[0]?.id || ''
  const draftKras = useMemo(() => {
    if (!appraisal) return []
    return appraisal.kras.map(kra => ({
      ...kra,
      self_score: kraDrafts[kra.id]?.score ?? kra.self_score,
      self_comment: kraDrafts[kra.id]?.comment ?? kra.self_comment,
      evidence: kraDrafts[kra.id]?.evidence ?? kra.evidence,
    }))
  }, [appraisal, kraDrafts])
  const active = draftKras.find(kra => kra.id === activeId) ?? draftKras[0]
  const totalWeight = draftKras.reduce((sum, kra) => sum + kra.weight, 0)
  const filledKras = draftKras.filter(kra => kra.self_score > 0)
  const allScored = draftKras.length > 0 && filledKras.length === draftKras.length
  const currentReflection = reflection || appraisal?.reflection || ''
  const reflectionFilled = currentReflection.trim().length > 0
  const completion = draftKras.length ? Math.round(((filledKras.length + (reflectionFilled ? 1 : 0)) / (draftKras.length + 1)) * 100) : 0
  const editable = appraisal?.status === 'draft'
  const submitDisabled = !editable || !allScored || !reflectionFilled || saving
  const returnNote = appraisal && appraisal.status === 'draft' ? lastReturnEntry(appraisal) : undefined

  const patchKra = (kra: Kra, patch: Partial<KraDraft>) => {
    setKraDrafts(prev => ({
      ...prev,
      [kra.id]: {
        score: prev[kra.id]?.score ?? kra.self_score,
        comment: prev[kra.id]?.comment ?? kra.self_comment,
        evidence: prev[kra.id]?.evidence ?? kra.evidence,
        ...patch,
      },
    }))
  }

  const collectKras = () => draftKras.map(kra => ({ ...kra }))

  const saveDraft = async () => {
    if (!appraisal) return
    setSaving(true)
    await submitMut.mutateAsync({ appraisalId: appraisal.id, updates: { kras: collectKras(), reflection: currentReflection } })
    setSaving(false)
    setSavedMessage('Draft saved')
    window.setTimeout(() => setSavedMessage(''), 2200)
  }

  const submitFinal = async () => {
    if (!appraisal || !user) return
    setSaving(true)
    await submitMut.mutateAsync({ appraisalId: appraisal.id, updates: { kras: collectKras(), reflection: currentReflection, submittedAt: 'Today' } })
    await advanceMut.mutateAsync({
      appraisalId: appraisal.id,
      userRole: user.role,
      actor: { userId: user.id, name: user.name, role: user.role },
    })
    setSaving(false)
    navigate({ to: '/dashboard' })
  }

  const goNext = () => {
    if (!active || !appraisal) return
    const index = draftKras.findIndex(kra => kra.id === active.id)
    if (index < draftKras.length - 1) setActiveKraId(draftKras[index + 1].id)
    else setShowReflection(true)
  }

  const goPrev = () => {
    if (showReflection) {
      setShowReflection(false)
      setActiveKraId(draftKras[draftKras.length - 1]?.id ?? '')
      return
    }
    if (!active) return
    const index = draftKras.findIndex(kra => kra.id === active.id)
    if (index > 0) setActiveKraId(draftKras[index - 1].id)
  }

  if (isLoading) {
    return <PageShell breadcrumb="Self-Appraisal"><div className="px-6 py-8"><EmptyState title="Loading appraisal..." /></div></PageShell>
  }

  if (!appraisal) {
    return <PageShell breadcrumb="Self-Appraisal"><div className="px-6 py-8"><EmptyState title="No active appraisal found." /></div></PageShell>
  }

  return (
    <PageShell breadcrumb="Self-Appraisal">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <PageHeader
          category={`Self appraisal · ${appraisal.cycleShort}`}
          title={appraisal.cycleName}
          description={`Template: Technology KRA · KRA weight total ${totalWeight}% · cycle window Jan 1 - Mar 31, 2026`}
          actions={<StatusBadge status={appraisal.status} size="md" />}
        />

        <SectionCard>
          <div className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Completion</span>
                  <span className="font-semibold tabular-nums text-gray-700 dark:text-gray-300">{filledKras.length}/{draftKras.length} KRAs · reflection {reflectionFilled ? 'complete' : 'pending'} · {completion}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${completion}%` }} />
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-xs text-gray-500 dark:text-gray-400">Reviewer chain</p>
                <div className="mt-1 flex items-center gap-2">
                  <Avatar initials={appraisal.reviewers.sl.initials} size="sm" tone="brand" />
                  <span className="text-gray-400">{Icon.chev}</span>
                  <Avatar initials={appraisal.reviewers.hod.initials} size="sm" tone="success" />
                  <span className="text-gray-400">{Icon.chev}</span>
                  <Avatar initials={appraisal.reviewers.hodiv.initials} size="sm" tone="warning" />
                </div>
              </div>
            </div>
            <ApprovalStepper status={appraisal.status} />
          </div>
        </SectionCard>

        {!editable && (
          <section className="rounded-2xl border border-warning-100 bg-warning-50 px-5 py-4 text-sm text-warning-700 dark:border-warning-500/20 dark:bg-warning-500/10 dark:text-warning-300">
            This appraisal is already in <strong>{appraisal.status.replace(/_/g, ' ')}</strong>. Editing is locked.
          </section>
        )}

        {returnNote && (
          <section className="rounded-2xl border border-warning-200 bg-warning-50 px-5 py-4 dark:border-warning-500/30 dark:bg-warning-500/10">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warning-500 text-white">
                {Icon.warn}
              </div>
              <div className="flex-1 text-sm">
                <p className="font-semibold text-warning-800 dark:text-warning-200">
                  Returned by {returnNote.actor_name} ({returnNote.actor_role.toUpperCase()})
                </p>
                <p className="mt-1 text-warning-700 dark:text-warning-300">{returnNote.reason}</p>
                <p className="mt-2 text-xs text-warning-600 dark:text-warning-400">
                  {new Date(returnNote.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
            <SectionCard>
              <p className="mb-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">KRA list · {filledKras.length}/{draftKras.length} scored</p>
              <div className="space-y-1.5">
                {draftKras.map((kra, index) => {
                  const isActive = !showReflection && active?.id === kra.id
                  const done = kra.self_score > 0 && kra.self_comment.trim().length > 0
                  return (
                    <button
                      key={kra.id}
                      type="button"
                      onClick={() => { setActiveKraId(kra.id); setShowReflection(false) }}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                        isActive ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-500/20 dark:bg-brand-500/15 dark:text-brand-300' : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${done ? 'bg-success-500 text-white' : 'border border-dashed border-gray-300 text-gray-400 dark:border-gray-700'}`}>
                        {done ? Icon.check : index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{kra.title}</span>
                        <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Weight {kra.weight}% · {kra.self_score ? `Score ${kra.self_score}/5` : 'Score required'}</span>
                      </span>
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setShowReflection(true)}
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                    showReflection ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-500/20 dark:bg-brand-500/15 dark:text-brand-300' : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${reflectionFilled ? 'bg-success-500 text-white' : 'border border-dashed border-gray-300 text-gray-400 dark:border-gray-700'}`}>
                    {reflectionFilled ? Icon.check : Icon.feedback}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">Employee reflection</span>
                    <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Closing narrative</span>
                  </span>
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Submit checklist">
              <ul className="space-y-2">
                <ChecklistItem done={allScored}>All KRAs scored</ChecklistItem>
                <ChecklistItem done={reflectionFilled}>Reflection written</ChecklistItem>
                <ChecklistItem done={totalWeight === 100}>KRA weight totals 100%</ChecklistItem>
              </ul>
              {user?.role === 'sl' && (
                <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-xs text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
                  Your own appraisal skips SL review and routes directly to HoD.
                </div>
              )}
            </SectionCard>

            <SectionCard title="History">
              <AuditTimeline entries={appraisal.audit_log} />
            </SectionCard>
          </aside>

          <section className="lg:col-span-8 xl:col-span-9">
            <SectionCard
              title={showReflection ? 'Employee reflection' : active?.title}
              description={showReflection ? 'Step back from the KRAs and summarize the cycle.' : active ? `Target: ${active.target} · Weight ${active.weight}%` : undefined}
              action={active && !showReflection ? <Badge tone="neutral">KRA {draftKras.findIndex(kra => kra.id === active.id) + 1}</Badge> : undefined}
            >
              {showReflection ? (
                <FormField label="Overall reflection">
                  <Textarea
                    rows={8}
                    disabled={!editable}
                    value={currentReflection}
                    onChange={event => setReflection(event.target.value)}
                    placeholder="What went well, what changed, and what will you improve next cycle?"
                  />
                </FormField>
              ) : active ? (
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{active.description}</p>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Self score</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{SCORE_LABELS[active.self_score] ?? 'Choose a score'}</p>
                    </div>
                    <ScorePicker value={active.self_score} disabled={!editable} onChange={score => patchKra(active, { score })} />
                  </div>

                  <FormField label="Achievement narrative">
                    <Textarea
                      rows={6}
                      disabled={!editable}
                      value={active.self_comment}
                      onChange={event => patchKra(active, { comment: event.target.value })}
                      placeholder="What did you deliver against this KRA? Include numbers, links, blockers, and lessons learned."
                    />
                  </FormField>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Evidence <span className="font-normal text-gray-400">({active.evidence.length})</span></p>
                    </div>
                    <EvidenceList
                      items={active.evidence}
                      onDelete={editable ? index => patchKra(active, { evidence: active.evidence.filter((_, itemIndex) => itemIndex !== index) }) : undefined}
                    />
                    <EvidenceAdder disabled={!editable} onAdd={item => patchKra(active, { evidence: [...active.evidence, item] })} />
                  </div>
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={goPrev}>Previous</Button>
                  {!showReflection && <Button type="button" variant="secondary" size="sm" onClick={goNext}>Next</Button>}
                </div>
                <div className="flex items-center gap-3">
                  {savedMessage && <span className="text-sm font-medium text-success-700 dark:text-success-300">{savedMessage}</span>}
                  <Button type="button" variant="secondary" size="sm" disabled={!editable || saving} onClick={saveDraft}>Save draft</Button>
                  <Button type="button" size="sm" disabled={submitDisabled} onClick={submitFinal} icon={Icon.send}>{saving ? 'Submitting...' : 'Submit final'}</Button>
                </div>
              </div>
            </SectionCard>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
