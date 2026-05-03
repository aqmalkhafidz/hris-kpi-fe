import {
  changePasswordApi,
  updateContactApi,
  uploadAvatarApi,
} from '@features/auth/api/auth-api';
import { useAuth } from '@features/auth/context/auth-context';
import { ROLE_LABELS } from '@features/auth/types';
import { useProtectedObjectUrl } from '@shared/hooks/use-protected-object-url';
import { Avatar } from '@shared/layouts/avatar';
import { Icon } from '@shared/layouts/icon';
import { PageShell } from '@shared/layouts/page-shell';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { FormField, Input } from '@shared/ui/form-field';
import { PageHeader } from '@shared/ui/page-header';
import { SectionCard } from '@shared/ui/section-card';
import { TabStrip } from '@shared/ui/tab-strip';
import { useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef, useState } from 'react';

type Tab = 'personal' | 'security';

function SavedNote({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-700 dark:text-success-300">
      {Icon.check}
      {children}
    </span>
  );
}

function ProfilePhoto({
  initials,
  avatarUrl,
  onUploaded,
}: {
  initials: string;
  avatarUrl: string | null;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const avatar = useProtectedObjectUrl(avatarUrl);

  const handleFile = async (file: File) => {
    setError('');
    if (file.size > 2 * 1024 * 1024) {
      setError('Avatar exceeds 2 MB');
      return;
    }
    setUploading(true);
    try {
      const result = await uploadAvatarApi(file);
      onUploaded(result.avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-brand-50 text-xl font-semibold text-brand-600 dark:border-gray-800 dark:bg-brand-500/15 dark:text-brand-300">
        {avatar.src ? (
          <img src={avatar.src} alt="" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? 'Uploading…' : 'Change photo'}
          </Button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          JPG, PNG or GIF · max 2 MB
        </p>
        {error && (
          <p className="mt-1 text-xs text-error-600 dark:text-error-400">
            {error}
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <FormField label={label}>
      <div className="relative">
        <Input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setShow((value) => !value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          {show ? Icon.search : Icon.x}
        </button>
      </div>
    </FormField>
  );
}

function SecurityPanel() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const strength = [
    next.length >= 8,
    /[A-Z]/.test(next),
    /[0-9]/.test(next),
    /[^A-Za-z0-9]/.test(next),
  ].filter(Boolean).length;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!current) {
      setError('Current password is required.');
      return;
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await changePasswordApi(current, next);
      setSaved(true);
      setCurrent('');
      setNext('');
      setConfirm('');
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to update password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard
      title="Change password"
      description="Use letters, numbers, and symbols for a strong password."
    >
      <form onSubmit={save} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-error-400 bg-error-50 px-4 py-3 text-sm text-error-700">
            {error}
          </div>
        )}
        <PasswordInput
          label="Current password"
          value={current}
          onChange={setCurrent}
        />
        <PasswordInput label="New password" value={next} onChange={setNext} />
        {next && (
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${strength * 25}%` }}
              />
            </div>
            <span className="w-14 text-xs font-medium text-gray-500">
              {['', 'Weak', 'Fair', 'Good', 'Strong'][strength]}
            </span>
          </div>
        )}
        <PasswordInput
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
        />
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {loading ? 'Updating…' : 'Update password'}
          </Button>
          {saved && <SavedNote>Password updated</SavedNote>}
        </div>
      </form>
    </SectionCard>
  );
}

export function MyAccountPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const avatar = useProtectedObjectUrl(user?.avatarUrl);
  const [tab, setTab] = useState<Tab>('personal');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [emergencyName, setEmergencyName] = useState(user?.emergencyName ?? '');
  const [emergencyPhone, setEmergencyPhone] = useState(
    user?.emergencyPhone ?? ''
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [contactError, setContactError] = useState('');
  if (!user) return null;

  const updateAuthCache = (patch: Partial<typeof user>) => {
    queryClient.setQueryData(['me'], { ...user, ...patch });
  };

  const handleAvatarUploaded = (avatarUrl: string) => {
    updateAuthCache({ avatarUrl });
  };

  const handleContactSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setContactError('');
    setSaving(true);
    try {
      const result = await updateContactApi({
        phone: phone.trim() || null,
        emergencyName: emergencyName.trim() || null,
        emergencyPhone: emergencyPhone.trim() || null,
      });
      updateAuthCache(result);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setContactError(
        err instanceof Error ? err.message : 'Failed to save contact'
      );
    } finally {
      setSaving(false);
    }
  };

  const readonly: [string, string][] = [
    ['Full name', user.name],
    ['Employee ID', user.nip ?? `EMP-${String(user.id).padStart(4, '0')}`],
    ['Email', user.email],
    ['Department', user.dept ?? '—'],
    ['Division', user.div ?? '—'],
    ['Squad', user.squad ?? '—'],
    ['Position', user.position ?? '—'],
    ['Role', ROLE_LABELS[user.role]],
  ];

  return (
    <PageShell breadcrumb="My Account" maxWidth="6xl">
      <PageHeader
        category="Account"
        title="My Account"
        description="Manage your profile photo, contact details, password, and preferences."
      />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {avatar.src ? (
            <img
              src={avatar.src}
              alt=""
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <Avatar initials={user.initials} size="xl" tone="brand" />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {user.position ?? '—'}
            </p>
            <p className="text-sm text-gray-400">{user.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="brand">{ROLE_LABELS[user.role]}</Badge>
              {user.dept && <Badge tone="neutral">{user.dept}</Badge>}
              {user.squad && <Badge tone="neutral">{user.squad}</Badge>}
            </div>
          </div>
          <TabStrip<Tab>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'personal', label: 'Personal' },
              { value: 'security', label: 'Security' },
            ]}
          />
        </div>
      </section>

      {tab === 'personal' && (
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <SectionCard title="Profile photo">
              <ProfilePhoto
                initials={user.initials}
                avatarUrl={user.avatarUrl}
                onUploaded={handleAvatarUploaded}
              />
            </SectionCard>

            <SectionCard
              title="Personal information"
              description="Managed by HR. Contact HR Support to update these fields."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {readonly.map(([label, value]) => (
                  <FormField key={label} label={label}>
                    <Input value={value} disabled readOnly />
                  </FormField>
                ))}
              </div>
            </SectionCard>
          </div>

          <SectionCard
            title="Contact details"
            description="Update your mobile number and emergency contact."
          >
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              {contactError && (
                <div className="rounded-xl border border-error-400 bg-error-50 px-4 py-3 text-sm text-error-700">
                  {contactError}
                </div>
              )}
              <FormField label="Mobile phone">
                <Input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </FormField>
              <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Emergency contact
                </p>
                <div className="space-y-4">
                  <FormField label="Full name">
                    <Input
                      value={emergencyName}
                      onChange={(event) => setEmergencyName(event.target.value)}
                    />
                  </FormField>
                  <FormField label="Phone number">
                    <Input
                      value={emergencyPhone}
                      onChange={(event) =>
                        setEmergencyPhone(event.target.value)
                      }
                    />
                  </FormField>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
                {saved && <SavedNote>Saved</SavedNote>}
              </div>
            </form>
          </SectionCard>
        </div>
      )}

      {tab === 'security' && <SecurityPanel />}
    </PageShell>
  );
}
