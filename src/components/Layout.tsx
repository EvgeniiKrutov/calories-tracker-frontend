import { useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Menu,
  X,
  Flame,
} from 'lucide-react';
import { useAppIntl } from '@/hooks/useAppIntl';

const nav = [
  { to: '/', labelKey: 'dashboard', icon: LayoutDashboard },
  { to: '/records', labelKey: 'records', icon: ClipboardList },
  { to: '/meals', labelKey: 'meals', icon: UtensilsCrossed },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { formatMessage, nav: navMessages, common } = useAppIntl();

  const pageTitle =
    nav.find((n) =>
      n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to),
    )?.labelKey ?? '';

  const getNavLabel = (labelKey: string) => {
    return formatMessage(navMessages[labelKey as keyof typeof navMessages]);
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-bg">
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-bg-border bg-bg-raised
          lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-bg-border px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
            <Flame className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            {formatMessage(common.appName)}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-4">
          <div className="space-y-0.5">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-[13px] font-medium
                  ${
                    isActive
                      ? 'bg-accent-muted text-accent-text'
                      : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                  }`
                }
              >
                <item.icon className="h-[15px] w-[15px] shrink-0" />
                {getNavLabel(item.labelKey)}
              </NavLink>
            ))}
          </div>
        </nav>

      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-bg-border px-4 lg:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-bg-subtle"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-2">
            <Flame className="h-3.5 w-3.5 text-accent" />
            <span className="text-sm font-semibold text-text-primary">
              {pageTitle ? getNavLabel(pageTitle) : formatMessage(common.appName)}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] px-6 py-6 lg:px-10 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
