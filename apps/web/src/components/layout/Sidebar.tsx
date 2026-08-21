import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Candidates', href: '/candidates', icon: Users },
  { label: 'Applications', href: '/applications', icon: Briefcase },
  { label: 'Kanban Board', href: '/applications/kanban', icon: Layers, badge: 'Bonus' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card/60 backdrop-blur-md flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-bold text-sm leading-none tracking-tight text-foreground">
            Candidate Tracker
          </h1>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">Recruitment Platform</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
          Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold border border-border">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Workspace Footer Info */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="rounded-lg bg-accent/40 border border-border/60 p-3">
          <p className="text-xs font-semibold text-foreground">Production Pipeline</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">PostgreSQL 15 • Fastify 4</p>
        </div>
      </div>
    </aside>
  );
}
