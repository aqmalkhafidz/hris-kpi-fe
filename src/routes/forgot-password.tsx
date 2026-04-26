import { FormEvent, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { FormField, Input } from '../components/ui/form-field'
import { Icon } from '../components/shell/icon'

function BrandMark() {
  return (
    <div className="mb-8 flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
          <path d="M5 17l4-9 3 6 3-4 4 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">Performa</p>
    </div>
  )
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email address.'); return }
    setLoading(true)
    window.setTimeout(() => { setLoading(false); setSent(true) }, 700)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] px-6 py-10">
      <div className="w-full max-w-[420px]">
        <Link to="/login" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600">
          <span className="rotate-180">{Icon.chev}</span>
          Back to sign in
        </Link>

        <section className="rounded-2xl border border-gray-200 bg-white p-10 shadow-md dark:border-gray-800 dark:bg-gray-900">
          <BrandMark />

          {!sent ? (
            <>
              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-600 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
                  {Icon.cog}
                </div>
                <h2 className="text-2xl font-semibold">Forgot your password?</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">No problem. Enter your work email and we'll send a reset link.</p>
              </div>

              <form onSubmit={submit} className="space-y-5">
                {error && <div className="rounded-xl border border-error-400 bg-error-50 px-4 py-3 text-sm text-error-700">{error}</div>}
                <FormField label="Email address">
                  <Input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@performa.id" autoComplete="email" />
                </FormField>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                  {loading ? 'Sending…' : 'Send reset link'}
                </Button>
              </form>
            </>
          ) : (
            <div className="py-2 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-success-100 bg-success-50 text-success-700 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-300">
                {Icon.check}
              </div>
              <h2 className="text-2xl font-semibold">Check your email</h2>
              <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                We sent a reset link to <strong className="font-semibold text-gray-900 dark:text-white">{email}</strong>. It should arrive within a minute.
              </p>
              <Button type="button" className="mt-8" onClick={() => setSent(false)}>Try another email</Button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
