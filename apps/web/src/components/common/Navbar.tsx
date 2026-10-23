import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Bookmark, LogOut, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  isHome?: boolean;
  hasDropdown?: boolean;
}

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, role, signOut } = useAuth();

  const navLinks: NavItem[] = [
    { label: 'Home', path: '/', isHome: true },
    { label: 'Explore Resources', path: '/resources', hasDropdown: true },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'For Organizations', path: '/community-partners' },
    { label: 'Verification Standards', path: '/resource-standards' },
  ];

  if (role === 'admin') {
    navLinks.push({ label: 'Moderation Queue', path: '/admin', isHome: false, hasDropdown: false });
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E8E4DA] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-bb-focus rounded-xl p-1"
            aria-label="BlockBridge AI Home"
          >
            
            <div className="w-11 h-11 rounded-2xl bg-[#246B52] text-white flex items-center justify-center shadow-sm group-hover:bg-[#1B533F] transition-colors flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
                <path d="M9 21v-7a3 3 0 0 1 6 0v7" />
              </svg>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#202720]">
                  BlockBridge
                </span>
                <span className="text-[#246B52] font-sans text-xs font-bold uppercase tracking-wider">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-bb-ink-muted mt-1 font-medium tracking-tight">
                Community Navigator & Action Planner
              </span>
            </div>
          </Link>

          
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                    active
                      ? 'text-[#202720] font-semibold'
                      : 'text-bb-ink-muted hover:text-[#202720]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                  )}
                  
                  {active && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2.5px] bg-[#246B52] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          
          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/resources"
              className="p-2 text-[#202720] hover:text-[#246B52] hover:bg-bb-surface-soft rounded-full transition-colors"
              title="Search Directory"
              aria-label="Search Resources"
            >
              <Search className="w-4 h-4" />
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/app">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-bb-brand hover:underline">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Workspace</span>
                  </span>
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-bb-line text-xs">
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-bb-ink leading-tight line-clamp-1 max-w-[110px]">
                      {profile?.display_name || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-bb-brand">
                      {role.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 rounded-lg text-bb-ink-muted hover:text-bb-danger transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#202720] hover:text-[#246B52] transition-colors"
                >
                  Sign In
                </Link>

                
                <Link
                  to="/find-support"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#246B52] hover:bg-[#1B533F] text-white text-sm font-medium shadow-sm transition-all hover:shadow-md cursor-pointer group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>

          
          <div className="flex sm:hidden items-center gap-2">
            <Link to="/find-support">
              <span className="px-3.5 py-1.5 rounded-full bg-[#246B52] text-white text-xs font-semibold">
                Start
              </span>
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

      
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-bb-line bg-[#FAF8F3] px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive(link.path)
                    ? 'text-[#246B52] bg-bb-brand-soft/70 font-semibold'
                    : 'text-bb-ink hover:bg-bb-surface-soft'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-bb-line mt-3 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-1 flex items-center justify-between text-xs text-bb-ink-muted">
                    <span>Signed in as <strong>{profile?.display_name}</strong></span>
                  </div>
                  <Link
                    to="/app"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-medium text-bb-ink hover:bg-bb-surface-soft"
                  >
                    <Bookmark className="w-4 h-4 text-bb-brand" />
                    <span>My Workspace</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-medium text-bb-danger hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 text-sm font-semibold text-bb-ink hover:text-bb-brand"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/find-support"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <div className="w-full text-center py-3 rounded-full bg-[#246B52] text-white font-medium text-sm">
                      Get Started →
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
