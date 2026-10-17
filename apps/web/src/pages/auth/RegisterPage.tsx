import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { Mail, Lock, User, Building2, Users, HeartHandshake, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const RegisterPage: React.FC = () => {
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('resident');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!displayName.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(email.trim(), password, displayName.trim(), role);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else {
      setSuccessNotice(true);
      setTimeout(() => {
        if (role === 'small_business') {
          navigate('/app?tab=business', { replace: true });
        } else if (role === 'partner') {
          navigate('/community-partners', { replace: true });
        } else {
          navigate('/app?tab=resident', { replace: true });
        }
      }, 1200);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8">
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
            Create your community account
          </h2>
          <p className="text-sm text-bb-ink-muted">
            Track applications, save verified resources, and build actionable next steps.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Account created successfully! Preparing your personalized workspace...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-bb-ink">
                How will you be using BlockBridge?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('resident')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    role === 'resident'
                      ? 'border-bb-brand bg-bb-brand-soft/50 text-bb-brand font-semibold shadow-sm'
                      : 'border-bb-line bg-bb-surface-soft text-bb-ink-muted hover:text-bb-ink'
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs block">Resident</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('small_business')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    role === 'small_business'
                      ? 'border-bb-brand bg-bb-brand-soft/50 text-bb-brand font-semibold shadow-sm'
                      : 'border-bb-line bg-bb-surface-soft text-bb-ink-muted hover:text-bb-ink'
                  }`}
                >
                  <Building2 className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs block">Small Business</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('partner')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    role === 'partner'
                      ? 'border-bb-brand bg-bb-brand-soft/50 text-bb-brand font-semibold shadow-sm'
                      : 'border-bb-line bg-bb-surface-soft text-bb-ink-muted hover:text-bb-ink'
                  }`}
                >
                  <HeartHandshake className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs block">Organization</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-bb-ink mb-1">
                Full Name or Organization Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-bb-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Marcus Vance or Westside Roasters"
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
                />
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-bb-ink mb-1">
                Password <span className="text-bb-ink-subtle font-normal">(Min. 6 characters)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-bb-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
                />
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
                Create Account
              </Button>
            </div>
          </form>

          <div className="text-center pt-2 text-xs text-bb-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-bb-brand hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
