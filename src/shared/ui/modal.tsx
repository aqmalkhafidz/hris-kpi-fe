import { Icon } from '@shared/layouts/icon';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  maxWidth = 'max-w-lg',
}: {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/35 p-4 backdrop-blur-sm">
      <section
        className={`flex w-full ${maxWidth} flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900`}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {Icon.x}
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="flex shrink-0 justify-end gap-2 border-t border-gray-100 px-5 py-4 dark:border-gray-800">
            {footer}
          </div>
        )}
      </section>
    </div>,
    document.body
  );
}
