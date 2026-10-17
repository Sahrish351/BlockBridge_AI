import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink,
  Plus,
  Building2
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { ResourceCategory, PartnerResourceSubmission } from '../types';
import { Button } from '../components/common/Button';

type PartnerItem = PartnerResourceSubmission & {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submitted_at: string;
};

export const CommunityPartnersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [submissions, setSubmissions] = useState<PartnerItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Form fields
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

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const queue = await apiService.getAdminQueue();
      setSubmissions(queue.partnerSubmissions || []);
    } catch {
      // Error handling
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

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
      loadHistory();
    } catch {
      // Error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-bb-brand animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
            Civic Service Provider Portal
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
          Community Partner Workspace
        </h1>
        <p className="text-sm text-bb-ink-muted leading-relaxed">
          Submit verified public programs, update eligibility rules, and track review status across our civic moderation queue.
        </p>
      </div>

      {/* Verification Standard Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bb-line shadow-card space-y-4">
        <h2 className="font-serif text-xl font-bold text-bb-ink flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-bb-brand" />
          <span>Our Verification Standard for Community Listings</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-bb-ink-muted">
          <div className="p-4 rounded-2xl bg-bb-surface-soft border border-bb-line">
            <p className="font-semibold text-bb-ink mb-1">Human-in-the-Loop Review</p>
            <p>Every submission is reviewed by our civic curation team before appearing in public discovery results.</p>
          </div>
          <div className="p-4 rounded-2xl bg-bb-surface-soft border border-bb-line">
            <p className="font-semibold text-bb-ink mb-1">Official Domain Required</p>
            <p>We require a government or certified non-profit portal URL to verify active funding and guidelines.</p>
          </div>
          <div className="p-4 rounded-2xl bg-bb-surface-soft border border-bb-line">
            <p className="font-semibold text-bb-ink mb-1">Non-Commercial Trust</p>
            <p>BlockBridge AI is free for providers and community members. Programs are ranked solely by applicant fit.</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-bb-line pb-2">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`pb-2 text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'submit' ? 'text-bb-brand font-bold' : 'text-bb-ink-muted hover:text-bb-ink'
            }`}
          >
            <span>Submit New Program</span>
            {activeTab === 'submit' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bb-brand rounded-full"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2 text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 ${
              activeTab === 'history' ? 'text-bb-brand font-bold' : 'text-bb-ink-muted hover:text-bb-ink'
            }`}
          >
            <span>Submission History & Status</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-bb-surface-soft border border-bb-line text-bb-ink">
              {submissions.length}
            </span>
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bb-brand rounded-full"></span>
            )}
          </button>
        </div>

        {activeTab === 'history' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveTab('submit')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Submission
          </Button>
        )}
      </div>

      {/* Tab 1: Submission Form */}
      {activeTab === 'submit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bb-line shadow-card">
          {submissionId ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-bb-success mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-bb-ink">
                Resource Submission Received
              </h3>
              <p className="text-xs text-bb-ink-muted max-w-md mx-auto leading-relaxed">
                Your submission for <strong>"{resourceName}"</strong> has been logged with Tracking ID: <span className="font-mono font-bold text-bb-brand">{submissionId}</span>. It is currently under review by our moderation team and will not appear publicly until verified.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setSubmissionId(null);
                    setResourceName('');
                    setSummary('');
                    setEligibilitySummary('');
                  }}
                >
                  Submit Another Program
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab('history')}
                >
                  View Submission History
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-bb-line pb-4">
                <h3 className="font-serif text-xl font-bold text-bb-ink">
                  Submit a Community Program or Grant
                </h3>
                <p className="text-xs text-bb-ink-muted mt-0.5">
                  Provide verified program details to help community members determine eligibility before applying.
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
                    placeholder="e.g. Westside Future Fund or Invest Atlanta"
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
                    Official Website / Application Portal URL <span className="text-bb-danger">*</span>
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
                  Program Summary & Scope of Support <span className="text-bb-danger">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Plain-language description of services provided, award amounts, or cohort duration..."
                  className="w-full text-xs p-3 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-bb-ink mb-1">
                    Eligibility Criteria & Requirements
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
                    Representative Contact Email <span className="text-bb-danger">*</span>
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
                  Submit Program for Verification
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 2: Submission History & Review Status */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {isLoadingHistory ? (
            <div className="bg-white rounded-3xl p-10 border border-bb-line text-center text-xs text-bb-ink-muted">
              Loading partner submission history...
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-bb-line text-center space-y-3">
              <Building2 className="w-8 h-8 text-bb-ink-subtle mx-auto" />
              <p className="text-xs text-bb-ink-muted">You have not submitted any community resources yet.</p>
              <Button variant="primary" size="sm" onClick={() => setActiveTab('submit')}>
                Submit Your First Resource
              </Button>
            </div>
          ) : (
            submissions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-bb-line shadow-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-bb-line">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-bb-brand">
                      {item.provider_name}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-bb-ink">
                      {item.resource_name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'Approved' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified & Approved</span>
                      </span>
                    ) : item.status === 'Rejected' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Needs Additional Evidence</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending Moderation Review</span>
                      </span>
                    )}

                    <span className="text-xs text-bb-ink-subtle">
                      Submitted: {item.submitted_at}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-bb-ink-muted leading-relaxed">
                  {item.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-bb-surface-soft p-3.5 rounded-xl border border-bb-line">
                  <div>
                    <span className="font-semibold text-bb-ink">Category:</span>{' '}
                    <span className="text-bb-ink-muted">{item.category}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-bb-ink">Contact Email:</span>{' '}
                    <span className="text-bb-ink-muted">{item.contact_email}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-bb-ink">Official Verification URL:</span>{' '}
                    <a
                      href={item.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bb-brand hover:underline inline-flex items-center gap-1 font-medium ml-1"
                    >
                      {item.official_url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
