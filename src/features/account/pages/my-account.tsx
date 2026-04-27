import { FormEvent, useRef, useState } from 'react'
import { useAuth } from '@features/auth/context/auth-context'
import { ROLE_LABELS } from '@features/auth/data/mock-users'
import { Avatar } from '@shared/layouts/avatar'
import { Badge } from '@shared/ui/badge'
import { PageShell } from '@shared/layouts/page-shell'
import { Icon } from '@shared/layouts/icon'
import { Button } from '@shared/ui/button'
import { FormField, Input } from '@shared/ui/form-field'
import { PageHeader } from '@shared/ui/page-header'
import { SectionCard } from '@shared/ui/section-card'
import { TabStrip } from '@shared/ui/tab-strip'

type Tab = 'personal' | 'security' | 'preferences'

function SavedNote({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-700 dark:text-success-300">
      {Icon.check}
      {children}
    </span>
  )
}

function ProfilePhoto({ initials }: { initials: string }) {
  const [preview, setPreview] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-brand-50 text-xl font-semibold text-brand-600 dark:border-gray-800 dark:bg-brand-500/15 dark:text-brand-300">
        {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : initials}
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>Change photo</Button>
          {preview && <Button type="button" variant="ghost" size="sm" onClick={() => setPreview('')}>Remove</Button>}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">JPG, PNG or GIF · max 2 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) setPreview(URL.createObjectURL(file))
          }}
        />
      </div>
    </div>
  )
}

function PasswordInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [show, setShow] = useState(false)
  return (
    <FormField label={label}>
      <div className="relative">
        <Input type={show ? 'text' : 'password'} value={value} onChange={event => onChange(event.target.value)} className="pr-12" />
        <button type="button" onClick={() => setShow(value => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          {show ? Icon.search : Icon.x}
        </button>
      </div>
    </FormField>
  )
}

function SecurityPanel() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const strength = [next.length >= 8, /[A-Z]/.test(next), /[0-9]/.test(next), /[^A-Za-z0-9]/.test(next)].filter(Boolean).length

  const save = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!current) { setError('Current password is required.'); return }
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return }
    if (next !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setSaved(true)
      setCurrent('')
      setNext('')
      setConfirm('')
      window.setTimeout(() => setSaved(false), 2500)
    }, 700)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
      <SectionCard title="Change password" description="Use letters, numbers, and symbols for a strong password.">
        <form onSubmit={save} className="space-y-4">
          {error && <div className="rounded-xl border border-error-400 bg-error-50 px-4 py-3 text-sm text-error-700">{error}</div>}
          <PasswordInput label="Current password" value={current} onChange={setCurrent} />
          <PasswordInput label="New password" value={next} onChange={setNext} />
          {next && (
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${strength * 25}%` }} />
              </div>
              <span className="w-14 text-xs font-medium text-gray-500">{['', 'Weak', 'Fair', 'Good', 'Strong'][strength]}</span>
            </div>
          )}
          <PasswordInput label="Confirm new password" value={confirm} onChange={setConfirm} />
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              {loading ? 'Updating…' : 'Update password'}
            </Button>
            {saved && <SavedNote>Password updated</SavedNote>}
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Active sessions">
        <div className="space-y-4">
          {[
            { device: 'MacBook Pro · Chrome', location: 'Jakarta, Indonesia', time: 'Now', current: true },
            { device: 'iPhone 15 · Safari', location: 'Jakarta, Indonesia', time: '2 hours ago', current: false },
          ].map(session => (
            <div key={session.device} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">{Icon.dash}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{session.device} {session.current && <Badge tone="success">Current</Badge>}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{session.location} · {session.time}</p>
              </div>
              {!session.current && <Button type="button" variant="secondary" size="sm">Sign out</Button>}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function PreferencesPanel() {
  return (
    <SectionCard title="Preferences" description="Demo-only settings for notification and interface preferences.">
      <div className="space-y-4">
        {[
          ['Email reminders', 'Cycle deadline and reviewer queue reminders'],
          ['Weekly digest', 'Summary of appraisal progress every Monday'],
          ['Dark mode follows device', 'Use system preference on first visit'],
        ].map(([title, description], index) => (
          <label key={title} className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <span>
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">{description}</span>
            </span>
            <input type="checkbox" defaultChecked={index < 2} className="mt-1 h-5 w-5 rounded-md border-gray-300 text-brand-500 focus:ring-brand-500" />
          </label>
        ))}
      </div>
    </SectionCard>
  )
}

export function MyAccountPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('personal')
  const [phone, setPhone] = useState('+62 812-3456-7890')
  const [emergencyName, setEmergencyName] = useState('Budi Pratama')
  const [emergencyPhone, setEmergencyPhone] = useState('+62 821-9876-5432')
  const [saved, setSaved] = useState(false)
  if (!user) return null

  const readonly = [
    ['Full name', user.name],
    ['Employee ID', `EMP-${user.id.toUpperCase()}847`],
    ['Email', user.email],
    ['Department', user.dept],
    ['Division', user.div ?? '—'],
    ['Squad', user.squad ?? '—'],
    ['Position', user.position],
    ['Role', ROLE_LABELS[user.role]],
  ]

  return (
    <PageShell breadcrumb="My Account">
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <PageHeader category="Account" title="My Account" description="Manage your profile photo, contact details, password, and preferences." />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar initials={user.initials} size="xl" tone="brand" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{user.position}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="brand">{ROLE_LABELS[user.role]}</Badge>
              <Badge tone="neutral">{user.dept}</Badge>
              {user.squad && <Badge tone="neutral">{user.squad}</Badge>}
            </div>
          </div>
          <TabStrip<Tab>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'personal', label: 'Personal' },
              { value: 'security', label: 'Security' },
              { value: 'preferences', label: 'Preferences' },
            ]}
          />
        </div>
      </section>

      {tab === 'personal' && (
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <SectionCard title="Profile photo">
              <ProfilePhoto initials={user.initials} />
            </SectionCard>

            <SectionCard title="Personal information" description="Managed by HR. Contact HR Support to update these fields.">
              <div className="grid gap-4 sm:grid-cols-2">
                {readonly.map(([label, value]) => (
                  <FormField key={label} label={label}>
                    <Input value={value} disabled readOnly />
                  </FormField>
                ))}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Contact details" description="Update your mobile number and emergency contact.">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                setSaved(true)
                window.setTimeout(() => setSaved(false), 2500)
              }}
            >
              <FormField label="Mobile phone"><Input value={phone} onChange={event => setPhone(event.target.value)} /></FormField>
              <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">Emergency contact</p>
                <div className="space-y-4">
                  <FormField label="Full name"><Input value={emergencyName} onChange={event => setEmergencyName(event.target.value)} /></FormField>
                  <FormField label="Phone number"><Input value={emergencyPhone} onChange={event => setEmergencyPhone(event.target.value)} /></FormField>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit">Save changes</Button>
                {saved && <SavedNote>Saved</SavedNote>}
              </div>
            </form>
          </SectionCard>
        </div>
      )}

      {tab === 'security' && <SecurityPanel />}
      {tab === 'preferences' && <PreferencesPanel />}
    </div>
    </PageShell>
  )
}
