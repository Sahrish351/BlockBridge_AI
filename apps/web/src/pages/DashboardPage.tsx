import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  FileText, 
  ArrowRight, 
  Search
} from 'lucide-react';
import { ActionPlan, Resource, PlanStep } from '../types';
import { apiService } from '../services/apiService';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [currentPersona, setCurrentPersona] = useState<'marcus' | 'keisha'>('marcus');

  const loadDashboardData = async () => {
    try {
      const [allPlans, savedIds, allRes] = await Promise.all([
        apiService.getActionPlans(),
        apiService.getSavedResourceIds(),
        apiService.getResources(),
      ]);

      setPlans(allPlans);
      setSavedResources(allRes.filter((r: Resource) => savedIds.includes(r.id)));
    } catch {
      // Handle error
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUnsave = async (id: string) => {
    await apiService.toggleSaveResource(id);
    setSavedResources(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner & Demo Persona Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bb-line shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-bb-brand"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
              Workspace & Follow-Through Tracker
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-bb-ink">
            {currentPersona === 'marcus' ? 'Welcome back, Marcus' : 'Welcome back, Keisha'}
          </h1>
          <p className="text-xs sm:text-sm text-bb-ink-muted">
            {currentPersona === 'marcus'
              ? 'Vance Community Roasters & Café • West End Atlanta (30310)'
              : 'Resident & Community Member • Bankhead / English Ave (30314)'}
          </p>
        </div>

        {/* Action Button & Demo Persona Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-1 rounded-xl bg-bb-surface-soft border border-bb-line flex items-center text-xs">
            <button
              onClick={() => setCurrentPersona('marcus')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentPersona === 'marcus'
                  ? 'bg-white text-bb-ink font-semibold shadow-sm'
                  : 'text-bb-ink-muted hover:text-bb-ink'
              }`}
            >
              Marcus (Business)
            </button>
            <button
              onClick={() => setCurrentPersona('keisha')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentPersona === 'keisha'
                  ? 'bg-white text-bb-ink font-semibold shadow-sm'
                  : 'text-bb-ink-muted hover:text-bb-ink'
              }`}
            >
              Keisha (Resident)
            </button>
          </div>

          <Link to="/find-support">
            <Button variant="primary" size="md" leftIcon={<Search className="w-4 h-4" />}>
              Find New Support
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Active Action Plans & Saved Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Action Plans (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-bb-ink flex items-center gap-2">
              <FileText className="w-6 h-6 text-bb-brand" />
              <span>Active Action Plans ({plans.length})</span>
            </h2>
            <Link to="/find-support" className="text-xs font-semibold text-bb-brand hover:underline">
              Create New Plan →
            </Link>
          </div>

          {plans.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-bb-line text-center space-y-3">
              <p className="text-xs text-bb-ink-muted">You haven't generated an action plan yet.</p>
              <Link to="/find-support">
                <Button variant="primary" size="sm">Start Guided Discovery</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((p) => {
                const completedCount = p.tasks.filter((t: PlanStep) => t.status === 'Completed').length;
                const percent = Math.round((completedCount / (p.tasks.length || 1)) * 100);

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-6 border border-bb-line shadow-sm hover:shadow-card transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-bb-ink hover:text-bb-brand transition-colors">
                          <Link to={`/app/plans/${p.id}`}>{p.title}</Link>
                        </h3>
                        <p className="text-xs text-bb-ink-muted mt-0.5 line-clamp-1">
                          Goal: {p.goal}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-bb-brand">
                          {percent}% Complete
                        </span>
                        <Link to={`/app/plans/${p.id}`}>
                          <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                            Open Plan
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-bb-line h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-bb-brand h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    {/* Next upcoming task preview */}
                    {p.tasks.find((t: PlanStep) => t.status !== 'Completed') && (
                      <div className="pt-2 border-t border-bb-line/60 flex items-center justify-between text-xs text-bb-ink">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span className="text-bb-ink-muted">Next step:</span>
                          <span className="font-medium">
                            {p.tasks.find((t: PlanStep) => t.status !== 'Completed')?.title}
                          </span>
                        </div>
                        {p.tasks.find((t: PlanStep) => t.status !== 'Completed')?.due_date && (
                          <span className="text-bb-ink-subtle">
                            Due {p.tasks.find((t: PlanStep) => t.status !== 'Completed')?.due_date}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Saved Resources (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-bb-ink flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-bb-brand" />
              <span>Saved Resources ({savedResources.length})</span>
            </h2>
            <Link to="/resources" className="text-xs font-semibold text-bb-brand hover:underline">
              Catalogue →
            </Link>
          </div>

          {savedResources.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-bb-line text-center text-xs text-bb-ink-muted">
              No saved programs yet. Bookmark programs in the catalogue to save them here.
            </div>
          ) : (
            <div className="space-y-3">
              {savedResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-xl p-4 border border-bb-line shadow-sm space-y-2 hover:border-bb-brand transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-bb-brand">
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
                    <Link to={`/resources/${res.id}`} className="font-semibold text-bb-brand hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
