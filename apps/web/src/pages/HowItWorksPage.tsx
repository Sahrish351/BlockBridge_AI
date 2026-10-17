import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
          Behind the Platform
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
          How BlockBridge Works & Our Responsible AI Policy
        </h1>
        <p className="text-sm text-bb-ink-muted leading-relaxed">
          Understanding the bridge between community need, verified data catalogues, and practical action plans.
        </p>
      </div>

      {/* 4 Steps Detailed */}
      <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card space-y-8">
        <h2 className="font-serif text-2xl font-bold text-bb-ink">
          The 4-Stage Navigation Workflow
        </h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-bb-brand text-white font-serif font-bold text-lg flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-bb-ink">
                Intake Interpretation
              </h3>
              <p className="text-xs sm:text-sm text-bb-ink-muted leading-relaxed">
                When you describe your need in natural language, our engine identifies your location, whether you are an individual resident or a small business, and which category of support is required. We never ask for sensitive data like SSNs or banking passwords.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-bb-brand text-white font-serif font-bold text-lg flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-bb-ink">
                Strict Catalogue Search
              </h3>
              <p className="text-xs sm:text-sm text-bb-ink-muted leading-relaxed">
                Unlike a generic generative chatbot that might hallucinate non-existent grants, BlockBridge AI restricts its matching strictly to our verified catalogue of public and nonprofit programs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-700 text-white font-serif font-bold text-lg flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-bb-ink">
                Eligibility & Uncertainty Analysis
              </h3>
              <p className="text-xs sm:text-sm text-bb-ink-muted leading-relaxed">
                We compare the facts you provided against the stated requirements of each program. Where eligibility rules depend on unconfirmed facts (e.g., household gross income or exact zip codes), we label them clearly as "Items Needing Confirmation."
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-bb-coral text-white font-serif font-bold text-lg flex items-center justify-center flex-shrink-0">
              4
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-bb-ink">
                Action-Plan Construction
              </h3>
              <p className="text-xs sm:text-sm text-bb-ink-muted leading-relaxed">
                Discovery without follow-through creates burnout. We convert recommendations into a prioritized checklist with prerequisite document lists, direct links to official application portals, and tracking statuses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsible AI Commitments */}
      <div className="bg-bb-surface-soft rounded-3xl p-8 border border-bb-line space-y-6">
        <h2 className="font-serif text-2xl font-bold text-bb-ink flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-bb-brand" />
          <span>Our Responsible AI Commitments</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-bb-ink-muted">
          <div className="p-4 rounded-xl bg-white border border-bb-line">
            <p className="font-semibold text-bb-ink mb-1">AI is a Guide, Not an Authority</p>
            <p>The AI never guarantees program admission or claims a user is approved. Official agency officers always make benefits determinations.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-bb-line">
            <p className="font-semibold text-bb-ink mb-1">Zero Profiling or Stereotyping</p>
            <p>We do not infer racial identity, income levels, or immigration status. All users have equal, transparent access to programs.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-bb-line">
            <p className="font-semibold text-bb-ink mb-1">Transparent Uncertainty</p>
            <p>Whenever data is missing or incomplete, the platform highlights it rather than guessing or making assumptions.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-bb-line">
            <p className="font-semibold text-bb-ink mb-1">Deterministic Seam</p>
            <p>If external LLM services are offline or unconfigured, the platform continues to function via deterministic matching and verified fixtures.</p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link to="/find-support">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Try the Guided Navigator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
