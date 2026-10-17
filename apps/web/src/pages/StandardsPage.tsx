import React from 'react';
import { Accessibility } from 'lucide-react';

export const StandardsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
          Platform Integrity
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
          Resource Standards & Verification Policy
        </h1>
        <p className="text-sm text-bb-ink-muted leading-relaxed">
          How BlockBridge AI evaluates, verifies, and maintains community resource data to ensure trust, transparency, and dignity for residents and small businesses.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card space-y-6">
        <h2 className="font-serif text-2xl font-bold text-bb-ink">
          1. Provenance & Verification Rules
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-bb-ink-muted leading-relaxed">
          <p>
            BlockBridge AI enforces a strict zero-fabrication standard for all resources. A program record is only listed in our active catalogue if it meets one of four verified tiers:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>Official Government Agency:</strong> Programs sponsored directly by municipal, county, state, or federal bodies (e.g. City of Atlanta, Georgia DHS, LIHEAP, SBA).
            </li>
            <li>
              <strong>Certified CDFIs & Resource Centers:</strong> Accredited Community Development Financial Institutions (e.g. ACE CDFI) and established entrepreneurship hubs (e.g. Russell Innovation Center for Entrepreneurs).
            </li>
            <li>
              <strong>Vetted Regional Nonprofits:</strong> Verified 501(c)(3) organizations with recognized public service operations (e.g. Atlanta Community Food Bank, Urban League, United Way).
            </li>
            <li>
              <strong>Human-Reviewed Partner Submissions:</strong> Submissions from community leaders that have passed manual review against verified source URLs.
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card space-y-6">
        <h2 className="font-serif text-2xl font-bold text-bb-ink">
          2. Resource Freshness & Re-Verification
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-bb-ink-muted leading-relaxed">
          <p>
            Community program deadlines, funding allocations, and intake procedures change regularly. We operate under a continuous freshness cycle:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-bb-surface-soft border border-bb-line">
              <h4 className="font-bold text-bb-ink mb-1">90-Day Freshness Window</h4>
              <p className="text-xs">Any resource not checked by a reviewer within 90 days automatically transitions to "Needs Re-verification" with a visible badge.</p>
            </div>
            <div className="p-4 rounded-xl bg-bb-surface-soft border border-bb-line">
              <h4 className="font-bold text-bb-ink mb-1">Community Error Reports</h4>
              <p className="text-xs">Users and partners can report broken links, expired funding, or outdated criteria directly from any card.</p>
            </div>
          </div>
        </div>
      </div>

      <div id="accessibility" className="bg-white rounded-3xl p-8 border border-bb-line shadow-card space-y-6">
        <h2 className="font-serif text-2xl font-bold text-bb-ink flex items-center gap-2">
          <Accessibility className="w-6 h-6 text-bb-brand" />
          <span>3. Digital Accessibility & Dignity</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-bb-ink-muted leading-relaxed">
          <p>
            We adhere to <strong>WCAG 2.2 AA</strong> standards to ensure our tools are usable by all community members:
          </p>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>High-contrast text tokens ensuring readability on all screen types.</li>
            <li>Full keyboard accessibility with visible, distinct focus rings.</li>
            <li>Explicit status labels that never rely on color alone.</li>
            <li>Touch targets engineered to 44px+ minimum for mobile devices.</li>
            <li>Reduced-motion support for users with vestibular sensitivities.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
