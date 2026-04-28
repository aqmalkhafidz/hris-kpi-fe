import {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

export function FormField({
  label,
  hint,
  error,
  children,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">
          {label}
        </span>
      )}
      {children}
      {(error || hint) && (
        <span
          className={`mt-1.5 block text-xs ${error ? 'text-error-700 dark:text-error-300' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {error ?? hint}
        </span>
      )}
    </label>
  );
}

const controlClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-100 dark:placeholder:text-gray-500';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${controlClass} h-11 ${props.className ?? ''}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${controlClass} h-11 ${props.className ?? ''}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${controlClass} min-h-28 py-3 ${props.className ?? ''}`}
    />
  );
}

export function FieldLabel(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={`text-xs font-semibold text-gray-700 dark:text-gray-200 ${props.className ?? ''}`}
    />
  );
}
