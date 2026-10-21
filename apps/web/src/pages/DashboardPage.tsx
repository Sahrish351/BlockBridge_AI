import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { ActionPlan, Resource } from '../types';
import { apiService } from '../services/apiService';
import { useAuth, UserRole } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ResidentDashboardView } from '../components/dashboard/ResidentDashboardView';
import { BusinessDashboardView } from '../components/dashboard/BusinessDashboardView';
import { PartnerDashboardView } from '../components/dashboard/PartnerDashboardView';
import { AdminDashboardView } from '../components/dashboard/AdminDashboardView';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Send 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { role, signInDemoRole } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // New message input state for messages tab
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
      text: 'Intake documentation received. If you need assistance with proof of residency, feel free to reply directly here.'
    }
  ]);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const roleParam = searchParams.get('role');
  const tabParam = searchParams.get('tab');

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

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [allPlans, savedIds, allRes] = await Promise.all([
        apiService.getActionPlans(),
        apiService.getSavedResourceIds(),
        apiService.getResources(),
      ]);

      setPlans(allPlans);
      setSavedResources(allRes.filter((r: Resource) => savedIds.includes(r.id)));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <DashboardLayout activeRole={activeRole} onRoleChange={handleRoleChange}>
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 rounded-full border-2 border-[#143D2F] border-t-transparent animate-spin" />
        </div>
      ) : tabParam === 'messages' ? (
        /* Messages Tab View */
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Link
              to={`/app?role=${activeRole === 'small_business' ? 'business' : activeRole}`}
              className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#202720]">Community Messages & Updates</h2>
              <p className="text-xs text-black/60">Direct messages from community navigators and program coordinators.</p>
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
      ) : tabParam === 'profile' || tabParam === 'business-profile' ? (
        /* Profile Tab View */
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Link
              to={`/app?role=${activeRole === 'small_business' ? 'business' : activeRole}`}
              className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#202720]">Account & Community Profile</h2>
              <p className="text-xs text-black/60">Verified profile information used for program matching and assistance.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DA] shadow-sm space-y-6 text-xs">
            <div className="flex items-center gap-4 pb-6 border-b border-[#E8E4DA]">
              <div className="w-16 h-16 rounded-2xl bg-[#143D2F] text-white flex items-center justify-center font-serif text-2xl font-bold">
                {activeRole === 'small_business' ? 'V' : activeRole === 'partner' ? 'W' : 'K'}
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#202720]">
                  {activeRole === 'small_business' 
                    ? 'Vance Community Roasters & Café' 
                    : activeRole === 'partner' 
                    ? 'Westside Future Fund' 
                    : 'Keisha Jenkins'}
                </h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3ED] text-[#246B52]">
                  {activeRole === 'small_business' ? 'Small Business (30310)' : activeRole === 'partner' ? 'Verified Organization' : 'Atlanta Resident (30314)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Primary Location</span>
                <span className="font-bold text-[#202720]">
                  {activeRole === 'small_business' ? 'West End, Atlanta GA 30310' : 'Bankhead / English Ave, Atlanta GA 30314'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] space-y-1">
                <span className="text-black/50 block text-[11px]">Verified Credentials</span>
                <span className="font-bold text-[#246B52] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Proof of Residency on File</span>
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                to="/find-support"
                className="px-5 py-2.5 rounded-full bg-[#143D2F] text-white font-semibold hover:bg-[#1E5743]"
              >
                Update Intake Preferences
              </Link>
            </div>
          </div>
        </div>
      ) : tabParam === 'settings' ? (
        /* Settings Tab View */
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Link
              to={`/app?role=${activeRole === 'small_business' ? 'business' : activeRole}`}
              className="p-2 rounded-xl bg-white border border-[#E8E4DA] hover:bg-black/5 text-[#202720]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#202720]">Workspace & Notification Settings</h2>
              <p className="text-xs text-black/60">Manage privacy preferences, alert frequencies, and language support.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm space-y-5 text-xs">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] cursor-pointer">
                <div>
                  <span className="font-bold text-[#202720] block">Deadline Reminders</span>
                  <span className="text-black/50 text-[11px]">Notify me 7 days before program application windows close</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#246B52] rounded accent-[#246B52]" />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] cursor-pointer">
                <div>
                  <span className="font-bold text-[#202720] block">New Verified Opportunities</span>
                  <span className="text-black/50 text-[11px]">Alert me when new programs matching my ZIP code are published</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#246B52] rounded accent-[#246B52]" />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DA] cursor-pointer">
                <div>
                  <span className="font-bold text-[#202720] block">Data Privacy Mode</span>
                  <span className="text-black/50 text-[11px]">Never share contact information with external agencies without consent</span>
                </div>
                <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-[#246B52] rounded accent-[#246B52]" />
              </label>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Dynamic View rendering matching the 4 quadrants of the reference image */}
          {activeRole === 'resident' && (
            <ResidentDashboardView 
              plans={plans} 
              savedResources={savedResources} 
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
