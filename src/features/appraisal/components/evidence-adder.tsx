import { ApiError } from '@shared/api/client';
import { Icon } from '@shared/layouts/icon';
import type { Evidence } from '@shared/lib/types/appraisal';
import { Button } from '@shared/ui/button';
import { FormField, Input, Textarea } from '@shared/ui/form-field';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { uploadEvidenceFile } from '../api/upload-api';

export function EvidenceAdder({
  onAdd,
  disabled,
}: {
  onAdd: (item: Evidence) => void;
  disabled?: boolean;
}) {
  const [kind, setKind] = useState<Evidence['kind']>('url');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [urlError, setUrlError] = useState('');

  const normalizeUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    try {
      return new URL(withProtocol).toString();
    } catch {
      return null;
    }
  };

  const canAdd =
    kind === 'url' ? url.trim().length > 0 : fileName.trim().length > 0;

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAdd) return;
    setUrlError('');

    if (kind === 'url') {
      const normalizedUrl = normalizeUrl(url);
      if (!normalizedUrl) {
        setUrlError('URL tidak valid. Contoh: https://example.com/report');
        return;
      }
      const trimmedDescription = description.trim();
      const parsedUrl = new URL(normalizedUrl);
      const fallbackName = `${parsedUrl.hostname}${parsedUrl.pathname === '/' ? '' : parsedUrl.pathname}`;
      onAdd({
        kind,
        name: trimmedDescription || fallbackName,
        description: trimmedDescription || undefined,
        url: normalizedUrl,
        date: 'Today',
      });
      setUrl('');
    } else {
      if (!file) return;
      setUploading(true);
      try {
        const uploaded = await uploadEvidenceFile(file);
        const trimmedDescription = description.trim();
        onAdd({ ...uploaded, description: trimmedDescription || undefined });
        setFileName('');
        setFile(null);
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : 'Upload evidence gagal. Coba lagi.';
        toast.error(message);
        return;
      } finally {
        setUploading(false);
      }
    }
    setDescription('');
    event.currentTarget.reset();
  };

  return (
    <form
      onSubmit={add}
      className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div className="grid gap-3 lg:grid-cols-[8rem_1fr]">
        <FormField label="Evidence type">
          <select
            value={kind}
            disabled={disabled}
            onChange={(event) => {
              setKind(event.target.value as Evidence['kind']);
              setUrl('');
              setFileName('');
              setDescription('');
            }}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-100"
          >
            <option value="url">URL</option>
            <option value="file">File</option>
          </select>
        </FormField>

        {kind === 'url' ? (
          <FormField
            label="URL"
            hint="Paste the evidence link. Description is optional."
          >
            <Input
              type="text"
              inputMode="url"
              value={url}
              disabled={disabled}
              onChange={(event) => {
                setUrl(event.target.value);
                if (urlError) setUrlError('');
              }}
              placeholder="https://example.com/report"
            />
            {urlError && (
              <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                {urlError}
              </p>
            )}
          </FormField>
        ) : (
          <FormField
            label="Upload file"
            hint={
              fileName
                ? `Selected: ${fileName}`
                : 'Choose a local file for this evidence.'
            }
          >
            <Input
              type="file"
              disabled={disabled}
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null;
                setFile(next);
                setFileName(next?.name ?? '');
              }}
              className="cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700 dark:file:bg-brand-500/15 dark:file:text-brand-300"
            />
          </FormField>
        )}
      </div>

      <div className="mt-3">
        <FormField label="Description (optional)">
          <Textarea
            rows={3}
            disabled={disabled}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={
              kind === 'url'
                ? 'Example: Grafana snapshot showing P95 latency after the rollout.'
                : 'Example: Signed-off UAT report and rollout checklist.'
            }
            className="min-h-24"
          />
        </FormField>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {kind === 'url'
            ? 'Fill URL, then add evidence.'
            : 'Pick file, then add evidence.'}
        </p>
        <Button
          type="submit"
          size="sm"
          disabled={disabled || !canAdd || uploading}
          icon={Icon.plus}
        >
          {uploading ? 'Uploading' : 'Add evidence'}
        </Button>
      </div>
    </form>
  );
}
