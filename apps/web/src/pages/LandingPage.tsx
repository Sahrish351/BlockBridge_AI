import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Compass, 
  Briefcase, 
  Users, 
  FileCheck, 
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  // Interactive mini-checklist on hero preview
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({
    't1': true,
    't2': false,
    't3': false
  });

  const toggleTask = (id: string) => {
    setCheckedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedTasks).filter(Boolean).length;

  return (
    <div className="space-y-24 md:space-y-32">
      {/* SECTION B: SPLIT EDITORIAL HERO */}
      <section className="relative pt-6 sm:pt-12 lg:pt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bb-brand-soft text-bb-brand text-xs font-bold tracking-wider uppercase border border-bb-brand-border">
                <span className="w-2 h-2 rounded-full bg-bb-brand animate-pulse"></span>
                <span>Community Support, Made Actionable</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-bb-ink leading-[1.12] tracking-tight">
                Find the support. <br />
                <span className="text-bb-brand italic font-normal">Take the next step.</span>
              </h1>

              <p className="text-base sm:text-lg text-bb-ink-muted leading-relaxed max-w-2xl">
                BlockBridge AI helps residents and neighborhood small businesses navigate fragmented grants, utility assistance, and community programs. We turn verified public records into an actionable, prioritized roadmap—with zero invented eligibility.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link to="/find-support">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Find Support Now
                  </Button>
                </Link>
                <Link to="/find-support?scenario=scenario-small-business">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" leftIcon={<Sparkles className="w-4 h-4 text-bb-coral" />}>
                    Explore Live Demo
                  </Button>
                </Link>
              </div>

              {/* Trust Reassurance Line */}
              <div className="pt-2 flex items-center gap-2 text-xs text-bb-ink-muted">
                <ShieldCheck className="w-4 h-4 text-bb-brand flex-shrink-0" />
                <span>
                  Source-backed records • Transparent eligibility unknowns • Zero guesswork
                </span>
              </div>
            </div>

            {/* Right Column: Custom Visual & Interactive Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background warm frame */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-bb-coral-soft to-bb-brand-soft/40 blur-lg opacity-70 transform -rotate-1"></div>
                
                {/* Preview Box */}
                <div className="relative bg-white rounded-3xl border border-bb-line p-6 shadow-elevated">
                  {/* Sample Badge Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-bb-line">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-bb-brand"></span>
                      <span className="text-xs font-bold text-bb-ink uppercase tracking-wider">
                        Sample Action Plan
                      </span>
                    </div>
                    <Badge type="demo" size="sm" />
                  </div>

                  {/* Resource Card Mock */}
                  <div className="p-4 rounded-2xl bg-bb-bg border border-bb-line mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-bb-brand uppercase tracking-wider">
                        Invest Atlanta
                      </span>
                      <Badge type="verification" status="Verified" size="sm" />
                    </div>
                    <h4 className="font-serif font-bold text-base text-bb-ink leading-tight">
                      Small Business Opportunity Fund
                    </h4>
                    <p className="text-xs text-bb-ink-muted line-clamp-2">
                      Commercial micro-grants and low-interest gap financing for small businesses in City of Atlanta limits.
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-bb-brand font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-bb-brand" />
                      <span>Why it fits: Active retail business in Atlanta Opportunity Zone</span>
                    </div>
                  </div>

                  {/* Connected Checklist Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-bb-ink">Your Step-by-Step Progress</span>
                      <span className="font-bold text-bb-brand">{completedCount} of 3 Done</span>
                    </div>
                    <div className="w-full bg-bb-line h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-bb-brand h-full rounded-full transition-all duration-300"
                        style={{ width: `${(completedCount / 3) * 100}%` }}
                      ></div>
                    </div>

                    {/* Interactive Clickable Tasks */}
                    <div className="space-y-2 pt-1">
                      <div 
                        onClick={() => toggleTask('t1')}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          checkedTasks['t1'] 
                            ? 'bg-bb-brand-soft/40 border-bb-brand-border text-bb-brand-hover' 
                            : 'bg-white border-bb-line text-bb-ink hover:bg-bb-surface-soft'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            checkedTasks['t1'] ? 'bg-bb-brand border-bb-brand text-white' : 'border-bb-line-strong'
                          }`}>
                            {checkedTasks['t1'] && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className={checkedTasks['t1'] ? 'line-through text-bb-ink-muted' : 'font-medium'}>
                            Verify City of Atlanta Business License
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-bb-ink-subtle">Step 1</span>
                      </div>

                      <div 
                        onClick={() => toggleTask('t2')}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          checkedTasks['t2'] 
                            ? 'bg-bb-brand-soft/40 border-bb-brand-border text-bb-brand-hover' 
                            : 'bg-white border-bb-line text-bb-ink hover:bg-bb-surface-soft'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            checkedTasks['t2'] ? 'bg-bb-brand border-bb-brand text-white' : 'border-bb-line-strong'
                          }`}>
                            {checkedTasks['t2'] && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className={checkedTasks['t2'] ? 'line-through text-bb-ink-muted' : 'font-medium'}>
                            Download 3 Months Bank Statements
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-bb-ink-subtle">Step 2</span>
                      </div>

                      <div 
                        onClick={() => toggleTask('t3')}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          checkedTasks['t3'] 
                            ? 'bg-bb-brand-soft/40 border-bb-brand-border text-bb-brand-hover' 
                            : 'bg-white border-bb-line text-bb-ink hover:bg-bb-surface-soft'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            checkedTasks['t3'] ? 'bg-bb-brand border-bb-brand text-white' : 'border-bb-line-strong'
                          }`}>
                            {checkedTasks['t3'] && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className={checkedTasks['t3'] ? 'line-through text-bb-ink-muted' : 'font-medium'}>
                            Submit Loan Intake on Official Portal
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-bb-ink-subtle">Step 3</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-center text-bb-ink-subtle pt-3">
                    Click items to toggle completion • Real action plans persist in your workspace
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION C: TRUST STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-white border border-bb-line shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-bb-brand-soft text-bb-brand flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-bb-ink mb-1">
                Official Sources Only
              </h4>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                Every program links directly to the official government or nonprofit portal. We never scrape or invent benefits.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-bb-ink mb-1">
                Uncertainty Made Explicit
              </h4>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                If eligibility criteria are unconfirmed or need documentation, we state it clearly. The provider always makes the final determination.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-bb-coral-soft text-bb-coral flex items-center justify-center flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-bb-ink mb-1">
                Turn Need into Next Steps
              </h4>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                Resource discovery doesn't end with a link. We convert requirements into a prioritized checklist you can track and complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: TWO PATHWAYS (RESIDENTS & SMALL BUSINESSES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
            Choose Your Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
            Two Pathways, One Clear Direction
          </h2>
          <p className="text-sm text-bb-ink-muted">
            Whether you are a neighbor seeking household stability or an entrepreneur building a local business, we meet you where you are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pathway 1: Residents */}
          <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-bb-brand-soft text-bb-brand flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-bb-ink group-hover:text-bb-brand transition-colors">
                I Need Support
              </h3>
              <p className="text-sm text-bb-ink-muted leading-relaxed">
                Connect with verified local programs for heating & electric utility bill grants (LIHEAP), emergency food pantries, affordable rental support, and career certification programs.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Utilities & Bills</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Food Pantries</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Rental Vouchers</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Job Training</span>
              </div>
            </div>

            <div className="pt-8">
              <Link to="/find-support?type=resident">
                <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Resident Navigator
                </Button>
              </Link>
            </div>
          </div>

          {/* Pathway 2: Small Business Owners */}
          <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-bb-coral-soft text-bb-coral flex items-center justify-center">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-bb-ink group-hover:text-bb-coral transition-colors">
                I'm Growing a Small Business
              </h3>
              <p className="text-sm text-bb-ink-muted leading-relaxed">
                Discover non-predatory CDFI capital, municipal commercial grants (Invest Atlanta), supplier diversity matchmaking (Morehouse MIEC), and free 1-on-1 executive coaching.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Micro-grants</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">CDFI Lending</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Free Mentorship</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Contract Readiness</span>
              </div>
            </div>

            <div className="pt-8">
              <Link to="/find-support?type=small_business">
                <Button variant="secondary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Small Business Navigator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: HOW IT WORKS (CONNECTED 4-STAGE PROCESS) */}
      <section className="bg-bb-surface-soft py-16 sm:py-24 border-y border-bb-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
              The Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
              How BlockBridge Moves from Need to Outcome
            </h2>
            <p className="text-sm text-bb-ink-muted">
              We eliminate the maze of dead ends and confusing government jargon with four intentional steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-bb-line shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-bb-brand text-white font-serif font-bold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-bb-ink mb-2">
                Tell Us What You Need
              </h3>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                Describe your situation in everyday words or pick a category. No sensitive data, SSNs, or immigration documents required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-bb-line shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-bb-brand text-white font-serif font-bold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-bb-ink mb-2">
                Search Verified Options
              </h3>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                Our engine matches your request strictly against verified public catalogues. Zero invented programs or dead links.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-bb-line shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-amber-700 text-white font-serif font-bold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-bb-ink mb-2">
                Identify What to Confirm
              </h3>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                We separate what we know from what requires provider confirmation (such as income limits or local zoning).
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-bb-line shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-bb-coral text-white font-serif font-bold text-lg flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="font-serif text-lg font-bold text-bb-ink mb-2">
                Build & Track Your Plan
              </h3>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                Convert matches into a clear checklist with document requirements, due dates, and print/export capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: COMMUNITY & CIVIC EMPOWERMENT EDITORIAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
              Track 3: Community Development Focus
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink leading-tight">
              Built on Dignity, Respect & Economic Mobility
            </h2>
            <p className="text-sm sm:text-base text-bb-ink-muted leading-relaxed">
              Black-owned small businesses and under-resourced residents frequently experience severe information friction. Support exists, but it is dispersed across dozens of county agencies, obscure nonprofit portals, and PDF attachments.
            </p>
            <p className="text-sm sm:text-base text-bb-ink-muted leading-relaxed">
              BlockBridge AI treats community members as capable decision-makers. We do not use deficit framing or paternalistic labels. Instead, we give you clean, high-contrast, source-cited roadmaps to help you access what you are entitled to.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-bb-brand flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-bb-ink">
                  <strong>Privacy First:</strong> No disclosure of racial identity or financial credentials required to access the platform.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-bb-brand flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-bb-ink">
                  <strong>Nonprofit & Civic Visibility:</strong> Uplifts trusted grassroots organizations like the Russell Center, Urban League, and ACFB.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card space-y-6">
              <h3 className="font-serif text-xl font-bold text-bb-ink pb-2 border-b border-bb-line">
                Resource Freshness & Integrity Model
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-bb-surface-soft border border-bb-line flex items-start gap-3">
                  <Badge type="verification" status="Verified" size="sm" className="mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-bb-ink">Direct Provenance</p>
                    <p className="text-bb-ink-muted">Checked against official government or certified nonprofit portals within the last 90 days.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-3">
                  <Badge type="verification" status="Needs Re-verification" size="sm" className="mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-amber-950">Active Re-Verification Triggers</p>
                    <p className="text-amber-900/80">When deadlines pass or grant cycles expire, records are automatically marked for reviewer audit.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-bb-brand-soft/40 border border-bb-brand-border/60 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-bb-brand flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-bb-brand-hover">Human Moderation Seam</p>
                    <p className="text-bb-ink">Every community correction is submitted to an administrative audit queue before public catalogue updates.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link to="/resource-standards" className="text-xs font-semibold text-bb-brand hover:underline">
                  Read our complete Resource Standards & Verification Policy →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H: COMMUNITY PARTNER PORTAL CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-bb-brand text-white rounded-3xl p-8 sm:p-12 shadow-elevated relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-bb-brand-soft">
              For Community Organizations & Providers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Help Keep Your Neighborhood's Resources Accurate
            </h2>
            <p className="text-sm sm:text-base text-bb-brand-soft leading-relaxed">
              Are you a local nonprofit, municipal agency, or CDFI lender? Submit program updates, correct deadlines, or suggest a new service. All partner submissions enter our reviewer workflow to protect community trust.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link to="/community-partners">
                <Button variant="secondary" size="md">
                  Community Partner Portal
                </Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline" size="md" className="text-white border-white hover:bg-white/10">
                  Browse Public Catalogue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION J: FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-bb-ink">
          Start with one next step today.
        </h2>
        <p className="text-base text-bb-ink-muted max-w-xl mx-auto">
          Whether you need utility assistance, a small business grant, or career training, BlockBridge AI helps you take clear, verified action.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/find-support">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Find Support in Atlanta
            </Button>
          </Link>
          <Link to="/resources">
            <Button variant="secondary" size="lg">
              Explore 12 Verified Programs
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
