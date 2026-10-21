import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  FileCheck, 
  ShieldCheck, 
  ExternalLink,
  MapPin,
  Calendar,
  Sprout,
  Search,
  FileText,
  Target,
  Users,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { VERIFIED_RESOURCES } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [assistQuery, setAssistQuery] = useState('');

  const handleAIAssistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = assistQuery.trim() || 'Small business support and grants in Atlanta';
    navigate(`/find-support?description=${encodeURIComponent(query)}`);
  };

  const featuredResources = VERIFIED_RESOURCES.slice(0, 3);

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* SECTION 1: EDITORIAL HERO MATCHING EXACT REFERENCE IMAGE */}
      <section className="relative pt-6 sm:pt-10 lg:pt-12 pb-8 sm:pb-12 overflow-hidden bg-[#FAF8F3]">
        {/* Botanical leaf accent at bottom-left corner matching reference */}
        <div className="hidden lg:block absolute -bottom-2 left-0 w-36 h-28 pointer-events-none opacity-40 select-none z-0">
          <img
            src="/assets/images/botanical-accent.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start lg:items-center">
            
            {/* Left Column: Text & Calls to Action (Vertically positioned near top) */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 pt-2 lg:pt-0">
              
              {/* Sage-green pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEBE1] text-[#246B52] text-xs font-bold tracking-wider uppercase shadow-xs">
                <Sprout className="w-3.5 h-3.5 text-[#246B52] flex-shrink-0" />
                <span>Community Support, Made Actionable</span>
              </div>

              {/* Large, bold, elegant serif headline on two lines */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[70px] xl:text-[76px] text-[#202720] leading-[1.05] tracking-tight">
                Find the support. <br />
                <span className="text-[#246B52] italic font-serif font-normal">
                  Take the next step.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg lg:text-[18.5px] text-[#4A554A] leading-relaxed max-w-xl font-normal">
                BlockBridge AI helps residents and small businesses navigate fragmented public programs, commercial grants, and utility relief. We turn verified public records into an actionable, prioritized plan — so you can move forward with confidence.
              </p>

              {/* Two Horizontally Aligned CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#246B52] hover:bg-[#1B533F] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <Search className="w-4 h-4 text-white/90" />
                  <span>Explore Resources</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to="/find-support"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF8F3] text-[#202720] border border-[#D5D0C5] hover:border-[#246B52] text-sm font-semibold shadow-sm transition-all group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#246B52]" />
                  <span>Try AI Assistant</span>
                  <ArrowRight className="w-4 h-4 text-bb-ink-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Trust-Feature Row with 4 Items */}
              <div className="pt-4 border-t border-[#EAE6DD] flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm text-[#202720] font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#246B52] flex-shrink-0" />
                  <span>Verified Sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#246B52] flex-shrink-0" />
                  <span>Real Programs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#246B52] flex-shrink-0" />
                  <span>Actionable Plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#246B52] flex-shrink-0" />
                  <span>Stronger Communities</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dominant Photography & Single Floating AI Card */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[560px]">
                {/* Visual composition with authentic local merchant photograph */}
                <div className="relative w-full overflow-hidden rounded-3xl shadow-md border border-[#E8E4DA] bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80"
                    alt="Local community business owner in a welcoming neighborhood shop"
                    className="w-full h-[380px] sm:h-[460px] object-cover select-none"
                    loading="eager"
                  />

                  {/* Single Floating AI Assistance Card - Clean, no duplicate background label */}
                  <div className="absolute right-3 sm:right-5 bottom-3 sm:bottom-5 left-3 sm:left-auto sm:w-[350px] bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-[#E8E4DA] transition-all hover:shadow-2xl z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#202720]">
                        <Sparkles className="w-4 h-4 text-[#246B52]" />
                        <span>AI-Powered Assistance</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F5EE] text-[#1B5E3C]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#246B52] animate-pulse"></span>
                        Ready
                      </span>
                    </div>

                    <p className="text-[11px] sm:text-xs text-black/60 leading-relaxed mt-1.5 mb-3">
                      Tell us your needs and get personalized resource matches with verified next steps.
                    </p>

                    <form onSubmit={handleAIAssistSubmit} className="relative flex items-center bg-[#FAF8F3] border border-[#D5D0C5] rounded-full p-1 pl-3.5 shadow-inner focus-within:border-[#246B52] focus-within:ring-2 focus-within:ring-[#246B52]/20 transition-all">
                      <input
                        type="text"
                        value={assistQuery}
                        onChange={(e) => setAssistQuery(e.target.value)}
                        placeholder="I need help with utility bills, grants..."
                        className="w-full text-xs text-[#202720] bg-transparent focus:outline-none placeholder:text-black/40"
                      />
                      <button
                        type="submit"
                        className="w-7 h-7 rounded-full bg-[#246B52] hover:bg-[#1B533F] text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer shadow-sm ml-1"
                        aria-label="Submit search to AI assistant"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: TRUST STRIP WITH 3 KEY CIVIC PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 sm:p-10 rounded-3xl bg-white border border-bb-line shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-bb-brand-soft text-bb-brand flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-bb-ink">
                Official Sources Only
              </h3>
              <p className="text-sm text-bb-ink-muted leading-relaxed">
                Every listed grant and program links directly to the verified official municipal or nonprofit portal. We never scrape or invent benefits.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-bb-ink">
                Uncertainty Made Explicit
              </h3>
              <p className="text-sm text-bb-ink-muted leading-relaxed">
                If eligibility criteria require specific proof or provider confirmation, we state it transparently. The agency always makes the final determination.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-bb-coral-soft text-bb-coral flex items-center justify-center flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-bb-ink">
                Need Turned to Next Steps
              </h3>
              <p className="text-sm text-bb-ink-muted leading-relaxed">
                Finding a link is only the start. We convert application instructions into a prioritized checklist with prerequisite documents and print capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TWO CLEAR PATHWAYS WITH AUTHENTIC PHOTOGRAPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
            Tailored Navigation
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-bb-ink">
            Two Pathways, One Clear Direction
          </h2>
          <p className="text-base text-bb-ink-muted">
            Whether you are a neighbor seeking household stability or an entrepreneur building a local business, we meet you with dignity and practical tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pathway 1: Residents */}
          <div className="bg-white rounded-3xl border border-bb-line shadow-card hover:shadow-card-hover transition-all overflow-hidden flex flex-col justify-between group">
            <div className="relative h-56 sm:h-64 overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80"
                alt="Community consultation and assistance"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 text-bb-brand backdrop-blur-sm">
                  Household Support
                </span>
              </div>
            </div>

            <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-bb-ink group-hover:text-bb-brand transition-colors">
                  I Need Personal & Family Support
                </h3>
                <p className="text-sm sm:text-base text-bb-ink-muted leading-relaxed">
                  Connect with verified programs for utility bill relief (LIHEAP), local emergency food pantries (ACFB), affordable housing directories, and tuition-free career certifications.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-xs px-3 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Heating & Electric Grants</span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Food Pantry Network</span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Rental Assistance</span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Vocational Training</span>
                </div>
              </div>

              <div className="pt-6">
                <Link to="/find-support?type=resident">
                  <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Find Resident Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Pathway 2: Small Business Owners */}
          <div className="bg-white rounded-3xl border border-bb-line shadow-card hover:shadow-card-hover transition-all overflow-hidden flex flex-col justify-between group">
            <div className="relative h-56 sm:h-64 overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                alt="Black small business owners and entrepreneurs collaborating"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 text-bb-coral backdrop-blur-sm">
                  Economic Growth
                </span>
              </div>
            </div>

            <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-bb-ink group-hover:text-bb-coral transition-colors">
                  I'm Growing a Small Business
                </h3>
                <p className="text-sm sm:text-base text-bb-ink-muted leading-relaxed">
                  Discover non-predatory CDFI loan financing (ACE Loans), municipal commercial funds (Invest Atlanta), business incubation (RICE), and free 1-on-1 mentor advising.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-xs px-3 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Commercial Microloans</span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Equipment Grants</span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Free SCORE Mentors</span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-bb-surface-soft text-bb-ink font-medium">Incubator Cohorts</span>
                </div>
              </div>

              <div className="pt-6">
                <Link to="/find-support?type=small_business">
                  <Button variant="secondary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Find Small Business Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE 4-STAGE PROCESS EXPLANATION */}
      <section className="bg-bb-surface-soft py-20 sm:py-28 border-y border-bb-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
              Clear & Transparent
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-bb-ink">
              From Real Need to Tangible Outcome
            </h2>
            <p className="text-base text-bb-ink-muted">
              We eliminate confusing government acronyms and circular application mazes with four intentional steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white rounded-3xl p-7 border border-bb-line shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-bb-brand text-white font-serif font-bold text-xl flex items-center justify-center">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-bb-ink">
                Describe Your Need
              </h3>
              <p className="text-sm text-bb-ink-muted leading-relaxed">
                Tell us your situation in plain language. We never ask for sensitive data like Social Security numbers, bank credentials, or legal documents.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-bb-line shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-bb-brand text-white font-serif font-bold text-xl flex items-center justify-center">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-bb-ink">
                Verified Search
              </h3>
              <p className="text-sm text-bb-ink-muted leading-relaxed">
                Our engine matches your request strictly against our verified catalogue of active community and municipal programs. No fabricated resources.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-bb-line shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white font-serif font-bold text-xl flex items-center justify-center">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-bb-ink">
                Confirm Unknowns
              </h3>
              <p className="text-sm text-bb-ink-muted leading-relaxed">
                We clearly separate confirmed facts from details you must confirm with the provider (such as funding windows or documentation requirements).
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-bb-line shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-bb-coral text-white font-serif font-bold text-xl flex items-center justify-center">
                4
              </div>
              <h3 className="font-serif text-xl font-bold text-bb-ink">
                Track Follow-Through
              </h3>
              <p className="text-sm text-bb-ink-muted leading-relaxed">
                Turn your recommendations into a printable, trackable checklist with due dates, notes, and direct links to official forms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FEATURED VERIFIED COMMUNITY RESOURCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
              Curated Public Catalogue
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
              Featured Verified Programs in Greater Atlanta
            </h2>
            <p className="text-sm text-bb-ink-muted max-w-xl">
              All entries have verified source links, human-checked eligibility criteria, and transparent last-verified dates.
            </p>
          </div>

          <Link to="/resources">
            <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All 12 Verified Programs
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredResources.map((res) => (
            <article
              key={res.id}
              className="bg-white rounded-3xl border border-bb-line p-7 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-bb-surface-soft text-bb-ink-muted border border-bb-line">
                    {res.category}
                  </span>
                  <Badge type="verification" status={res.verification_status} size="sm" />
                </div>

                <div>
                  <p className="text-xs font-bold text-bb-brand uppercase tracking-wider">
                    {res.provider_name}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-bb-ink mt-1 group-hover:text-bb-brand transition-colors">
                    <Link to={`/resources/${res.id}`}>{res.name}</Link>
                  </h3>
                </div>

                <p className="text-sm text-bb-ink-muted line-clamp-3 leading-relaxed">
                  {res.summary}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-bb-ink-muted border-t border-bb-line">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-bb-brand" />
                    <span>{res.city}, {res.region}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-bb-brand" />
                    <span>Checked {res.source_checked_at}</span>
                  </span>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-bb-line mt-6">
                <a
                  href={res.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-bb-brand hover:underline inline-flex items-center gap-1"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <Link to={`/resources/${res.id}`}>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 6: DEDICATED SMALL-BUSINESS & DIGNITY FOCUS WITH PHOTOGRAPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-bb-line p-8 sm:p-12 shadow-card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
                Black Code Collective Hacktoberfest • Track 3
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink leading-tight">
                Designed Around Dignity, Privacy & Economic Mobility
              </h2>
              <p className="text-base text-bb-ink-muted leading-relaxed font-normal">
                Black-owned small businesses and under-resourced residents frequently experience severe information friction. Legitimate opportunities exist, but they are buried under municipal bureaucracies, expired grant portals, and obscure PDF forms.
              </p>
              <p className="text-base text-bb-ink-muted leading-relaxed font-normal">
                BlockBridge AI treats community members as capable decision-makers. We do not use deficit framing, stigmatizing labels, or forced disclosure of sensitive personal data. We give you clean, source-backed roadmaps to help you claim what you are entitled to.
              </p>

              <div className="space-y-3 pt-2 text-sm text-bb-ink">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-bb-brand flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy by Default:</strong> No race disclosure or banking credentials required to access the platform.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-bb-brand flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Grassroots Organization Visibility:</strong> Uplifts trusted regional hubs like the Russell Center (RICE), Urban League, and ACFB.
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-elevated border border-bb-line aspect-[4/3] bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
                  alt="A collaborative team of diverse small business professionals working together"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: RESPONSIBLE AI COMMITMENTS & UNCERTAINTY */}
      <section className="bg-bb-surface-soft py-16 sm:py-24 border-y border-bb-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
              Responsible Technology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
              How We Use AI Ethically & Responsibly
            </h2>
            <p className="text-base text-bb-ink-muted">
              AI should organize and clarify information—not make authoritative or unaccountable decisions about people's lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-bb-line shadow-sm space-y-2">
              <p className="font-serif font-bold text-base text-bb-ink">1. Strict Catalogue Grounding</p>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                The AI cannot invent grants, programs, or deadlines. Recommendations are restricted to verified public records.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-bb-line shadow-sm space-y-2">
              <p className="font-serif font-bold text-base text-bb-ink">2. Zero Guaranteed Approval</p>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                The platform never guarantees benefits or claims an applicant qualifies. The provider makes all final decisions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-bb-line shadow-sm space-y-2">
              <p className="font-serif font-bold text-base text-bb-ink">3. Transparent Uncertainty</p>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                Unconfirmed requirements (like income limits or zip code boundaries) are labeled as items you must verify.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-bb-line shadow-sm space-y-2">
              <p className="font-serif font-bold text-base text-bb-ink">4. Human Moderation Seam</p>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                Community corrections and partner submissions are routed to an administrative queue for human verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: COMMUNITY PARTNER CALLOUT WITH REAL PHOTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-bb-line">
          <img
            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80"
            alt="Hands joined in solidarity and community service"
            className="w-full h-96 sm:h-[420px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/80 to-stone-900/40 flex items-center">
            <div className="max-w-xl p-8 sm:p-12 space-y-4 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-bb-brand-soft">
                For Community Organizations & Municipalities
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Help Keep Your Neighborhood's Resources Accurate
              </h2>
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
                Are you a local nonprofit, municipal department, or CDFI lender? Submit program updates, correct deadlines, or suggest a new service. All partner submissions enter our reviewer workflow to protect community trust.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link to="/community-partners">
                  <Button variant="accent" size="md">
                    Community Partner Portal
                  </Button>
                </Link>
                <Link to="/resource-standards">
                  <Button variant="outline" size="md" className="text-white border-white hover:bg-white/10">
                    Verification Standards
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL MEMORABLE CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6 py-8">
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-bb-ink">
          Start with one next step today.
        </h2>
        <p className="text-base sm:text-lg text-bb-ink-muted max-w-xl mx-auto">
          Whether you need utility assistance, a small business grant, or career training, BlockBridge AI helps you take clear, verified action.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
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
