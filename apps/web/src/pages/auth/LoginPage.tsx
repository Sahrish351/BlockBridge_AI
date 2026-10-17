import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const LoginPage: React.FC = () => {
  const { signIn, signInDemoRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    await signInDemoRole(role);
    if (role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (role === 'partner') {
      navigate('/community-partners', { replace: true });
    } else if (role === 'small_business') {
      navigate('/app?tab=business', { replace: true });
    } else {
      navigate('/app?tab=resident', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-bb-brand text-white flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" viewBox="0 0 48 48" fill="none">
                <path d="M10 32C10 32 16 22 24 22C32 22 38 32 38 32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M8 32H40" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="24" cy="14" r="4" fill="#E98770" />
              </svg>
            </div>
            <span className="font-serif text-2xl font-bold text-bb-ink">
              BlockBridge<span className="text-bb-brand text-xs font-sans uppercase font-bold ml-1">AI</span>
            </span>
          </Link>
          <h2 className="font-serif text-3xl font-bold text-bb-ink">
            Sign in to your workspace
          </h2>
          <p className="text-sm text-bb-ink-muted">
            Access your saved resources, live action plans, and application checklists.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-bb-ink mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-bb-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-bb-ink">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-bb-brand hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-bb-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-10 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bb-ink-subtle hover:text-bb-ink p-1 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="w-full"
                isLoading={isSubmitting || isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Quick Demo Switcher for Judges */}
          <div className="pt-4 border-t border-bb-line space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-bb-ink flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-bb-coral" />
                <span>1-Click Test Sign In (Hackathon Demo):</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('resident')}
                className="p-2.5 rounded-xl bg-bb-surface-soft hover:bg-bb-brand-soft/50 border border-bb-line text-left transition-colors cursor-pointer group"
              >
                <p className="font-semibold text-bb-ink group-hover:text-bb-brand">Resident Persona</p>
                <p className="text-[11px] text-bb-ink-muted">Keisha (Utility & Food)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('small_business')}
                className="p-2.5 rounded-xl bg-bb-surface-soft hover:bg-bb-brand-soft/50 border border-bb-line text-left transition-colors cursor-pointer group"
              >
                <p className="font-semibold text-bb-ink group-hover:text-bb-brand">Business Owner</p>
                <p className="text-[11px] text-bb-ink-muted">Marcus (Café & Grants)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('partner')}
                className="p-2.5 rounded-xl bg-bb-surface-soft hover:bg-bb-brand-soft/50 border border-bb-line text-left transition-colors cursor-pointer group"
              >
                <p className="font-semibold text-bb-ink group-hover:text-bb-brand">Community Partner</p>
                <p className="text-[11px] text-bb-ink-muted">Westside Future Fund</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-left transition-colors cursor-pointer group"
              >
                <p className="font-semibold text-amber-950">Civic Reviewer</p>
                <p className="text-[11px] text-amber-900/80">Moderation Queue</p>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-bb-ink-muted">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-bb-brand hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
