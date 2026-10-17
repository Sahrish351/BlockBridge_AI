import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ActionPlan, Resource } from '../types';
import { apiService } from '../services/apiService';
import { useAuth, UserRole } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ResidentDashboardView } from '../components/dashboard/ResidentDashboardView';
import { BusinessDashboardView } from '../components/dashboard/BusinessDashboardView';
import { PartnerDashboardView } from '../components/dashboard/PartnerDashboardView';
import { AdminDashboardView } from '../components/dashboard/AdminDashboardView';

export const DashboardPage: React.FC = () => {
  const { role, signInDemoRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Read role from query param ?role=resident|business|partner|admin or fallback to auth role
  const roleParam = searchParams.get('role');
  const normalizedRole: UserRole = 
    roleParam === 'business' ? 'small_business' :
    roleParam === 'partner' ? 'partner' :
    roleParam === 'admin' ? 'admin' :
    roleParam === 'resident' ? 'resident' :
    (role || 'resident');

  const [activeRole, setActiveRole] = useState<UserRole>(normalizedRole);

  useEffect(() => {
    if (roleParam) {
      if (roleParam === 'business') setActiveRole('small_business');
      else if (roleParam === 'partner') setActiveRole('partner');
      else if (roleParam === 'admin') setActiveRole('admin');
      else if (roleParam === 'resident') setActiveRole('resident');
    } else if (role) {
      setActiveRole(role);
    }
  }, [roleParam, role]);

  const handleRoleChange = async (newRole: UserRole) => {
    setActiveRole(newRole);
    const paramVal = newRole === 'small_business' ? 'business' : newRole;
    setSearchParams({ role: paramVal });
    await signInDemoRole(newRole);
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
