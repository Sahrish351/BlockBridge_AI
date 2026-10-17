import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  ArrowRight, 
  Users, 
  Bookmark, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShoppingBag, 
  HeartHandshake, 
  Home, 
  ChevronRight
} from 'lucide-react';
import { ActionPlan, Resource } from '../../types';

interface ResidentDashboardViewProps {
  plans: ActionPlan[];
  savedResources: Resource[];
  onContinuePlan?: (planId: string) => void;
}

export const ResidentDashboardView: React.FC<ResidentDashboardViewProps> = ({
  plans,
  savedResources,
  onContinuePlan,
}) => {
  const activePlanCount = plans.length > 0 ? plans.length : 2;
  const savedCount = savedResources.length > 0 ? savedResources.length : 5;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#202720] tracking-tight">
            Good morning, Keisha
          </h1>
          <p className="text-sm text-black/60 mt-1">
            Here's your personalized support overview and next steps.
          </p>
        </div>

        {/* Location Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF3ED] border border-[#C5DEC8] text-[#143D2F] text-xs font-semibold self-start sm:self-center">
          <MapPin className="w-3.5 h-3.5 text-[#246B52]" />
          <span>Bankhead, Atlanta</span>
        </div>
      </div>

      {/* Progress Hero Banner & Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hero: Split Progress Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8E4DA] overflow-hidden shadow-sm flex flex-col md:flex-row">
          <div className="md:w-5/12 h-56 md:h-auto relative overflow-hidden bg-stone-100 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
              alt="Keisha Jenkins smiling in community"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-[#F4F8F5]">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#246B52] bg-white px-2.5 py-1 rounded-full border border-[#DCEBE1] inline-block">
                Action Plan Active
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202720]">
                You're making progress!
              </h2>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                Keep going — you have active plans and new resources available to support your family.
              </p>
            </div>

            <div className="pt-6">
              <Link
                to="/find-support"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#143D2F] text-white text-xs sm:text-sm font-semibold hover:bg-[#1E5743] transition-colors shadow-sm"
              >
                <span>Find Support</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Stats: Your Quick Stats */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm flex flex-col justify-between space-y-4">
          <h3 className="font-bold text-sm text-[#202720] tracking-tight">
            Your Quick Stats
          </h3>

          <div className="space-y-3.5 flex-1 flex flex-col justify-around">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA]/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-[#202720]">Active Action Plans</span>
              </div>
              <span className="font-serif text-xl font-bold text-[#202720]">{activePlanCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA]/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-[#202720]">Saved Resources</span>
              </div>
              <span className="font-serif text-xl font-bold text-[#202720]">{savedCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA]/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FDEEE9] text-[#E98770] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-[#202720]">Upcoming Deadlines</span>
              </div>
              <span className="font-serif text-xl font-bold text-[#202720]">1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Your Next Steps (Left) & Recommended for You (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Your Next Steps */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#202720]">
              Your Next Steps
            </h3>
            <Link to="/app/plans" className="text-xs font-semibold text-[#246B52] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-bold text-[#202720]">
                    Complete LIHEAP Application
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FDEEE9] text-[#D85A3F] border border-[#F8CFC3]">
                    High Priority
                  </span>
                </div>
                <p className="text-xs text-black/60 mt-1">
                  Energy assistance for winter heating and cooling bill stabilization.
                </p>
              </div>

              <Link
                to="/app/plans"
                onClick={() => plans[0] && onContinuePlan?.(plans[0].id)}
                className="self-start px-4 py-2 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743] transition-colors whitespace-nowrap"
              >
                Continue Plan
              </Link>
            </div>

            {/* Progress Bar & Steps Status */}
            <div className="space-y-2 pt-2 border-t border-[#E8E4DA]/60">
              <div className="flex items-center justify-between text-xs font-medium text-black/60">
                <span>2 of 4 steps completed</span>
                <span className="font-bold text-[#246B52]">50%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E8E4DA] overflow-hidden">
                <div className="h-full bg-[#246B52] rounded-full transition-all duration-500 w-1/2" />
              </div>
            </div>

            {/* Step Checkpoints preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-black/70 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#246B52] flex-shrink-0" />
                <span>Proof of gross income verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#246B52] flex-shrink-0" />
                <span>Recent Georgia Power statement ready</span>
              </div>
              <div className="flex items-center gap-2 text-black/50">
                <Clock className="w-4 h-4 text-[#E98770] flex-shrink-0" />
                <span>Submit Fulton County EOA intake</span>
              </div>
              <div className="flex items-center gap-2 text-black/50">
                <Clock className="w-4 h-4 text-black/30 flex-shrink-0" />
                <span>Track award confirmation notice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommended for You */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#202720]">
              Recommended for You
            </h3>
            <Link to="/resources" className="text-xs font-semibold text-[#246B52] hover:underline">
              View All
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E8E4DA] shadow-sm space-y-3">
            {[
              {
                id: 'res-001',
                name: 'LIHEAP – Heating & Cooling Assistance',
                provider: 'Georgia Department of Human Services',
                icon: Zap,
                iconBg: 'bg-[#EBF3ED] text-[#246B52]',
                badge: 'Verified',
              },
              {
                id: 'res-002',
                name: 'SNAP (Food Assistance)',
                provider: 'Georgia Division of Family & Children Services',
                icon: ShoppingBag,
                iconBg: 'bg-[#EBF3ED] text-[#246B52]',
                badge: 'Verified',
              },
              {
                id: 'res-003',
                name: 'Emergency Food Access',
                provider: 'Atlanta Community Food Bank',
                icon: HeartHandshake,
                iconBg: 'bg-[#FDEEE9] text-[#E98770]',
                badge: 'Verified',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={`/resources/${item.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FAF8F3] transition-colors border border-transparent hover:border-[#E8E4DA] group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#202720] group-hover:text-[#246B52] transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-black/50 line-clamp-1">
                        {item.provider}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF3ED] text-[#246B52]">
                      {item.badge}
                    </span>
                    <ChevronRight className="w-4 h-4 text-black/30 group-hover:text-[#246B52] transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Saved Resources (Left) & Recent Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Saved Resources Mini-Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#202720]">
              Saved Resources ({savedCount})
            </h3>
            <Link to="/resources?saved=true" className="text-xs font-semibold text-[#246B52] hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'res-001',
                title: 'LIHEAP Assistance',
                org: 'GADHS',
                icon: Zap,
              },
              {
                id: 'res-003',
                title: 'Food Pantries',
                org: 'ACFB',
                icon: ShoppingBag,
              },
              {
                id: 'res-004',
                title: 'Rental Assistance',
                org: 'Invest Atlanta',
                icon: Home,
              },
            ].map((res) => {
              const Icon = res.icon;
              return (
                <Link
                  key={res.id}
                  to={`/resources/${res.id}`}
                  className="bg-white rounded-2xl p-4 border border-[#E8E4DA] hover:border-[#246B52] hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#202720] line-clamp-1">{res.title}</h4>
                    <p className="text-[11px] text-black/50">{res.org}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-right">
            <Link to="/resources?saved=true" className="text-xs font-semibold text-[#246B52] hover:underline inline-flex items-center gap-1">
              <span>More Saved</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#202720]">
              Recent Activity
            </h3>
            <span className="text-xs text-black/40">View All</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E8E4DA] shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202720]">You saved a new resource</span>
                  <span className="text-[10px] text-black/40">2 hours ago</span>
                </div>
                <p className="text-black/60 text-[11px]">Atlanta Community Food Bank</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202720]">Action plan updated</span>
                  <span className="text-[10px] text-black/40">4 hours ago</span>
                </div>
                <p className="text-black/60 text-[11px]">Utility Assistance Plan</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202720]">You submitted feedback</span>
                  <span className="text-[10px] text-black/40">1 day ago</span>
                </div>
                <p className="text-black/60 text-[11px]">SNAP application process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
