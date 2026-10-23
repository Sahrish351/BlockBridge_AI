import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import { Button } from './Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, role, isLoading, signInDemoRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-bb-brand border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium text-bb-ink-muted">
          Verifying security credentials & session...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-bb-ink">
            Role Authorization Required
          </h2>
          <p className="text-sm text-bb-ink-muted leading-relaxed">
            Your current account role is <strong className="text-bb-ink capitalize">{role}</strong>. This protected workspace requires one of: <strong className="text-bb-brand capitalize">{allowedRoles.join(', ')}</strong>.
          </p>
        </div>

        
        <div className="p-4 rounded-2xl bg-bb-surface-soft border border-bb-line text-xs space-y-3 text-left">
          <p className="font-semibold text-bb-ink flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-bb-brand" />
            <span>Hackathon Reviewer Access:</span>
          </p>
          <p className="text-bb-ink-muted">
            For competition verification, you can switch to an authorized testing persona with a single click:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {allowedRoles.map((r) => (
              <Button
                key={r}
                variant="secondary"
                size="sm"
                onClick={() => signInDemoRole(r)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Switch to {r.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Link to="/">
            <Button variant="ghost" size="sm">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
