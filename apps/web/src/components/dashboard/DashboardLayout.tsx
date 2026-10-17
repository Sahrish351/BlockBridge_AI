import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Bookmark, 
  MessageSquare, 
  User, 
  Building2, 
  Settings, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck, 
  PlusCircle, 
  Layers, 
  AlertTriangle,
  History,
  ChevronDown,
  Check
} from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeRole,
  onRoleChange 
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/resources?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Persona metadata matching reference image
  const personas: Record<UserRole, {
    name: string;
    roleLabel: string;
    location: string;
    avatar: string;
    organization?: string;
  }> = {
    resident: {
      name: 'Keisha Jenkins',
      roleLabel: 'Resident',
      location: 'Bankhead, Atlanta',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    small_business: {
      name: 'Marcus Vance',
      roleLabel: 'Business Owner',
      location: 'West End, Atlanta',
      avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=200&q=80',
    },
    partner: {
      name: 'Westside Future Fund',
      roleLabel: 'Organization',
      location: 'English Ave & Vine City',
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80',
      organization: 'Westside Future Fund',
    },
    admin: {
      name: 'Admin',
      roleLabel: 'Civic Reviewer',
      location: 'City of Atlanta & Region',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
  };

  const currentPersona = personas[activeRole] || personas.resident;

  // Sidebar navigation links tailored to each role
  const getNavLinks = () => {
    switch (activeRole) {
      case 'resident':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/app', active: true },
          { label: 'Find Support', icon: Search, path: '/find-support' },
          { label: 'My Action Plans', icon: FileText, path: '/app/plans' },
          { label: 'Saved Resources', icon: Bookmark, path: '/resources?saved=true' },
          { label: 'Messages', icon: MessageSquare, path: '/app?tab=messages' },
          { label: 'Profile', icon: User, path: '/app?tab=profile' },
        ];
      case 'small_business':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/app', active: true },
          { label: 'Find Support', icon: Search, path: '/find-support?type=business' },
          { label: 'My Action Plans', icon: FileText, path: '/app/plans' },
          { label: 'Saved Resources', icon: Bookmark, path: '/resources?saved=true' },
          { label: 'Messages', icon: MessageSquare, path: '/app?tab=messages' },
          { label: 'Business Profile', icon: Building2, path: '/app?tab=business-profile' },
          { label: 'Settings', icon: Settings, path: '/app?tab=settings' },
        ];
      case 'partner':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/app', active: true },
          { label: 'Submit Resource', icon: PlusCircle, path: '/community-partners' },
          { label: 'My Submissions', icon: Layers, path: '/app?tab=submissions' },
          { label: 'Messages', icon: MessageSquare, path: '/app?tab=messages' },
          { label: 'Resources', icon: Bookmark, path: '/resources' },
          { label: 'Profile', icon: User, path: '/app?tab=profile' },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/app', active: true },
          { label: 'Review Queue', icon: ShieldCheck, path: '/admin', badge: '4' },
          { label: 'Resource Management', icon: Layers, path: '/resources' },
          { label: 'Partner Submissions', icon: PlusCircle, path: '/admin?tab=submissions' },
          { label: 'Error Reports', icon: AlertTriangle, path: '/admin?tab=reports' },
          { label: 'Audit Log', icon: History, path: '/admin?tab=audit' },
          { label: 'Settings', icon: Settings, path: '/app?tab=settings' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#202720] flex">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar: Dark Forest Green */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#143D2F] text-white flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo & Brand Header */}
          <div className="p-6 pb-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#246B52] border border-white/20 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 10.5L12 3l9 7.5" />
                  <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
                  <path d="M9 21v-7a3 3 0 0 1 6 0v7" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-white leading-tight">
                  BlockBridge <span className="text-[#86EFAC] font-sans text-[11px] font-bold">AI</span>
                </span>
                <span className="text-[10px] text-white/70 leading-tight">
                  Community Navigator & Action Planner
                </span>
              </div>
            </Link>

            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 flex-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isCurrent = item.active || (item.path !== '/app' && location.pathname === item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isCurrent
                      ? 'bg-white/15 text-white font-semibold shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-white/90" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#E98770] text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Sign Out */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E8E4DA] px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#202720] hover:bg-black/5"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input matching reference */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white border border-[#E8E4DA] text-[#202720] placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[#246B52] focus:border-transparent transition-all shadow-sm"
              />
            </form>
          </div>

          {/* Right Header Controls: Persona Switcher, Bell, Profile Chip */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Persona Switcher for Evaluation */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E8E4DA] text-xs font-semibold text-[#202720] hover:border-[#246B52] transition-colors shadow-sm"
                title="Switch Preview Role / Persona"
              >
                <span className="w-2 h-2 rounded-full bg-[#246B52]"></span>
                <span className="text-black/60">View:</span>
                <span className="font-bold text-[#143D2F]">{currentPersona.roleLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-black/40 ml-1" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setRoleDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8E4DA] py-2 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black/40">
                      Switch Active Dashboard View
                    </div>
                    {[
                      { role: 'resident' as UserRole, label: 'Resident (Keisha Jenkins)' },
                      { role: 'small_business' as UserRole, label: 'Small Business (Marcus Vance)' },
                      { role: 'partner' as UserRole, label: 'Community Partner (Westside)' },
                      { role: 'admin' as UserRole, label: 'Civic Reviewer (Admin)' },
                    ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => {
                          onRoleChange?.(item.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                          activeRole === item.role
                            ? 'bg-[#EBF3ED] text-[#143D2F] font-bold'
                            : 'text-[#202720] hover:bg-black/5'
                        }`}
                      >
                        <span>{item.label}</span>
                        {activeRole === item.role && <Check className="w-3.5 h-3.5 text-[#246B52]" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell */}
            <button 
              className="relative p-2 rounded-xl text-[#202720] hover:bg-black/5 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 text-black/60" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E98770]" />
            </button>

            {/* Profile Chip matching reference */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#E8E4DA]">
              <img
                src={currentPersona.avatar}
                alt={currentPersona.name}
                className="w-8 h-8 rounded-full object-cover border border-[#E8E4DA] shadow-sm flex-shrink-0"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#202720] leading-tight line-clamp-1">
                  {currentPersona.name}
                </span>
                <span className="text-[10px] text-black/50 leading-tight">
                  {currentPersona.roleLabel}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
