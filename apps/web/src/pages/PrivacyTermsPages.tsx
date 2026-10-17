import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
          Data Governance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
          Privacy Policy & Civic Notice
        </h1>
        <p className="text-sm text-bb-ink-muted">
          Last updated: October 2026 • Designed with privacy-by-default principles.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card space-y-6 text-xs sm:text-sm text-bb-ink-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-bb-ink">1. Data Minimization</h2>
          <p>
            BlockBridge AI collects only the minimal information required to assist with resource discovery: a general geographic area (city or ZIP code), your self-described need, and entity type (resident or small business). We explicitly do NOT collect:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Social Security Numbers (SSNs) or government ID documents</li>
            <li>Bank account numbers or login credentials</li>
            <li>Immigration status or sensitive health records</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-bb-ink">2. How Information is Processed</h2>
          <p>
            Your plain-language descriptions are processed only to extract search parameters and check against our verified resource catalogue. We do not sell your personal data or provide it to commercial brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-bb-ink">3. Transparent AI Processing</h2>
          <p>
            If third-party AI models (e.g. OpenAI / Anthropic / Gemini) are active, only the text of your immediate query is sent for semantic extraction. No persistent account identifiers or proprietary profiles are shared.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-bb-ink">4. Your Rights & Data Deletion</h2>
          <p>
            You can delete your action plans, clear your saved resources, or reset your workspace at any time directly through your dashboard.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
          Terms & Disclaimers
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
          Terms of Service & Platform Limitations
        </h1>
        <p className="text-sm text-bb-ink-muted">
          Last updated: October 2026 • Official Platform Rules.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card space-y-6 text-xs sm:text-sm text-bb-ink-muted leading-relaxed">
        <div className="p-4 rounded-xl bg-bb-surface-soft border border-bb-line font-medium text-bb-ink">
          <p>
            "BlockBridge AI helps people discover and organize community resources. It is not a government agency, grant provider, legal adviser, or emergency service. Resource details and eligibility can change. Always confirm requirements, availability, and deadlines with the official provider. Recommendations are informational and do not guarantee eligibility or assistance."
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-bb-ink">1. Informational Service Only</h2>
          <p>
            BlockBridge AI operates as a discovery and navigation tool. We do not submit applications on your behalf, award funding, or make legally binding eligibility determinations. The official provider (agency or nonprofit) retains full authority over program admissions and awards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-bb-ink">2. Not an Emergency Dispatch Service</h2>
          <p>
            If you or someone in your community is facing an immediate life-threatening crisis or emergency, call 911 or United Way 2-1-1 directly. BlockBridge AI cannot dispatch emergency responders.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-bb-ink">3. Community Submissions & Reporting</h2>
          <p>
            Users and partners submitting program corrections warrant that the links and criteria provided correspond to active, legitimate services. We reserve the right to remove unverified or misleading submissions.
          </p>
        </section>
      </div>
    </div>
  );
};
