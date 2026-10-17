import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  CheckCircle2
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { ResourceCategory } from '../types';
import { Button } from '../components/common/Button';

export const CommunityPartnersPage: React.FC = () => {
  const [providerName, setProviderName] = useState('');
  const [resourceName, setResourceName] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Small Business Support');
  const [officialUrl, setOfficialUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [eligibilitySummary, setEligibilitySummary] = useState('');
  const [coverageArea] = useState('Metro Atlanta');
  const [notes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName || !resourceName || !officialUrl || !contactEmail) return;

    setIsSubmitting(true);
    try {
      const id = await apiService.submitPartnerResource({
        provider_name: providerName,
        resource_name: resourceName,
        summary,
        category,
        official_url: officialUrl,
        contact_email: contactEmail,
        eligibility_summary: eligibilitySummary,
        coverage_area: coverageArea,
        notes,
      });
      setSubmissionId(id);
    } catch {
      // Error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
          Civic Collaboration
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
          Community Partner Portal
        </h1>
        <p className="text-sm text-bb-ink-muted leading-relaxed">
          Are you a local community organization, municipal department, CDFI lender, or nonprofit service provider? Help us ensure your programs are discoverable and accurate for residents and small businesses.
        </p>
      </div>

      {/* Verification Standard Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bb-line shadow-card space-y-4">
        <h2 className="font-serif text-xl font-bold text-bb-ink flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-bb-brand" />
          <span>Our Verification Promise to the Community</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-bb-ink-muted">
          <div className="p-4 rounded-xl bg-bb-surface-soft border border-bb-line">
            <p className="font-semibold text-bb-ink mb-1">Human-in-the-Loop Review</p>
            <p>Every submission is reviewed by our civic curation team before appearing in public discovery results.</p>
          </div>
          <div className="p-4 rounded-xl bg-bb-surface-soft border border-bb-line">
            <p className="font-semibold text-bb-ink mb-1">Source Provenance</p>
            <p>We require an official domain or agency link to verify that the program and funding are active.</p>
          </div>
          <div className="p-4 rounded-xl bg-bb-surface-soft border border-bb-line">
            <p className="font-semibold text-bb-ink mb-1">No Pay-for-Play</p>
            <p>BlockBridge AI is free for community providers and users. Recommendations are ranked solely by user fit.</p>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bb-line shadow-card">
        {submissionId ? (
          <div className="py-10 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-bb-success mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-bb-ink">
              Resource Submission Received
            </h3>
            <p className="text-xs text-bb-ink-muted max-w-md mx-auto">
              Your submission for <strong>"{resourceName}"</strong> has been assigned Tracking ID: <span className="font-mono font-bold text-bb-brand">{submissionId}</span>. Our reviewer queue will verify the official source within 2 business days.
            </p>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setSubmissionId(null);
                  setResourceName('');
                  setSummary('');
                }}
              >
                Submit Another Program
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-bb-line pb-4">
              <h3 className="font-serif text-xl font-bold text-bb-ink">
                Submit a Program or Grant
              </h3>
              <p className="text-xs text-bb-ink-muted mt-0.5">
                Provide official details to help community members understand eligibility and prerequisites.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-bb-ink mb-1">
                  Organization / Provider Name <span className="text-bb-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. Westside Future Fund"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-bb-ink mb-1">
                  Program / Grant Title <span className="text-bb-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  placeholder="e.g. Anti-Displacement Tax Fund"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-bb-ink mb-1">
                  Assistance Category <span className="text-bb-danger">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
                >
                  <option value="Small Business Support">Small Business Support</option>
                  <option value="Utilities & Household Bills">Utilities & Household Bills</option>
                  <option value="Food & Essential Needs">Food & Essential Needs</option>
                  <option value="Employment & Workforce Training">Employment & Workforce Training</option>
                  <option value="Housing & Rental Support">Housing & Rental Support</option>
                  <option value="Community & Civic Services">Community & Civic Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-bb-ink mb-1">
                  Official Website / Portal URL <span className="text-bb-danger">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={officialUrl}
                  onChange={(e) => setOfficialUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-bb-ink mb-1">
                Program Description & Services Offered <span className="text-bb-danger">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Plain-language summary of what the program provides, grant sizes, or training details..."
                className="w-full text-xs p-3 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-bb-ink mb-1">
                  Eligibility Criteria & Key Prerequisites
                </label>
                <textarea
                  rows={2}
                  value={eligibilitySummary}
                  onChange={(e) => setEligibilitySummary(e.target.value)}
                  placeholder="e.g. Income under 80% AMI, must have operated business for 1 year in City of Atlanta limits..."
                  className="w-full text-xs p-3 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-bb-ink mb-1">
                  Organization Representative Contact Email <span className="text-bb-danger">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="coordinator@organization.org"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Program for Review
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
