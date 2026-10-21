import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { ActionPlan, Resource } from '../types';
import { apiService } from '../services/apiService';
import { useAuth, UserRole } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ResidentDashboardView } from '../components/dashboard/ResidentDashboardView';
import { BusinessDashboardView } from '../components/dashboard/BusinessDashboardView';
import { PartnerDashboardView } from '../components/dashboard/PartnerDashboardView';
import { AdminDashboardView } from '../components/dashboard/AdminDashboardView';
import { ActionPlanPage } from './ActionPlanPage';
import { FindSupportIntakePage } from './FindSupportIntakePage';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Send, 
  Bookmark, 
  Search, 
  PlusCircle, 
  ExternalLink, 
  Trash2, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { role, signInDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Message State
  const [messageDraft, setMessageDraft] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'Atlanta Civic Navigator',
      time: 'Yesterday at 3:15 PM',
      text: 'Welcome to BlockBridge AI! Your profile has been matched with 3 priority community programs in Atlanta.'
    },
    {
      id: 'm2',
      sender: 'Westside Community Partner',
      time: '2 hours ago',
      text: 'Intake documentation received. If you need assistance with proof of residency or business registration, feel free to reply directly here.'
    }
  ]);

  // Partner Submissions State
  const [partnerSubmissions, setPartnerSubmissions] = useState([
    {
      id: 'sub-01',
      name: 'Westside Youth Leadership Program',
      organization: 'Westside Future Fund',
      category: 'Education',
      submitted: 'Oct 12, 2026',
      status: 'Pending Review',
      notes: 'Under review by Atlanta Civic Review committee.',
      url: 'https://westsidefuturefund.org'
    },
    {
      id: 'sub-02',
      name: 'Small Business Equipment Grant',
      organization: 'Invest Atlanta',
      category: 'Business',
      submitted: 'Oct 10, 2026',
      status: 'Approved',
      notes: 'Published to active BlockBridge directory.',
      url: 'https://investatlanta.com'
    },
    {
      id: 'sub-03',
      name: 'Senior Housing Weatherization Assistance',
      organization: 'Westside Future Fund',
      category: 'Housing',
      submitted: 'Oct 8, 2026',
      status: 'Needs Evidence',
      notes: 'Please attach updated 2026 income threshold guidelines.',
      url: 'https://westsidefuturefund.org'
    },
    {
      id: 'sub-04',
      name: 'West End Fresh Food Distribution',
      organization: 'Atlanta Community Food Bank',
      category: 'Food',
      submitted: 'Oct 5, 2026',
      status: 'Approved',
      notes: 'Weekly pantry distribution schedule verified.',
      url: 'https://acfb.org'
    }
  ]);

  // Partner Submission Form State
  const [newSubName, setNewSubName] = useState('');
  const [newSubOrg, setNewSubOrg] = useState('Westside Future Fund');
  const [newSubCategory, setNewSubCategory] = useState('Housing');
  const [newSubUrl, setNewSubUrl] = useState('');
  const [newSubSummary, setNewSubSummary] = useState('');
  const [newSubEligibility, setNewSubEligibility] = useState('');
  const [submittingPartner, setSubmittingPartner] = useState(false);
  const [subSuccessMsg, setSubSuccessMsg] = useState(false);

  // Settings State
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [notifyNewMatches, setNotifyNewMatches] = useState(true);
  const [dataPrivacyMode, setDataPrivacyMode] = useState(true);

  // Extract Route and Tabs
  const pathname = location.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const roleParam = searchParams.get('role');
  const tabParam = searchParams.get('tab');

  // Determine section
  const getActiveSection = (): string => {
    if (tabParam) return tabParam;
    if (pathname === '/app' || pathname === '/app/' || pathname === '/admin' || pathname === '/admin/') {
      return 'overview';
    }
    const clean = pathname.replace(/^\/(app|admin)\/?/, '');
    const firstSegment = clean.split('/')[0];
    return firstSegment || 'overview';
  };

  const activeSection = getActiveSection();

  // Extract Plan ID if on /app/plans/:id
  const planIdFromPath = pathname.startsWith('/app/plans/') 
    ? pathname.replace('/app/plans/', '').split('/')[0] 
    : undefined;

  const normalizedRole: UserRole = 
    isAdminRoute ? 'admin' :
    roleParam === 'business' ? 'small_business' :
    roleParam === 'partner' ? 'partner' :
    roleParam === 'admin' ? 'admin' :
    roleParam === 'resident' ? 'resident' :
    (role || 'resident');

  const [activeRole, setActiveRole] = useState<UserRole>(normalizedRole);

  useEffect(() => {
    if (isAdminRoute) {
      setActiveRole('admin');
    } else if (roleParam) {
      if (roleParam === 'business') setActiveRole('small_business');
      else if (roleParam === 'partner') setActiveRole('partner');
      else if (roleParam === 'admin') setActiveRole('admin');
      else if (roleParam === 'resident') setActiveRole('resident');
    } else if (role) {
      setActiveRole(role);
    }
  }, [isAdminRoute, roleParam, role]);

  const handleRoleChange = async (newRole: UserRole) => {
    setActiveRole(newRole);
    const paramVal = newRole === 'small_business' ? 'business' : newRole;
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('role', paramVal);
      return next;
    });
    await signInDemoRole(newRole);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageDraft.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'You',
        time: 'Just now',
        text: messageDraft.trim()
      }
    ]);
    setMessageDraft('');
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    setSubmittingPartner(true);
    let genId = `sub-0${partnerSubmissions.length + 1}`;
    try {
      const respId = await apiService.submitPartnerResource({
        provider_name: newSubOrg.trim() || 'Westside Future Fund',
        resource_name: newSubName.trim(),
        summary: newSubSummary.trim(),
        category: newSubCategory as any,
        official_url: newSubUrl.trim(),
        contact_email: 'coordinator@westsidefuturefund.org',
        eligibility_summary: newSubEligibility.trim(),
        coverage_area: 'Atlanta (Westside)',
      });
      if (respId) genId = respId;
    } catch {
      await new Promise(r => setTimeout(r, 400));
    }

    setPartnerSubmissions(prev => [
      {
        id: genId,
        name: newSubName.trim(),
        organization: newSubOrg.trim() || 'Westside Future Fund',
        category: newSubCategory,
        submitted: 'Today',
        status: 'Pending Review',
        notes: 'Awaiting source provenance verification by civic reviewers.',
        url: newSubUrl.trim() || 'https://westsidefuturefund.org'
      },
      ...prev
    ]);

    setSubmittingPartner(false);
    setSubSuccessMsg(true);
    setTimeout(() => {
      setSubSuccessMsg(false);
      setNewSubName('');
      setNewSubSummary('');
      setNewSubUrl('');
      setNewSubEligibility('');
      navigate('/app/submissions');
    }, 1200);
  };

  const handleToggleSave = async (resourceId: string) => {
    const isSaved = savedResourceIds.includes(resourceId);
    setSavedResourceIds(prev => 
      isSaved ? prev.filter(id => id !== resourceId) : [...prev, resourceId]
    );
    try {
      await apiService.toggleSaveResource(resourceId);
    } catch (err) {
      console.warn('Failed to toggle save on backend:', err);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [allPlans, savedIds, allRes] = await Promise.all([
        apiService.getActionPlans(),
        apiService.getSavedResourceIds(),
        apiService.getResources(),
      ]);

      setPlans(allPlans);
      setSavedResourceIds(savedIds);
      setAllResources(allRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const savedResourcesList = allResources.filter(r => savedResourceIds.includes(r.id));

  return (
    <DashboardLayout activeRole={activeRole} onRoleChange={handleRoleChange}>
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 rounded-full border-2 border-[#143D2F] border-t-transparent animate-spin" />
        </div>
      ) : activeSection === 'plans' ? (
        /* ==================== ACTION PLANS VIEW ==================== */
        <ActionPlanPage planId={planIdFromPath} />
      ) : activeSection === 'find-support' ? (
        /* ==================== FIND SUPPORT INTAKE VIEW ==================== */
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to={`/app?role=${activeRole === 'small_business' ? 'business' : activeRole}`}
                className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#202720]">Find Community Support</h1>
                <p className="text-xs text-black/60">Guided intake matching you with verified Atlanta programs and custom step-by-step roadmaps.</p>
              </div>
            </div>
          </div>
          <FindSupportIntakePage />
        </div>
      ) : activeSection === 'saved-resources' ? (
        /* ==================== SAVED RESOURCES VIEW ==================== */
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                to={`/app?role=${activeRole === 'small_business' ? 'business' : activeRole}`}
                className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#202720]">Saved Resources</h1>
                <p className="text-xs text-black/60">Bookmark programs for later review or reference when applying.</p>
              </div>
            </div>
            <Link
              to="/app/find-support"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743] shadow-sm self-start sm:self-auto"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore More Resources</span>
            </Link>
          </div>

          {savedResourcesList.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[#E8E4DA] text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] text-black/40 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#202720]">No Saved Resources Yet</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                As you browse verified housing, small business, food, or utility programs, click the bookmark icon to save them to your dashboard for quick access.
              </p>
              <Link
                to="/app/find-support"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743]"
              >
                <span>Find Support Now</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedResourcesList.map(res => (
                <div key={res.id} className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#246B52] transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#246B52]">
                        {res.category}
                      </span>
                      <button
                        onClick={() => handleToggleSave(res.id)}
                        className="text-[#E98770] hover:text-red-700 p-1"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#202720] leading-snug">
                      {res.name}
                    </h3>
                    <p className="text-xs text-black/50 font-medium">
                      Provided by {res.provider_name}
                    </p>
                    <p className="text-xs text-black/70 line-clamp-3 leading-relaxed">
                      {res.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E4DA] flex items-center justify-between gap-2">
                    <Link
                      to={`/resources/${res.id}`}
                      className="text-xs font-semibold text-[#246B52] hover:underline flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    {res.official_url && (
                      <a
                        href={res.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-black/60 hover:text-black flex items-center gap-1"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeSection === 'messages' ? (
        /* ==================== MESSAGES VIEW ==================== */
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Link
              to={`/app?role=${activeRole === 'small_business' ? 'business' : activeRole}`}
              className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#202720]">Community Messages & Updates</h1>
              <p className="text-xs text-black/60">Direct messages from community navigators, caseworkers, and civic reviewers.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm space-y-6">
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                    msg.sender === 'You' 
                      ? 'bg-[#EBF3ED] border-[#C5DEC8] ml-8' 
                      : 'bg-[#FAF8F3] border-[#E8E4DA] mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202720]">{msg.sender}</span>
                    <span className="text-[10px] text-black/40">{msg.time}</span>
                  </div>
                  <p className="text-black/70 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#E8E4DA]">
              <input
                type="text"
                value={messageDraft}
                onChange={(e) => setMessageDraft(e.target.value)}
                placeholder="Type your message or inquiry..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8E4DA] text-xs focus:outline-none focus:ring-2 focus:ring-[#246B52]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743] flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      ) : activeSection === 'profile' ? (
        /* ==================== RESIDENT PROFILE VIEW ==================== */
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#202720]">Resident Profile</h1>
              <p className="text-xs text-black/60">Verified profile information used for program matching and action plan generation.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-sm space-y-6 text-xs">
            <div className="flex items-center gap-4 pb-6 border-b border-[#E8E4DA]">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 border border-[#E8E4DA]">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Keisha Jenkins"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#202720]">Keisha Jenkins</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3ED] text-[#246B52]">
                  Atlanta Resident • Bankhead (30314)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Primary Address</span>
                <span className="font-bold text-[#202720]">Bankhead / English Ave, Atlanta GA 30314</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Verification Status</span>
                <span className="font-bold text-[#246B52] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Proof of Residency on File</span>
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Household Size</span>
                <span className="font-bold text-[#202720]">3 (Single parent + 2 dependents)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Priority Needs</span>
                <span className="font-bold text-[#202720]">Utility Assistance, Childcare, Career Transition</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                to="/app/find-support"
                className="px-5 py-2.5 rounded-full bg-[#143D2F] text-white font-semibold hover:bg-[#1E5743]"
              >
                Update Intake Preferences
              </Link>
            </div>
          </div>
        </div>
      ) : activeSection === 'business-profile' ? (
        /* ==================== BUSINESS PROFILE VIEW ==================== */
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Link
              to="/app?role=business"
              className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#202720]">Business Profile</h1>
              <p className="text-xs text-black/60">Verified commercial profile used for small business grants, coaching, and supplier programs.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-sm space-y-6 text-xs">
            <div className="flex items-center gap-4 pb-6 border-b border-[#E8E4DA]">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 border border-[#E8E4DA]">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=200&q=80"
                  alt="Marcus Vance"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#202720]">Vance Community Roasters & Café</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3ED] text-[#246B52]">
                  Marcus Vance • West End, Atlanta (30310)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Commercial Location</span>
                <span className="font-bold text-[#202720]">Ralph David Abernathy Blvd SW, 30310</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Business Registration</span>
                <span className="font-bold text-[#246B52] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GA SOS Active & Good Standing</span>
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Years in Operation</span>
                <span className="font-bold text-[#202720]">3 Years (Founded 2023)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Employees</span>
                <span className="font-bold text-[#202720]">4 Full-time, 2 Part-time</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                to="/app/funding"
                className="px-5 py-2.5 rounded-full bg-[#143D2F] text-white font-semibold hover:bg-[#1E5743]"
              >
                View Eligible Funding
              </Link>
            </div>
          </div>
        </div>
      ) : activeSection === 'organization-profile' ? (
        /* ==================== ORGANIZATION PROFILE VIEW ==================== */
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Link
              to="/app?role=partner"
              className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#202720]">Community Partner Profile</h1>
              <p className="text-xs text-black/60">Verified community organization profile for publishing local programs.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-sm space-y-6 text-xs">
            <div className="flex items-center gap-4 pb-6 border-b border-[#E8E4DA]">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#143D2F] text-white flex items-center justify-center font-serif text-2xl font-bold">
                WFF
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#202720]">Westside Future Fund</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3ED] text-[#246B52]">
                  Verified 501(c)(3) Nonprofit Partner
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Primary Coverage Area</span>
                <span className="font-bold text-[#202720]">English Avenue, Vine City, Atlanta GA 30314 / 30318</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Partner Status</span>
                <span className="font-bold text-[#246B52] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Civic Trust Verified (Tier 1)</span>
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Active Programs Published</span>
                <span className="font-bold text-[#202720]">4 Programs in Directory</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Contact Coordinator</span>
                <span className="font-bold text-[#202720]">coordinator@westsidefuturefund.org</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                to="/app/submit-resource"
                className="px-5 py-2.5 rounded-full bg-[#143D2F] text-white font-semibold hover:bg-[#1E5743]"
              >
                Submit New Program
              </Link>
            </div>
          </div>
        </div>
      ) : activeSection === 'funding' ? (
        /* ==================== FUNDING & OPPORTUNITIES VIEW ==================== */
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                to="/app?role=business"
                className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#202720]">Funding & Small Business Opportunities</h1>
                <p className="text-xs text-black/60">Verified capital grants, CDFI loan funds, and technical assistance for Atlanta commercial ventures.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: 'Invest Atlanta Small Business Resurgence Grant',
                org: 'City of Atlanta & Invest Atlanta',
                range: '$10,000 – $40,000',
                type: 'Direct Grant (Non-repayable)',
                deadline: 'Nov 15, 2026',
                eligibility: 'Commercial storefronts in designated Atlanta opportunity zones with under 25 staff.',
                url: 'https://investatlanta.com'
              },
              {
                title: 'ACE Community Microloan Fund',
                org: 'Access to Capital for Entrepreneurs (ACE)',
                range: '$5,000 – $50,000',
                type: 'Low-Interest CDFI Working Capital',
                deadline: 'Rolling Window',
                eligibility: 'Atlanta metro businesses operating at least 1 year seeking kitchen or equipment expansion.',
                url: 'https://aceloans.org'
              },
              {
                title: 'Westside Small Business Catalytic Grant',
                org: 'Westside Future Fund',
                range: '$7,500 – $25,000',
                type: 'Neighborhood Commercial Stabilization',
                deadline: 'Dec 01, 2026',
                eligibility: 'Businesses operating in ZIP codes 30314 and 30318 serving local neighborhood residents.',
                url: 'https://westsidefuturefund.org'
              },
              {
                title: 'Georgia State Small Business Credit Initiative (SSBCI)',
                org: 'Georgia Department of Community Affairs',
                range: '$25,000 – $250,000',
                type: 'Subsidized Loan Participation',
                deadline: 'Dec 31, 2026',
                eligibility: 'Minority and women-owned small businesses with verified financial filings.',
                url: 'https://dca.ga.gov'
              }
            ].map((opp, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBF3ED] text-[#246B52]">
                      {opp.type}
                    </span>
                    <span className="text-xs font-bold text-[#E98770]">{opp.range}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#202720]">{opp.title}</h3>
                  <p className="text-xs font-semibold text-black/50">{opp.org}</p>
                  <p className="text-xs text-black/70 leading-relaxed">{opp.eligibility}</p>
                </div>

                <div className="pt-3 border-t border-[#E8E4DA] flex items-center justify-between text-xs">
                  <span className="text-black/50">Deadline: <strong className="text-[#202720]">{opp.deadline}</strong></span>
                  <a
                    href={opp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#143D2F] text-white font-semibold hover:bg-[#1E5743]"
                  >
                    <span>Apply / Guidelines</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeSection === 'submit-resource' ? (
        /* ==================== SUBMIT A RESOURCE VIEW ==================== */
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Link
              to="/app?role=partner"
              className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#202720]">Submit a Community Resource</h1>
              <p className="text-xs text-black/60">Community partners can propose verified programs to be audited and published in BlockBridge AI.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-sm space-y-6 text-xs">
            {subSuccessMsg && (
              <div className="p-4 rounded-2xl bg-[#EBF3ED] border border-[#C5DEC8] text-[#143D2F] font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#246B52]" />
                <span>Resource submitted successfully! Awaiting civic provenance review.</span>
              </div>
            )}

            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#202720] mb-1">Program / Resource Name *</label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Westside Homeowner Tax Retention Grant"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E4DA] text-xs focus:ring-2 focus:ring-[#246B52] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#202720] mb-1">Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={newSubOrg}
                    onChange={(e) => setNewSubOrg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E4DA] text-xs focus:ring-2 focus:ring-[#246B52] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#202720] mb-1">Primary Category</label>
                  <select
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E4DA] text-xs focus:ring-2 focus:ring-[#246B52] outline-none bg-white"
                  >
                    <option value="Housing">Housing Assistance</option>
                    <option value="Business">Small Business Support</option>
                    <option value="Utilities">Utilities & Energy</option>
                    <option value="Food">Food & Nutrition</option>
                    <option value="Education">Education & Jobs</option>
                    <option value="Legal">Legal & Advocacy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202720] mb-1">Official Verification URL *</label>
                <input
                  type="url"
                  required
                  value={newSubUrl}
                  onChange={(e) => setNewSubUrl(e.target.value)}
                  placeholder="https://organization.org/program"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E4DA] text-xs focus:ring-2 focus:ring-[#246B52] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202720] mb-1">Summary of Assistance</label>
                <textarea
                  rows={3}
                  value={newSubSummary}
                  onChange={(e) => setNewSubSummary(e.target.value)}
                  placeholder="Describe who this helps and what benefits are provided..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E4DA] text-xs focus:ring-2 focus:ring-[#246B52] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202720] mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={newSubEligibility}
                  onChange={(e) => setNewSubEligibility(e.target.value)}
                  placeholder="e.g. Fulton County residents at or below 60% AMI"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E4DA] text-xs focus:ring-2 focus:ring-[#246B52] outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submittingPartner}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#143D2F] text-white font-semibold hover:bg-[#1E5743] flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{submittingPartner ? 'Submitting...' : 'Submit for Civic Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : activeSection === 'submissions' || activeSection === 'submission-history' ? (
        /* ==================== SUBMISSIONS & HISTORY VIEW ==================== */
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                to="/app?role=partner"
                className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#202720]">
                  {activeSection === 'submission-history' ? 'Submission History' : 'My Submissions'}
                </h1>
                <p className="text-xs text-black/60">Review status, civic auditor feedback, and provenance verification states.</p>
              </div>
            </div>
            <Link
              to="/app/submit-resource"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#143D2F] text-white text-xs font-semibold hover:bg-[#1E5743] shadow-sm self-start sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit New Resource</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E4DA] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] border-b border-[#E8E4DA] text-black/60 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Program Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Review Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DA]">
                  {partnerSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-[#FAF8F3]/50">
                      <td className="py-3.5 px-4 font-semibold text-[#202720]">
                        <div>{sub.name}</div>
                        <span className="text-[10px] text-black/40 font-normal">{sub.organization}</span>
                      </td>
                      <td className="py-3.5 px-4 text-black/70">{sub.category}</td>
                      <td className="py-3.5 px-4 text-black/50">{sub.submitted}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === 'Approved' 
                            ? 'bg-[#EBF3ED] text-[#246B52]' 
                            : sub.status === 'Needs Evidence'
                            ? 'bg-[#FDEEE9] text-[#D85A3F]'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-black/60 max-w-xs">{sub.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeSection === 'standards' ? (
        /* ==================== STANDARDS & GUIDELINES VIEW ==================== */
        <div className="max-w-4xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Link
              to={isAdminRoute ? '/admin' : '/app'}
              className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#202720]">Verification Standards & Guidelines</h1>
              <p className="text-xs text-black/60">The BlockBridge 5-Point Civic Trust Standard required for all published community resources.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-sm space-y-6 text-xs">
            <div className="space-y-4">
              {[
                {
                  title: '1. Official Source Provenance',
                  desc: 'Every resource must originate directly from an established 501(c)(3) nonprofit, civic body, or federal/state/municipal agency. Third-party lead generators or predatory referral forms are strictly banned.'
                },
                {
                  title: '2. Active 2026 Funding & Enrollment',
                  desc: 'Programs must have an active funding cycle or open enrollment window. Expired or discontinued assistance funds are immediately archived by civic reviewers.'
                },
                {
                  title: '3. Transparent Eligibility Criteria',
                  desc: 'Income thresholds, residency constraints (e.g. Atlanta ZIP codes, Fulton County), and documentation requirements must be explicitly itemized.'
                },
                {
                  title: '4. Direct Application Endpoint',
                  desc: 'Residents and businesses must be provided with a direct, secure portal or certified physical intake location, without paywalls or unsolicited sales contacts.'
                },
                {
                  title: '5. 90-Day Freshness Verification',
                  desc: 'Every entry in the registry is audited every 90 days. Dead links or altered requirements trigger automatic flags for reviewer re-verification.'
                }
              ].map((std, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                  <h3 className="font-serif text-base font-bold text-[#143D2F] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#246B52]" />
                    <span>{std.title}</span>
                  </h3>
                  <p className="text-black/70 leading-relaxed pl-6">{std.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeSection === 'settings' ? (
        /* ==================== SETTINGS VIEW ==================== */
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Link
              to={isAdminRoute ? '/admin' : `/app?role=${activeRole === 'small_business' ? 'business' : activeRole}`}
              className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#202720]">Settings & Preferences</h1>
              <p className="text-xs text-black/60">Manage notification alerts, privacy protections, and accessibility preferences.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm space-y-5 text-xs">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] cursor-pointer">
                <div>
                  <span className="font-bold text-[#202720] block">Deadline Reminders</span>
                  <span className="text-black/50 text-[11px]">Notify me 7 days before program application windows close</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyDeadlines} 
                  onChange={(e) => setNotifyDeadlines(e.target.checked)}
                  className="w-4 h-4 text-[#246B52] rounded accent-[#246B52]" 
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] cursor-pointer">
                <div>
                  <span className="font-bold text-[#202720] block">New Verified Opportunities</span>
                  <span className="text-black/50 text-[11px]">Alert me when new programs matching my ZIP code are published</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyNewMatches} 
                  onChange={(e) => setNotifyNewMatches(e.target.checked)}
                  className="w-4 h-4 text-[#246B52] rounded accent-[#246B52]" 
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] cursor-pointer">
                <div>
                  <span className="font-bold text-[#202720] block">Data Privacy Mode</span>
                  <span className="text-black/50 text-[11px]">Never share contact information with external agencies without consent</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={dataPrivacyMode}
                  onChange={(e) => setDataPrivacyMode(e.target.checked)}
                  className="w-4 h-4 text-[#246B52] rounded accent-[#246B52]" 
                />
              </label>
            </div>
          </div>
        </div>
      ) : isAdminRoute && (activeSection === 'queue' || activeSection === 'resources' || activeSection === 'reports' || activeSection === 'audit' || activeSection === 'users') ? (
        /* ==================== ADMIN SUBVIEWS ==================== */
        <AdminDashboardView />
      ) : (
        /* ==================== ROOT OVERVIEW DASHBOARDS ==================== */
        <>
          {activeRole === 'resident' && (
            <ResidentDashboardView 
              plans={plans} 
              savedResources={savedResourcesList} 
            />
          )}

          {activeRole === 'small_business' && (
            <BusinessDashboardView />
          )}

          {activeRole === 'partner' && (
            <PartnerDashboardView />
          )}

          {activeRole === 'admin' && (
            <AdminDashboardView />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
