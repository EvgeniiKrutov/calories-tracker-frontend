import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: 'sm' | 'md';
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  width = 'md',
}: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const maxW = width === 'sm' ? 'max-w-md' : 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/65" onClick={onClose} />
      <div
        className={`relative z-10 w-full ${maxW} rounded-xl border border-bg-border bg-bg-raised shadow-modal`}
      >
        <div className="flex items-center justify-between border-b border-bg-border px-5 py-3.5">
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-muted hover:text-text-secondary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
