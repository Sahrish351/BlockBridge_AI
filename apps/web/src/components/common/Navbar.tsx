import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Bookmark } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'How it Works', path: '/how-it-works' },
    { label: 'Explore Resources', path: '/resources' },
    { label: 'For Organizations', path: '/community-partners' },
    { label: 'Verification Standards', path: '/resource-standards' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-bb-bg/95 backdrop-blur-md border-b border-bb-line transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-bb-focus rounded-xl p-1"
            aria-label="BlockBridge AI Home"
          >
            <div className="w-10 h-10 rounded-xl bg-bb-brand text-white flex items-center justify-center shadow-sm group-hover:bg-bb-brand-hover transition-colors">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M10 32C10 32 16 22 24 22C32 22 38 32 38 32"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M8 32H40"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="14" r="4" fill="#E98770" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-bb-ink leading-none">
                BlockBridge<span className="text-bb-brand font-sans text-xs ml-1.5 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-bb-brand-soft text-bb-brand">AI</span>
              </span>
              <span className="text-[11px] text-bb-ink-muted mt-0.5 font-medium">
                Community Navigator & Action Planner
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-bb-brand bg-bb-brand-soft/60 font-semibold'
                    : 'text-bb-ink-muted hover:text-bb-ink hover:bg-bb-surface-soft'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/app">
              <Button variant="ghost" size="sm" leftIcon={<Bookmark className="w-4 h-4 text-bb-ink-muted" />}>
                <span>My Saved & Plans</span>
              </Button>
            </Link>
            <Link to="/find-support">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Find Support
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link to="/find-support">
              <Button variant="primary" size="sm">
                Find Help
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-bb-ink hover:bg-bb-surface-soft focus:outline-none focus:ring-2 focus:ring-bb-focus"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-bb-line bg-bb-surface px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'text-bb-brand bg-bb-brand-soft/60 font-semibold'
                    : 'text-bb-ink hover:bg-bb-surface-soft'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-bb-line mt-3 space-y-2">
              <Link
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-bb-ink hover:bg-bb-surface-soft"
              >
                <Bookmark className="w-4 h-4 text-bb-brand" />
                <span>My Saved Resources & Action Plans</span>
              </Link>
              <Link
                to="/find-support"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block"
              >
                <Button variant="primary" size="lg" className="w-full">
                  Start Finding Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
