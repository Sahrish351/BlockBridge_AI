import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    const { error } = await resetPassword(email.trim());
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-bb-ink-muted hover:text-bb-brand transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
          <h2 className="font-serif text-3xl font-bold text-bb-ink">
            Reset your password
          </h2>
          <p className="text-sm text-bb-ink-muted mt-1">
            Enter your registered email address and we'll send you a secure password reset link.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-bb-line shadow-card space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-bb-success mx-auto" />
              <h3 className="font-serif text-xl font-bold text-bb-ink">
                Check your inbox
              </h3>
              <p className="text-xs text-bb-ink-muted leading-relaxed">
                If an account exists for <strong>{email}</strong>, a secure reset email has been dispatched. Follow the link to choose a new password.
              </p>
              <div className="pt-4">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
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
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
