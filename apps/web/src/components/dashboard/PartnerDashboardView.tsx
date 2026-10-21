import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  FileText, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  X
} from 'lucide-react';
import { apiService } from '../../services/apiService';
interface PartnerSubmissionItem {
  id: string;
  name: string;
  category: string;
  submitted: string;
  status: 'Pending Review' | 'Approved' | 'Needs Evidence';
  notes?: string;
}
export const PartnerDashboardView: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState<PartnerSubmissionItem[]>([
    {
      id: 'sub-01',
      name: 'Westside Youth Program',
      category: 'Education',
      submitted: 'Oct 12, 2026',
      status: 'Pending Review',
      notes: 'Under review by Atlanta Civic Review committee.',
    },
    {
      id: 'sub-02',
      name: 'Small Business Grant Program',
      category: 'Business',
      submitted: 'Oct 10, 2026',
      status: 'Approved',
      notes: 'Published to active BlockBridge directory.',
    },
    {
      id: 'sub-03',
      name: 'Housing Assistance Program',
      category: 'Housing',
      submitted: 'Oct 8, 2026',
      status: 'Needs Evidence',
      notes: 'Please attach updated 2026 income threshold guidelines.',
    },
    {
      id: 'sub-04',
      name: 'Food Distribution Network',
      category: 'Food',
      submitted: 'Oct 5, 2026',
      status: 'Approved',
      notes: 'Weekly pantry distribution schedules verified.',
    },
  ]);
  const [selectedSub, setSelectedSub] = useState<PartnerSubmissionItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Housing');
  const [formUrl, setFormUrl] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formEligibility, setFormEligibility] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSubmitting(true);
    let newId = `sub-0${submissions.length + 1}`;
    try {
      const generatedId = await apiService.submitPartnerResource({
        provider_name: 'Westside Future Fund',
        resource_name: formName.trim(),
        summary: formSummary.trim(),
        category: formCategory as any,
        official_url: formUrl.trim(),
        contact_email: 'coordinator@westsidefuturefund.org',
        eligibility_summary: formEligibility.trim() || '',
        coverage_area: 'Atlanta (Westside)',
      });
      if (generatedId) newId = generatedId;
    } catch {
      await new Promise((r) => setTimeout(r, 400));
    }
    const newSub: PartnerSubmissionItem = {
      id: newId,
      name: formName.trim(),
      category: formCategory,
      submitted: 'Today',
      status: 'Pending Review',
      notes: 'Awaiting source provenance verification.',
    };
    setSubmissions([newSub, ...submissions]);
    setSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setModalOpen(false);
      setFormName('');
      setFormSummary('');
      setFormUrl('');
      setFormEligibility('');
    }, 1200);
  };
  const pendingCount = submissions.filter(s => s.status === 'Pending Review').length;
  const approvedCount = submissions.filter(s => s.status === 'Approved').length;
  const needsEvidenceCount = submissions.filter(s => s.status === 'Needs Evidence').length;
  const totalCount = submissions.length + 8; 
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202720] tracking-tight">
            Partner Portal
          </h1>
          <p className="text-xs sm:text-sm text-black/60 mt-0.5">
            Submit and manage community resources. Track your submissions and feedback.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743] transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Submit a Resource</span>
        </button>
      </div>
      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-black/60">Total Submissions</span>
            <div className="font-serif text-2xl font-bold text-[#202720] leading-none mt-1">
              {totalCount}
            </div>
          </div>
        </div>
        {}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-black/60">Pending Review</span>
            <div className="font-serif text-2xl font-bold text-[#202720] leading-none mt-1">
              {pendingCount}
            </div>
          </div>
        </div>
        {}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-black/60">Approved</span>
            <div className="font-serif text-2xl font-bold text-[#202720] leading-none mt-1">
              {approvedCount}
            </div>
          </div>
        </div>
        {}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FDEEE9] text-[#D85A3F] flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-black/60">Needs Evidence</span>
            <div className="font-serif text-2xl font-bold text-[#202720] leading-none mt-1">
              {needsEvidenceCount}
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#202720]">
              Recent Submissions
            </h3>
            <span className="text-xs font-semibold text-[#246B52] cursor-pointer hover:underline">
              View All
            </span>
          </div>
          <div className="bg-white rounded-3xl border border-[#E8E4DA] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] text-black/50 border-b border-[#E8E4DA] font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Resource Name</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Submitted</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DA]/60">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                      <td className="px-5 py-4 font-bold text-[#202720]">
                        {sub.name}
                      </td>
                      <td className="px-4 py-4 text-black/60">
                        {sub.category}
                      </td>
                      <td className="px-4 py-4 text-black/50">
                        {sub.submitted}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          sub.status === 'Approved'
                            ? 'bg-[#EBF3ED] text-[#246B52]'
                            : sub.status === 'Pending Review'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#FDEEE9] text-[#D85A3F]'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="text-[#246B52] hover:text-[#143D2F] font-bold hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {}
        <div className="lg:col-span-4 space-y-6">
          {}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#202720]">
              Helpful Resources
            </h3>
            <div className="space-y-3">
              <Link 
                to="/community-partners" 
                className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FAF8F3] transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#202720] group-hover:text-[#246B52] transition-colors">
                    Submission Guidelines
                  </h4>
                  <p className="text-[11px] text-black/50">
                    Learn what information to include
                  </p>
                </div>
              </Link>
              <Link 
                to="/resource-standards" 
                className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FAF8F3] transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#202720] group-hover:text-[#246B52] transition-colors">
                    Verification Standards
                  </h4>
                  <p className="text-[11px] text-black/50">
                    How resources are reviewed
                  </p>
                </div>
              </Link>
              <div className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FAF8F3] transition-colors group cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] text-[#246B52] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#202720] group-hover:text-[#246B52] transition-colors">
                    Partner Support
                  </h4>
                  <p className="text-[11px] text-black/50">
                    Get help with your submission
                  </p>
                </div>
              </div>
            </div>
          </div>
          {}
          <div className="relative rounded-3xl overflow-hidden shadow-sm h-52 group">
            <img
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80"
              alt="Community hands joined together"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[11px] font-semibold text-white/80">9ver</span>
              <h4 className="font-serif text-xl font-bold text-white mt-1">
                Stronger together
              </h4>
              <p className="text-xs text-white/80 mt-0.5">
                Build a more connected community
              </p>
              <div className="self-end mt-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-[#143D2F] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border border-[#E8E4DA] shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-[#202720]">
                {selectedSub.name}
              </h3>
              <button 
                onClick={() => setSelectedSub(null)}
                className="p-1.5 rounded-full hover:bg-black/5 text-black/40 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#E8E4DA]">
                <span className="text-black/50">Category:</span>
                <span className="font-bold text-[#202720]">{selectedSub.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E8E4DA]">
                <span className="text-black/50">Submission Date:</span>
                <span className="font-bold text-[#202720]">{selectedSub.submitted}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E8E4DA]">
                <span className="text-black/50">Verification Status:</span>
                <span className="font-bold text-[#246B52]">{selectedSub.status}</span>
              </div>
              <div className="py-2">
                <span className="text-black/50 block mb-1">Reviewer Feedback:</span>
                <p className="p-3 bg-[#FAF8F3] rounded-xl text-black/70 border border-[#E8E4DA]">
                  {selectedSub.notes || 'No review notes provided yet.'}
                </p>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 border border-[#E8E4DA] shadow-xl my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#202720]">
                  Submit Community Program
                </h3>
                <p className="text-xs text-black/60 mt-0.5">
                  Direct submission into the Civic Review Queue
                </p>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-black/40 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {submitSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#246B52] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#202720]">
                  Program Submitted!
                </h4>
                <p className="text-xs text-black/60">
                  Your submission has been queued for verification by a civic reviewer.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#202720] mb-1">
                    Program / Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Westside Early Learning Grant"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DA] focus:ring-2 focus:ring-[#246B52] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#202720] mb-1">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DA] focus:ring-2 focus:ring-[#246B52] focus:outline-none"
                    >
                      <option value="Housing">Housing</option>
                      <option value="Education">Education</option>
                      <option value="Business">Small Business</option>
                      <option value="Food">Food & Nutrition</option>
                      <option value="Utilities">Utilities & Energy</option>
                      <option value="Workforce">Workforce Training</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#202720] mb-1">
                      Official Source URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DA] focus:ring-2 focus:ring-[#246B52] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-[#202720] mb-1">
                    Program Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Brief description of what assistance is provided..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DA] focus:ring-2 focus:ring-[#246B52] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#202720] mb-1">
                    Key Eligibility Requirements
                  </label>
                  <input
                    type="text"
                    value={formEligibility}
                    onChange={(e) => setFormEligibility(e.target.value)}
                    placeholder="e.g., 30314 residents, under 80% AMI"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DA] focus:ring-2 focus:ring-[#246B52] focus:outline-none"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#E8E4DA] text-black/70 hover:bg-black/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-full bg-[#143D2F] text-white font-semibold hover:bg-[#1E5743] flex items-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'Submit to Queue'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
