import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export function Header() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully.');
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link
          to="/"
          className="flex items-center hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
        >
          <Home className="h-4 w-4" />
        </Link>
        {pathnames.length > 0 && (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
        )}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <div key={to} className="flex items-center space-x-2">
              {isLast ? (
                <span className="font-semibold text-foreground truncate max-w-[200px]">
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-foreground transition-colors truncate max-w-[150px]"
                >
                  {label}
                </Link>
              )}
              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              )}
            </div>
          );
        })}
      </nav>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/70 border border-border text-xs font-semibold text-slate-800 dark:text-slate-200">
            <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <User className="h-3 w-3" />
            </div>
            <span className="truncate max-w-[140px]">{user.email}</span>
          </div>
        )}

        {user && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="h-8 gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-border"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
}
