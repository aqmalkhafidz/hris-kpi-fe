import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '../auth/auth-context'
import { MOCK_USERS } from '../auth/mock-users'
import { Button } from '@shared/ui/button'
import { FormField, Input, Select } from '@shared/ui/form-field'
import { Icon } from '@shared/layouts/icon'

function BrandMark({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${mobile ? 'h-9 w-9 rounded-xl' : 'h-10 w-10 rounded-xl'} flex items-center justify-center bg-brand-500 text-white shadow-lg shadow-brand-500/35`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M5 17l4-9 3 6 3-4 4 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <p className={`${mobile ? 'text-base text-gray-900 dark:text-white' : 'text-base text-white'} font-bold tracking-tight`}>Performa</p>
        {!mobile && <p className="mt-0.5 text-[11px] font-medium uppercase text-white/40">HR Console</p>}
      </div>
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loginError, setLoginError] = useState('')

  const form = useForm({
    defaultValues: { email: '', password: '', quickUserId: '' },
    onSubmit: async ({ value }) => {
      setLoginError('')
      const email = value.quickUserId
        ? MOCK_USERS.find(u => u.id === value.quickUserId)?.email ?? value.email
        : value.email
      const found = MOCK_USERS.find(u => u.email === email)
      if (!found) { setLoginError('Email not found in demo users.'); return }
      if (!value.quickUserId && !value.password) { setLoginError('Password is required.'); return }
      await new Promise(resolve => setTimeout(resolve, 600))
      login(found.id)
      navigate({ to: found.role === 'hr' ? '/hr/dashboard' : '/dashboard' })
    },
  })

  useEffect(() => {
    if (user) navigate({ to: user.role === 'hr' ? '/hr/dashboard' : '/dashboard', replace: true })
  }, [navigate, user])

  if (user) return null

  return (
    <div className="flex min-h-screen bg-[var(--bg-page)]">
      <aside className="login-brand relative hidden min-h-screen w-[44%] shrink-0 flex-col overflow-hidden bg-[#11152a] p-12 text-white md:flex">
        <div className="pointer-events-none absolute -right-40 -top-44 h-[520px] w-[520px] rounded-full bg-brand-500/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-brand-500/15 blur-2xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(70,95,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(70,95,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative">
          <BrandMark />
        </div>

        <div className="relative my-auto max-w-sm">
          <h1 className="text-[46px] font-semibold leading-none text-white">Performance,<br />Simplified.</h1>
          <p className="mt-6 text-sm leading-7 text-white/55">One platform for appraisal cycles, KRA templates, and team performance visibility.</p>
          <div className="mt-10 space-y-4">
            {['360° appraisal workflows', 'Real-time cycle tracking', 'Score distribution & calibration'].map(feature => (
              <div key={feature} className="flex items-center gap-3 text-sm text-white/65">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-400/50 bg-brand-500/25 text-brand-100">{Icon.check}</span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/25">© 2026 Performa · All rights reserved</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[400px]">
          <div className="login-mobile-logo mb-8 flex md:hidden">
            <BrandMark mobile />
          </div>

          <div className="mb-9">
            <h2 className="text-2xl font-semibold">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Use the Quick Login dropdown to test any role.</p>
          </div>

          <form onSubmit={(event) => { event.preventDefault(); form.handleSubmit() }} className="space-y-5">
            {loginError && (
              <div className="rounded-xl border border-error-400 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-300">
                {loginError}
              </div>
            )}

            <form.Field name="quickUserId">
              {(field) => (
                <FormField label="Quick Login (Demo)">
                  <Select
                    value={field.state.value}
                    onChange={(event) => {
                      field.handleChange(event.target.value)
                      const found = MOCK_USERS.find(u => u.id === event.target.value)
                      if (found) {
                        form.setFieldValue('email', found.email)
                        form.setFieldValue('password', 'demo1234')
                      }
                    }}
                  >
                    <option value="">Select a role</option>
                    {MOCK_USERS.map(user => (
                      <option key={user.id} value={user.id}>{user.name} ({user.position})</option>
                    ))}
                  </Select>
                </FormField>
              )}
            </form.Field>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <span className="text-xs text-gray-400">or enter manually</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <form.Field name="email">
              {(field) => (
                <FormField label="Email address">
                  <Input type="email" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} placeholder="you@performa.id" autoComplete="email" />
                </FormField>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <FormField
                  label={<span className="flex items-center justify-between"><span>Password</span><Link to="/forgot-password" className="text-xs font-medium text-brand-600 hover:text-brand-700">Forgot password?</Link></span>}
                >
                  <div className="relative">
                    <Input type={showPass ? 'text' : 'password'} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} placeholder="Enter your password" autoComplete="current-password" className="pr-12" />
                    <button type="button" onClick={() => setShowPass(value => !value)} className="absolute right-3 top-1/2 flex -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                      <EyeIcon open={showPass} />
                    </button>
                  </div>
                </FormField>
              )}
            </form.Field>

            <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-5 w-5 rounded-md border-gray-300 text-brand-500 focus:ring-brand-500" />
              Remember me for 30 days
            </label>

            <form.Subscribe selector={state => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Need access? <a href="mailto:hr@performa.id" className="font-medium text-brand-600">Contact your HR team</a>
          </p>
        </div>
      </main>
    </div>
  )
}
