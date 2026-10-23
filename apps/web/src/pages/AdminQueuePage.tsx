import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { Resource } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const AdminQueuePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'reports' | 'stale'>('submissions');
  const [queueData, setQueueData] = useState<{
    partnerSubmissions: any[];
    errorReports: any[];
    staleResources: Resource[];
  }>({
    partnerSubmissions: [],
    errorReports: [],
    staleResources: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAdminQueue();
      setQueueData(data);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleModerate = async (id: string, action: 'Approved' | 'Rejected') => {
    const success = await apiService.moderatePartnerSubmission(id, action);
    if (success) {
      setActionMessage(`Submission ${id} marked as ${action}. Catalogue updated accordingly.`);
      setTimeout(() => setActionMessage(null), 3000);
      loadQueue();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-bb-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Moderation & Data Integrity
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-bb-ink mt-0.5">
            Civic Reviewer Queue
          </h1>
          <p className="text-xs text-bb-ink-muted mt-1">
            Review partner submissions, verify official provenance, and resolve community accuracy reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={loadQueue} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh Queue
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-bb-brand-soft border border-bb-brand-border text-xs text-bb-brand-hover font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-bb-brand" />
          <span>{actionMessage}</span>
        </div>
      )}

      
      <div className="flex border-b border-bb-line gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'submissions' ? 'text-bb-brand' : 'text-bb-ink-muted hover:text-bb-ink'
          }`}
        >
          <span>Pending Submissions</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-bb-surface-soft text-bb-ink border border-bb-line">
            {queueData.partnerSubmissions.filter(s => s.status === 'Pending').length}
          </span>
          {activeTab === 'submissions' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bb-brand"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'reports' ? 'text-bb-brand' : 'text-bb-ink-muted hover:text-bb-ink'
          }`}
        >
          <span>User Reports & Corrections</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-bb-surface-soft text-bb-ink border border-bb-line">
            {queueData.errorReports.length}
          </span>
          {activeTab === 'reports' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bb-brand"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab('stale')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'stale' ? 'text-bb-brand' : 'text-bb-ink-muted hover:text-bb-ink'
          }`}
        >
          <span>Stale / Re-verification Due</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            {queueData.staleResources.length}
          </span>
          {activeTab === 'stale' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bb-brand"></div>
          )}
        </button>
      </div>

      
      {isLoading ? (
        <div className="py-12 text-center text-xs text-bb-ink-muted">
          Loading reviewer queue items...
        </div>
      ) : activeTab === 'submissions' ? (
        <div className="space-y-4">
          {queueData.partnerSubmissions.length === 0 ? (
            <p className="text-xs text-bb-ink-muted py-6">No partner submissions in queue.</p>
          ) : (
            queueData.partnerSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl p-6 border border-bb-line shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-bb-line">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-bb-brand">
                      {sub.provider_name}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-bb-ink">
                      {sub.resource_name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bb-surface-soft border border-bb-line text-bb-ink-muted">
                      Status: {sub.status}
                    </span>
                    <span className="text-xs text-bb-ink-subtle">
                      Submitted: {sub.submitted_at}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-bb-ink-muted leading-relaxed">
                  {sub.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-bb-surface-soft p-3 rounded-xl border border-bb-line">
                  <div>
                    <span className="font-semibold text-bb-ink">Official Domain:</span>{' '}
                    <a
                      href={sub.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bb-brand hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      {sub.official_url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold text-bb-ink">Contact:</span>{' '}
                    <span className="text-bb-ink-muted">{sub.contact_email}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-bb-ink">Eligibility Rules:</span>{' '}
                    <span className="text-bb-ink-muted">{sub.eligibility_summary || 'General eligibility applies'}</span>
                  </div>
                </div>

                {sub.status === 'Pending' && (
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleModerate(sub.id, 'Rejected')}
                      className="text-bb-danger hover:bg-bb-danger-soft"
                    >
                      Reject Submission
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleModerate(sub.id, 'Approved')}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Verify & Publish to Catalogue
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'reports' ? (
        <div className="space-y-4">
          {queueData.errorReports.length === 0 ? (
            <p className="text-xs text-bb-ink-muted py-6">No user error reports recorded.</p>
          ) : (
            queueData.errorReports.map((rep, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-bb-line shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-bb-ink">
                    Report on: {rep.resource_name}
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    Type: {rep.report_type}
                  </span>
                </div>
                <p className="text-xs text-bb-ink-muted bg-bb-surface-soft p-3 rounded-xl border border-bb-line">
                  "{rep.description}"
                </p>
                {rep.reporter_email && (
                  <p className="text-[11px] text-bb-ink-subtle">
                    Reported by: {rep.reporter_email}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {queueData.staleResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <Badge type="verification" status={res.verification_status} size="sm" />
                <h4 className="font-serif font-bold text-base text-bb-ink mt-1">
                  {res.name}
                </h4>
                <p className="text-xs text-bb-ink-muted">
                  Provider: {res.provider_name} • Last Checked: {res.source_checked_at}
                </p>
                <p className="text-xs text-amber-900 mt-1">
                  Audit Reason: {res.source_notes}
                </p>
              </div>

              <a href={res.official_url} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Check Official Site
                </Button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
