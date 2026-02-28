import { type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Heart, BarChart2, BookOpen, Table2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navLinks = [
  { to: '/', label: 'Dashboard', icon: BarChart2 },
  { to: '/story', label: 'Data Story', icon: BookOpen },
  { to: '/explorer', label: 'Data Explorer', icon: Table2 },
];

export default function Layout({ children }: LayoutProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Title */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 flex-shrink-0">
                <img
                  src="/assets/generated/app-logo.dim_128x128.png"
                  alt="Heart Insight Logo"
                  className="w-9 h-9 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <Heart
                  className="w-9 h-9 text-crimson-500 absolute inset-0 hidden"
                  style={{ display: 'none' }}
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-lg text-foreground tracking-tight">
                  Heart<span className="text-teal-500">Insight</span>
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Heart Disease Analysis
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const isActive = currentPath === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-crimson-500 fill-crimson-500" />
              <span>Heart Disease Analysis Dashboard</span>
            </div>
            <div className="flex items-center gap-1">
              <span>© {new Date().getFullYear()} Built with</span>
              <Heart className="w-3.5 h-3.5 text-crimson-500 fill-crimson-500 mx-0.5" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'heart-insight')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
