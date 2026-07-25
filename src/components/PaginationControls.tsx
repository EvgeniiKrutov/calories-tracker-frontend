import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  setPage: (updater: (p: number) => number) => void;
}

export default function PaginationControls({
  page,
  totalPages,
  setPage,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between border-t border-bg-border px-4 py-3">
      <span className="text-xs text-text-tertiary">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-muted hover:text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
          className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-muted hover:text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
