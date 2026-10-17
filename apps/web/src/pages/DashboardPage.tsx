import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Bookmark, 
  FileText, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Users, 
  Calendar, 
  FileCheck, 
  TrendingUp,
  Printer
} from 'lucide-react';
import { ActionPlan, Resource, PlanStep, PlanStepStatus } from '../types';
import { apiService } from '../services/apiService';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { profile, role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab: 'resident' or 'business'
  const activeTab = searchParams.get('tab') === 'business' || (role === 'small_business' && searchParams.get('tab') !== 'resident')
    ? 'business' 
    : 'resident';

  const setActiveTab = (tab: 'resident' | 'business') => {
    setSearchParams({ tab });
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [allPlans, savedIds, allRes] = await Promise.all([
        apiService.getActionPlans(),
        apiService.getSavedResourceIds(),
        apiService.getResources(),
      ]);

      setPlans(allPlans);
      setSavedResources(allRes.filter((r: Resource) => savedIds.includes(r.id)));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUnsave = async (id: string) => {
    await apiService.toggleSaveResource(id);
    setSavedResources(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleStep = async (planId: string, stepId: string, currentStatus: PlanStepStatus) => {
    const newStatus: PlanStepStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    await apiService.updatePlanStepStatus(planId, stepId, newStatus);
    
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      return {
        ...p,
        tasks: p.tasks.map(t => t.id === stepId ? { ...t, status: newStatus } : t)
      };
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner & Profile Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bb-line shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-bb-brand animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
              Active Community Workspace
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-bb-ink">
            {profile?.display_name ? `Welcome back, ${profile.display_name}` : (activeTab === 'business' ? 'Welcome back, Marcus' : 'Welcome back, Keisha')}
          </h1>
          <p className="text-xs sm:text-sm text-bb-ink-muted">
            {activeTab === 'business'
              ? 'Vance Community Roasters & Café • West End Atlanta (30310) • Commercial Kitchen & Retail'
              : 'Resident & Community Member • Bankhead / English Ave (30314) • Single-Earner Household'}
          </p>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-1 rounded-2xl bg-bb-surface-soft border border-bb-line flex items-center text-xs">
            <button
              onClick={() => setActiveTab('resident')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'resident'
                  ? 'bg-white text-bb-brand shadow-sm'
                  : 'text-bb-ink-muted hover:text-bb-ink'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Resident View (Keisha)</span>
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'business'
                  ? 'bg-white text-bb-brand shadow-sm'
                  : 'text-bb-ink-muted hover:text-bb-ink'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Small Business (Marcus)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-white border border-bb-line hover:bg-bb-surface-soft text-bb-ink-muted hover:text-bb-ink transition-colors"
              title="Print / Save PDF of Workspace"
              aria-label="Print workspace"
            >
              <Printer className="w-4 h-4" />
            </button>

            <Link to="/find-support">
              <Button variant="primary" size="md" leftIcon={<Search className="w-4 h-4" />}>
                Find New Support
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Role-Specific Live Status Strip */}
      {activeTab === 'business' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-bb-line shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-bb-ink-muted">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Capital Opportunity</span>
              <TrendingUp className="w-4 h-4 text-bb-brand" />
            </div>
            <div className="font-serif text-2xl font-bold text-bb-ink">$10,000 – $40,000</div>
            <p className="text-xs text-bb-ink-muted">
              Target grant & microloan range through <strong>Invest Atlanta Resurgence</strong> & <strong>ACE Women/Minority Fund</strong>.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-bb-line shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-bb-ink-muted">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Prerequisites Verified</span>
              <FileCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-bb-ink">3 of 4 Ready</div>
            <p className="text-xs text-bb-ink-muted">
              EIN, GA Secretary of State registration, and 2025 tax return on file. <em>Pending: Updated 6-month P&L.</em>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-bb-line shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-bb-ink-muted">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Next Cohort Deadline</span>
              <Calendar className="w-4 h-4 text-bb-coral" />
            </div>
            <div className="font-serif text-2xl font-bold text-bb-ink">Nov 15, 2026</div>
            <p className="text-xs text-bb-ink-muted">
              Russell Center for Innovation & Entrepreneurship (RCIE) Fall Accelerator application closes in 28 days.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-bb-line shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-bb-ink-muted">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Energy & Utility Relief</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-bb-ink">LIHEAP Window Open</div>
            <p className="text-xs text-bb-ink-muted">
              Fulton County Economic Opportunity Authority accepting cooling/heating bill assistance applications now.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-bb-line shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-bb-ink-muted">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Emergency Food Access</span>
              <CheckCircle2 className="w-4 h-4 text-bb-brand" />
            </div>
            <div className="font-serif text-2xl font-bold text-bb-ink">This Thursday, 10 AM</div>
            <p className="text-xs text-bb-ink-muted">
              Atlanta Community Food Bank partner mobile distribution at Antioch Baptist Church North (1.2 miles away).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-bb-line shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-bb-ink-muted">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Document Preparation</span>
              <FileCheck className="w-4 h-4 text-bb-brand" />
            </div>
            <div className="font-serif text-2xl font-bold text-bb-ink">2 of 3 Assembled</div>
            <p className="text-xs text-bb-ink-muted">
              GA Driver's License & Georgia Power past bill ready. <em>Pending: 30-day proof of gross household income.</em>
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Active Action Plans (8 cols) & Saved Programs (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Action Plans */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-bb-ink flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-bb-brand" />
              <span>Active Action Plans ({plans.length})</span>
            </h2>
            <Link to="/find-support" className="text-xs font-semibold text-bb-brand hover:underline">
              Create New Plan →
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 border border-bb-line text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-bb-brand border-t-transparent animate-spin mx-auto"></div>
              <p className="text-xs text-bb-ink-muted">Loading your action plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-bb-line text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-bb-surface-soft text-bb-brand flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-bb-ink">No action plans created yet</h3>
                <p className="text-xs text-bb-ink-muted max-w-sm mx-auto">
                  Take the guided intake to generate a personalized step-by-step follow-through roadmap.
                </p>
              </div>
              <Link to="/find-support">
                <Button variant="primary" size="sm">Start Guided Discovery</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {plans.map((p) => {
                const completedCount = p.tasks.filter((t: PlanStep) => t.status === 'Completed').length;
                const percent = Math.round((completedCount / (p.tasks.length || 1)) * 100);

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-bb-line shadow-card hover:border-bb-brand/40 transition-all space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-bb-brand bg-bb-brand-soft px-2 py-0.5 rounded-md">
                            Follow-Through Plan
                          </span>
                          <span className="text-xs text-bb-ink-subtle">
                            Updated {new Date(p.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-bb-ink hover:text-bb-brand transition-colors">
                          <Link to={`/app/plans/${p.id}`}>{p.title}</Link>
                        </h3>
                        <p className="text-xs text-bb-ink-muted mt-1 leading-relaxed">
                          <strong>Goal:</strong> {p.goal}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs font-bold text-bb-brand bg-bb-brand-soft/60 px-2.5 py-1 rounded-lg">
                          {percent}% Complete
                        </span>
                        <Link to={`/app/plans/${p.id}`}>
                          <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                            Detailed View
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-bb-ink-muted">
                        <span>{completedCount} of {p.tasks.length} steps marked done</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-bb-line h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-bb-brand h-full rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Interactive Checklist Preview */}
                    <div className="pt-3 border-t border-bb-line/60 space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-bb-ink">
                        Application Checklist & Tasks:
                      </h4>
                      <div className="space-y-2">
                        {p.tasks.map((task) => {
                          const isDone = task.status === 'Completed';
                          return (
                            <div
                              key={task.id}
                              className={`p-3 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
                                isDone
                                  ? 'bg-bb-surface-soft border-bb-line/70 opacity-75'
                                  : 'bg-white border-bb-line hover:border-bb-brand/40'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStep(p.id, task.id, task.status)}
                                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                                    isDone
                                      ? 'bg-bb-brand border-bb-brand text-white'
                                      : 'border-bb-line hover:border-bb-brand text-transparent'
                                  }`}
                                  aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                                </button>
                                <div>
                                  <p className={`text-xs font-semibold ${isDone ? 'line-through text-bb-ink-muted' : 'text-bb-ink'}`}>
                                    {task.title}
                                  </p>
                                  <p className="text-[11px] text-bb-ink-muted mt-0.5">
                                    {task.description}
                                  </p>
                                </div>
                              </div>

                              {task.due_date && (
                                <span className="text-[11px] text-bb-ink-subtle whitespace-nowrap flex-shrink-0 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Due {task.due_date}</span>
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Saved Programs & Direct Contact Links */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-bb-ink flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-bb-brand" />
              <span>Saved Programs ({savedResources.length})</span>
            </h2>
            <Link to="/resources" className="text-xs font-semibold text-bb-brand hover:underline">
              Catalogue →
            </Link>
          </div>

          {savedResources.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-bb-line text-center text-xs text-bb-ink-muted space-y-2">
              <Bookmark className="w-6 h-6 mx-auto text-bb-ink-subtle" />
              <p>No saved programs yet. Bookmark verified programs in the catalogue to access them here.</p>
              <Link to="/resources">
                <Button variant="ghost" size="sm">Browse Directory</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {savedResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl p-5 border border-bb-line shadow-sm space-y-3 hover:border-bb-brand transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-bb-brand bg-bb-brand-soft px-2 py-0.5 rounded">
                      {res.provider_name}
                    </span>
                    <button
                      onClick={() => handleUnsave(res.id)}
                      className="text-bb-ink-subtle hover:text-bb-danger text-[11px] underline cursor-pointer"
                      title="Remove from saved"
                    >
                      Remove
                    </button>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-bb-ink leading-snug">
                    <Link to={`/resources/${res.id}`} className="hover:underline">
                      {res.name}
                    </Link>
                  </h4>

                  <p className="text-[11px] text-bb-ink-muted line-clamp-2">
                    {res.summary}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] border-t border-bb-line">
                    <Badge type="verification" status={res.verification_status} size="sm" />
                    <Link to={`/resources/${res.id}`} className="font-semibold text-bb-brand hover:underline flex items-center gap-1">
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Support Links Seam */}
          <div className="bg-bb-brand text-white rounded-3xl p-6 space-y-3">
            <h4 className="font-serif text-lg font-bold">Need Personal Assistance?</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              If an official site is down or requirements are unclear, you can submit an update report or contact Atlanta 2-1-1 directly.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <a
                href="tel:211"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white text-bb-brand font-bold text-xs hover:bg-bb-surface-soft transition-colors"
              >
                Call United Way 2-1-1
              </a>
              <Link
                to="/community-partners"
                className="w-full text-center text-xs text-white/80 hover:text-white underline pt-1"
              >
                Are you a service provider? Submit a resource →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
