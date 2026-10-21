import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  ArrowRight, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight
} from 'lucide-react';
interface RoadmapStep {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  deadline?: string;
}
export const BusinessDashboardView: React.FC = () => {
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([
    {
      id: 'step-1',
      title: 'Get EIN (IRS)',
      status: 'Completed',
    },
    {
      id: 'step-2',
      title: 'File with GA Secretary of State',
      status: 'In Progress',
    },
    {
      id: 'step-3',
      title: 'Complete 6-Month P&L Review',
      status: 'Pending',
    },
    {
      id: 'step-4',
      title: 'Apply for Invest Atlanta Small Business Opportunity Fund',
      status: 'Pending',
      deadline: 'Rolling Allocation',
    },
    {
      id: 'step-5',
      title: 'Apply for RICE Business Growth Academy',
      status: 'Pending',
      deadline: 'Nov 15, 2026',
    },
  ]);
  const toggleStep = (id: string) => {
    setRoadmap(prev => prev.map(step => {
      if (step.id !== id) return step;
      if (step.status === 'Completed') return { ...step, status: 'In Progress' };
      if (step.status === 'In Progress') return { ...step, status: 'Completed' };
      return { ...step, status: 'In Progress' };
    }));
  };
  const completedCount = roadmap.filter(s => s.status === 'Completed').length;
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202720] tracking-tight">
          Welcome back, Marcus
        </h1>
        <p className="text-xs sm:text-sm text-black/60 mt-0.5">
          Here's your business support overview and upcoming opportunities.
        </p>
      </div>
      {/* Profile Banner Card - Compact, balanced height without empty vertical space */}
      <div className="bg-white rounded-2xl border border-[#E8E4DA] overflow-hidden shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between">
        <div className="p-5 sm:p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#143D2F] text-white flex items-center justify-center font-serif text-xl font-bold shadow-sm flex-shrink-0">
              V
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#202720] leading-tight">
                Vance Community Roasters & Café
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-black/60 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#246B52]" />
                <span>West End, Atlanta (30310)</span>
              </div>
            </div>
          </div>
          <div>
            <Link
              to="/app/business-profile"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743] transition-colors shadow-sm whitespace-nowrap"
            >
              <span>View Business Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        {/* Café/Barista Photo - Compact horizontal balance */}
        <div className="w-full md:w-64 h-36 md:h-28 relative overflow-hidden bg-stone-100 flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
            alt="Marcus Vance at Vance Community Roasters & Café"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* 4 KPI Cards in a Row - Compact, uniform height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Capital Readiness */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-[#E8E4DA] shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-xs font-medium text-black/60">Capital Readiness</span>
          <div className="font-serif text-2xl font-bold text-[#202720]">
            $10,000 – $40,000
          </div>
          <span className="text-[10px] text-black/50">Target grant range (Illustrative Demo)</span>
        </div>
        {/* Card 2: Prerequisites */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-[#E8E4DA] shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-xs font-medium text-black/60">Prerequisites</span>
          <div className="font-serif text-2xl font-bold text-[#202720]">
            {completedCount} of 3 completed
          </div>
          <div className="w-full h-2 rounded-full bg-[#E8E4DA] overflow-hidden mt-1">
            <div 
              className="h-full bg-[#246B52] rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, (completedCount / 3) * 100)}%` }}
            />
          </div>
        </div>
        {/* Card 3: Next Deadline */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-[#E8E4DA] shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-black/60">Next Cohort Target</span>
            <Calendar className="w-4 h-4 text-[#E98770]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#202720]">
            Nov 15, 2026
          </div>
          <span className="text-[10px] text-black/50" title="RICE admits businesses through quarterly cohort cycles">
            RICE Fall Cohort (Quarterly Rolling)
          </span>
        </div>
        {/* Card 4: Find Business Support (Green Card with +) */}
        <Link
          to="/app/find-support?type=business"
          className="bg-[#143D2F] text-white rounded-2xl p-4 sm:p-4.5 shadow-sm hover:bg-[#1C503E] transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-start justify-between">
            <span className="font-serif text-base sm:text-lg font-bold text-white group-hover:translate-x-0.5 transition-transform">
              Find Business Support
            </span>
            <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11px] text-white/80 leading-snug">
            Discover grants, training & business resources
          </p>
        </Link>
      </div>
      {/* Lower Section: Your Business Roadmap (Left) & Recommended Opportunities (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Your Business Roadmap */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#202720]">
              Your Business Roadmap
            </h3>
            <Link to="/app/plans" className="text-xs font-semibold text-[#246B52] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm divide-y divide-[#E8E4DA]/60">
            {roadmap.map((step) => {
              const isCompleted = step.status === 'Completed';
              const isInProgress = step.status === 'In Progress';
              return (
                <div 
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F3]/60 px-2 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 fill-[#246B52] text-white" />
                      </div>
                    ) : isInProgress ? (
                      <div className="w-6 h-6 rounded-full border-2 border-[#246B52] flex items-center justify-center flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#246B52]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-black/30 flex items-center justify-center flex-shrink-0" />
                    )}
                    <div>
                      <h4 className={`text-sm font-bold ${isCompleted ? 'text-[#202720]' : 'text-[#202720]'}`}>
                        {step.title}
                      </h4>
                      <span className={`text-[11px] font-semibold ${
                        isCompleted ? 'text-[#246B52]' : isInProgress ? 'text-[#D97706]' : 'text-black/40'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {step.deadline && (
                      <span className="text-[11px] text-black/40 hidden sm:inline">
                        {step.deadline}
                      </span>
                    )}
                    {isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-[#246B52]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Right Column: Recommended Opportunities */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#202720]">
              Recommended Opportunities
            </h3>
            <Link to="/resources?category=Small+Business+Support" className="text-xs font-semibold text-[#246B52] hover:underline">
              View All
            </Link>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-[#E8E4DA] shadow-sm space-y-3">
            {[
              {
                id: 'res-002',
                title: 'Invest Atlanta Opportunity Fund',
                subtitle: 'Low-cost commercial loans & micro-grants',
                verified: true,
              },
              {
                id: 'res-001',
                title: 'RICE Business Growth Academy',
                subtitle: 'Incubator, accelerator & capital readiness',
                verified: true,
              },
              {
                id: 'res-008',
                title: 'SCORE Atlanta & SBA Advisory',
                subtitle: 'Free 1-on-1 counseling & mentor network',
                verified: true,
              },
            ].map((opp) => (
              <Link
                key={opp.id}
                to={`/resources/${opp.id}`}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#FAF8F3] transition-colors border border-transparent hover:border-[#E8E4DA] group"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#202720] group-hover:text-[#246B52] transition-colors">
                    {opp.title}
                  </h4>
                  <p className="text-[11px] text-black/50">{opp.subtitle}</p>
                  {opp.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#246B52] bg-[#EBF3ED] px-2 py-0.5 rounded-full mt-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Source</span>
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-black/30 group-hover:text-[#246B52] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
