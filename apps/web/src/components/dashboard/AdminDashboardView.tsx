import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  FileCheck2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  Users, 
  History, 
  X, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';
import { apiService } from '../../services/apiService';

interface ReviewQueueItem {
  id: string;
  type: 'Partner Submission' | 'Resource Update';
  title: string;
  submitted: string;
  status: 'Pending' | 'Needs Info' | 'Approved' | 'Rejected';
  organization: string;
  sourceUrl: string;
  summary: string;
}

export const AdminDashboardView: React.FC = () => {
  const [queue, setQueue] = useState<ReviewQueueItem[]>([
    {
      id: 'rev-01',
      type: 'Partner Submission',
      title: 'Downtown Community Center',
      submitted: 'Oct 14, 2026',
      status: 'Pending',
      organization: 'Atlanta Urban League',
      sourceUrl: 'https://atlantaurbanleague.org',
      summary: 'Emergency utility assistance and adult computer literacy classes in 30303.',
    },
    {
      id: 'rev-02',
      type: 'Resource Update',
      title: 'LIHEAP Winter Assistance',
      submitted: 'Oct 13, 2026',
      status: 'Pending',
      organization: 'Georgia DHS',
      sourceUrl: 'https://dhs.georgia.gov/liheap',
      summary: 'Updated 2026 income thresholds for Fulton & DeKalb low-income households.',
    },
    {
      id: 'rev-03',
      type: 'Partner Submission',
      title: 'Youth Career Program',
      submitted: 'Oct 12, 2026',
      status: 'Needs Info',
      organization: 'Westside Future Fund',
      sourceUrl: 'https://westsidefuturefund.org',
      summary: 'Paid high school summer internships in hospitality and trade.',
    },
    {
      id: 'rev-04',
      type: 'Resource Update',
      title: 'SNAP Guidelines',
      submitted: 'Oct 10, 2026',
      status: 'Pending',
      organization: 'Georgia DFCS',
      sourceUrl: 'https://dfcs.georgia.gov/snap',
      summary: 'Revised deduction rules for elderly or disabled household members.',
    },
  ]);

  const [activeReviewItem, setActiveReviewItem] = useState<ReviewQueueItem | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  
  // Modals for Quick Actions
  const [activeModal, setActiveModal] = useState<'reports' | 'audit' | 'users' | null>(null);

  // Mock Error Reports from Community
  const errorReports = [
    {
      id: 'rep-01',
      resource: 'Atlanta Housing Choice Voucher Homeownership Program',
      issue: 'Outdated 2025 income threshold table; 2026 fiscal guidelines released.',
      reporter: 'community_advocate@gatech.edu',
      date: 'Oct 15, 2026',
      status: 'Open'
    },
    {
      id: 'rep-02',
      resource: 'Antioch Baptist Emergency Food Pantry',
      issue: 'Thursday distribution hour shifted from 9:30 AM to 10:00 AM.',
      reporter: 'resident.volunteer@westside.org',
      date: 'Oct 14, 2026',
      status: 'In Review'
    }
  ];

  // Audit Log History
  const auditLogs = [
    {
      id: 'aud-01',
      action: 'Resource Verified & Published',
      target: 'Invest Atlanta Small Business Opportunity Fund',
      reviewer: 'Senior Civic Reviewer (Admin)',
      timestamp: 'Oct 17, 2026 14:22 UTC'
    },
    {
      id: 'aud-02',
      action: 'Provenance Re-verification Approved',
      target: 'Low-Income Home Energy Assistance Program (LIHEAP)',
      reviewer: 'Senior Civic Reviewer (Admin)',
      timestamp: 'Oct 16, 2026 09:15 UTC'
    },
    {
      id: 'aud-03',
      action: 'Partner Intake Request Dispatched',
      target: 'Homeowner Retention Anti-Displacement Tax Fund (WFF)',
      reviewer: 'System Orchestrator',
      timestamp: 'Oct 15, 2026 16:40 UTC'
    }
  ];

  const handleModerate = async (action: 'Approved' | 'Rejected' | 'Needs Info') => {
    if (!activeReviewItem) return;

    if (action === 'Approved' || action === 'Rejected') {
      try {
        await apiService.moderatePartnerSubmission(activeReviewItem.id, action);
      } catch (err) {
        console.warn('API moderation error:', err);
      }
    }

    setQueue(prev => prev.map(item => {
      if (item.id !== activeReviewItem.id) return item;
      return { ...item, status: action };
    }));

    setActionSuccessMessage(`Item "${activeReviewItem.title}" marked as ${action}.`);
    setTimeout(() => {
      setActionSuccessMessage(null);
      setActiveReviewItem(null);
    }, 1200);
  };

  const pendingCount = queue.filter(q => q.status === 'Pending').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#202720] tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-black/60 mt-1">
          Review and verify community resources, partner submissions, and system reports.
        </p>
      </div>

      {/* 4 Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-black/60">Pending Reviews</span>
            <div className="font-serif text-2xl font-bold text-[#202720] leading-none mt-1">
              {pendingCount}
            </div>
          </div>
        </div>

        {/* Partner Submissions */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center flex-shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-black/60">Partner Submissions</span>
            <div className="font-serif text-2xl font-bold text-[#202720] leading-none mt-1">
              7
            </div>
          </div>
        </div>

        {/* Error Reports */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FDEEE9] text-[#D85A3F] flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-black/60">Error Reports</span>
            <div className="font-serif text-2xl font-bold text-[#202720] leading-none mt-1">
              2
            </div>
          </div>
        </div>

        {/* Stale Resources */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-black/60">Stale Resources</span>
            <div className="font-serif text-2xl font-bold text-[#202720] leading-none mt-1">
              3
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Review Queue + Submission Trends (Left) & Quick Actions + Verification Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Review Queue Table & Bar Chart */}
        <div className="lg:col-span-8 space-y-6">
          {/* Review Queue Table */}
          <div id="review-queue-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#202720]">
                Review Queue
              </h3>
              <Link to="/admin" className="text-xs font-semibold text-[#246B52] hover:underline">
                View All
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8E4DA] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F3] text-black/50 border-b border-[#E8E4DA] font-semibold">
                    <tr>
                      <th className="px-5 py-3.5">Type</th>
                      <th className="px-4 py-3.5">Title</th>
                      <th className="px-4 py-3.5">Submitted</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4DA]/60">
                    {queue.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                        <td className="px-5 py-4 text-black/60">
                          {item.type}
                        </td>
                        <td className="px-4 py-4 font-bold text-[#202720]">
                          {item.title}
                        </td>
                        <td className="px-4 py-4 text-black/50">
                          {item.submitted}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.status === 'Approved'
                              ? 'bg-[#EBF3ED] text-[#246B52]'
                              : item.status === 'Pending'
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-[#FDEEE9] text-[#D85A3F]'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setActiveReviewItem(item)}
                            className="px-3.5 py-1.5 rounded-full bg-[#143D2F] text-white text-[11px] font-bold hover:bg-[#1E5743] transition-colors"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Submission Trends Bar Chart matching reference */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-serif text-lg font-bold text-[#202720]">
                Submission Trends
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#143D2F]"></span>
                  <span className="text-black/60">Partner Submissions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#86EFAC]"></span>
                  <span className="text-black/60">Approved</span>
                </div>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-44 flex items-end justify-between pt-6 px-4 sm:px-8 border-b border-[#E8E4DA] pb-2">
              {[
                { month: 'Sep', partner: 35, approved: 30 },
                { month: 'Oct', partner: 65, approved: 52 },
                { month: 'Nov', partner: 90, approved: 75 },
                { month: 'Dec', partner: 110, approved: 95 },
              ].map((bar) => (
                <div key={bar.month} className="flex flex-col items-center gap-2">
                  <div className="flex items-end gap-2 h-32">
                    {/* Partner Bar */}
                    <div
                      className="w-4 sm:w-6 rounded-t-md bg-[#143D2F] transition-all hover:opacity-90"
                      style={{ height: `${(bar.partner / 120) * 100}%` }}
                      title={`Partner: ${bar.partner}`}
                    />
                    {/* Approved Bar */}
                    <div
                      className="w-4 sm:w-6 rounded-t-md bg-[#86EFAC] transition-all hover:opacity-90"
                      style={{ height: `${(bar.approved / 120) * 100}%` }}
                      title={`Approved: ${bar.approved}`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-black/50">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Actions & Keep our community informed Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#202720]">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => {
                  const el = document.getElementById('review-queue-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FAF8F3] transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#202720] group-hover:text-[#246B52] transition-colors">
                    Review Submissions
                  </h4>
                  <p className="text-[11px] text-black/50">
                    Moderate partner resources
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('reports')}
                className="w-full text-left flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FAF8F3] transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FDEEE9] text-[#D85A3F] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#202720] group-hover:text-[#246B52] transition-colors">
                    View Error Reports
                  </h4>
                  <p className="text-[11px] text-black/50">
                    Check user feedback & issues
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('audit')}
                className="w-full text-left flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FAF8F3] transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#202720] group-hover:text-[#246B52] transition-colors">
                    Audit Logs
                  </h4>
                  <p className="text-[11px] text-black/50">
                    View moderation history
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('users')}
                className="w-full text-left flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FAF8F3] transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#202720] group-hover:text-[#246B52] transition-colors">
                    Manage Users
                  </h4>
                  <p className="text-[11px] text-black/50">
                    Role permissions & access
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Keep our community informed Card matching reference */}
          <div className="bg-[#EBF3ED] rounded-3xl p-6 border border-[#C5DEC8] space-y-4">
            <div className="w-9 h-9 rounded-2xl bg-[#246B52] text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#143D2F]">
                Keep our community informed
              </h4>
              <p className="text-xs text-[#202720]/80 leading-relaxed">
                Verify sources, ensure accuracy, and support trusted local resources.
              </p>
            </div>

            <Link
              to="/resource-standards"
              className="inline-block px-4 py-2.5 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743] transition-colors shadow-sm"
            >
              View Verification Standards
            </Link>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {activeReviewItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border border-[#E8E4DA] shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
                  Civic Review
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#202720] mt-1">
                  {activeReviewItem.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveReviewItem(null)}
                className="p-1.5 rounded-full hover:bg-black/5 text-black/40 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionSuccessMessage ? (
              <div className="p-6 text-center space-y-2 bg-[#EBF3ED] rounded-2xl border border-[#C5DEC8]">
                <CheckCircle2 className="w-8 h-8 text-[#246B52] mx-auto" />
                <p className="text-xs font-bold text-[#143D2F]">
                  {actionSuccessMessage}
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-[#FAF8F3] rounded-2xl border border-[#E8E4DA] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-black/50">Provider / Organization:</span>
                    <span className="font-bold text-[#202720]">{activeReviewItem.organization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Submission Type:</span>
                    <span className="font-bold text-[#202720]">{activeReviewItem.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Official Link:</span>
                    <a 
                      href={activeReviewItem.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-bold text-[#246B52] hover:underline flex items-center gap-1"
                    >
                      <span>Visit Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-black/50 block mb-1 font-bold">Summary & Evidence:</span>
                  <p className="text-black/70 p-3 bg-white rounded-xl border border-[#E8E4DA]">
                    {activeReviewItem.summary}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                  <button
                    onClick={() => handleModerate('Needs Info')}
                    className="px-3.5 py-2 rounded-full border border-[#E8E4DA] text-black/70 hover:bg-black/5 font-semibold text-xs"
                  >
                    Request Evidence
                  </button>
                  <button
                    onClick={() => handleModerate('Rejected')}
                    className="px-3.5 py-2 rounded-full bg-[#FDEEE9] text-[#D85A3F] hover:bg-[#F8CFC3] font-semibold text-xs"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleModerate('Approved')}
                    className="px-4 py-2 rounded-full bg-[#143D2F] text-white hover:bg-[#1E5743] font-semibold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Error Reports Modal */}
      {activeModal === 'reports' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 border border-[#E8E4DA] shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D85A3F] bg-[#FDEEE9] px-2.5 py-0.5 rounded-full">
                  Community Accuracy
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#202720] mt-1">
                  Community Error Reports
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-black/5 text-black/40 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-black/60">
              User-submitted reports identifying outdated program guidelines, broken contact numbers, or updated application windows.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {errorReports.map((report) => (
                <div key={report.id} className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202720]">{report.resource}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">
                      {report.status}
                    </span>
                  </div>
                  <p className="text-black/70">{report.issue}</p>
                  <div className="flex items-center justify-between text-[11px] text-black/40 pt-1 border-t border-[#E8E4DA]/60">
                    <span>Reported by: {report.reporter}</span>
                    <span>{report.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Modal */}
      {activeModal === 'audit' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 border border-[#E8E4DA] shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#246B52] bg-[#EBF3ED] px-2.5 py-0.5 rounded-full">
                  Security & Provenance
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#202720] mt-1">
                  Moderation Audit Log
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-black/5 text-black/40 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-black/60">
              Tamper-evident log of resource approvals, guideline modifications, and verification updates.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202720]">{log.action}</span>
                    <span className="text-[10px] text-black/40">{log.timestamp}</span>
                  </div>
                  <p className="text-[#246B52] font-medium">{log.target}</p>
                  <p className="text-[11px] text-black/50">Signed by: {log.reviewer}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Management & Role Permissions Modal */}
      {activeModal === 'users' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 border border-[#E8E4DA] shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#246B52] bg-[#EBF3ED] px-2.5 py-0.5 rounded-full">
                  Access Control
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#202720] mt-1">
                  Role Permissions & Access
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-black/5 text-black/40 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { role: 'Resident', access: 'Search, Save Resources, AI Plan Builder, Action Checklists', status: 'Active' },
                { role: 'Small Business', access: 'Commercial Readiness Roadmaps, Grant Directory, Intake Planner', status: 'Active' },
                { role: 'Community Partner', access: 'Resource Intake Submissions, Reviewer Feedback, Program Status', status: 'Active' },
                { role: 'Civic Reviewer (Admin)', access: 'Review Queue, Moderate Submissions, Error Resolution, Audit Log', status: 'Restricted' },
              ].map((item) => (
                <div key={item.role} className="p-3 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#202720] block">{item.role}</span>
                    <span className="text-[11px] text-black/50">{item.access}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3ED] text-[#246B52]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
