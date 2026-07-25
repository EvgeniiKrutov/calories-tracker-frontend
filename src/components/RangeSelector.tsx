import { useEffect, useRef, useState } from 'react';
import { useAppIntl } from '@/hooks/useAppIntl';
import type { MessageDescriptor } from 'react-intl';
import type { ChartRange, ChartRangeState } from '@/types';

interface RangeSelectorProps {
  value: ChartRangeState;
  onChange: (value: ChartRangeState) => void;
}

/** Compact 1 week / 1 month / custom switch used by the daily chart widgets. */
export default function RangeSelector({ value, onChange }: RangeSelectorProps) {
  const { formatMessage, common } = useAppIntl();
  const [pickerOpen, setPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options: { range: ChartRange; label: MessageDescriptor }[] = [
    { range: 'week', label: common.rangeWeek },
    { range: 'month', label: common.rangeMonth },
    { range: 'custom', label: common.rangeCustom },
  ];

  useEffect(() => {
    if (!pickerOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node))
        setPickerOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [pickerOpen]);

  const selectRange = (range: ChartRange) => {
    // Re-clicking Custom toggles the date picker instead of closing it.
    setPickerOpen(
      range === 'custom' && !(value.range === 'custom' && pickerOpen),
    );
    if (range !== value.range) onChange({ ...value, range });
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-0.5 rounded-md bg-bg-overlay p-0.5">
        {options.map(({ range, label }) => (
          <button
            key={range}
            onClick={() => selectRange(range)}
            className={`rounded px-2 py-1 font-mono text-[11px] font-semibold transition-colors ${
              value.range === range
                ? 'bg-bg-subtle text-text-primary'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {formatMessage(label)}
          </button>
        ))}
      </div>

      {pickerOpen && (
        <div className="absolute right-0 top-full z-20 mt-1.5 w-56 rounded-lg border border-bg-border bg-bg-overlay p-3 shadow-lg">
          <div className="space-y-2.5">
            <div>
              <label className="label">{formatMessage(common.startDate)}</label>
              <input
                type="date"
                value={value.start}
                max={value.end || undefined}
                onChange={(e) =>
                  onChange({ ...value, range: 'custom', start: e.target.value })
                }
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="label">{formatMessage(common.endDate)}</label>
              <input
                type="date"
                value={value.end}
                min={value.start || undefined}
                onChange={(e) =>
                  onChange({ ...value, range: 'custom', end: e.target.value })
                }
                className="input-field font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
