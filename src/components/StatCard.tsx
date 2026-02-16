import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  color: string;
}

export default function StatCard({ label, value, unit, icon, color }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-bg-border bg-gradient-to-br from-bg-raised to-bg-overlay p-5 shadow-card transition-all hover:border-bg-hover hover:shadow-xl">
      {/* Subtle glow effect */}
      <div 
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
            {label}
          </p>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg shadow-lg transition-transform group-hover:scale-110"
            style={{ 
              backgroundColor: `${color}18`, 
              color,
              boxShadow: `0 4px 14px ${color}30`
            }}
          >
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-mono text-[28px] font-bold leading-none text-text-primary">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-medium text-text-secondary">{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
}
