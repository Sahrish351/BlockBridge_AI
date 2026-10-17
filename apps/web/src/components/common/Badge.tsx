import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Sparkles, Clock } from 'lucide-react';
import { VerificationStatus, MatchConfidence } from '../../types';

interface BadgeProps {
  type?: 'verification' | 'confidence' | 'category' | 'demo' | 'neutral';
  status?: VerificationStatus | MatchConfidence | string;
  size?: 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  type = 'neutral',
  status,
  size = 'md',
  className = '',
  children,
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5 gap-1' : 'text-xs px-3 py-1 gap-1.5';

  if (type === 'verification') {
    switch (status) {
      case 'Verified':
        return (
          <span
            className={`inline-flex items-center font-medium rounded-full bg-bb-success-soft text-bb-success border border-emerald-200 ${sizeClasses} ${className}`}
            title="Official source confirmed by human reviewer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>Verified Source</span>
          </span>
        );
      case 'Needs Re-verification':
        return (
          <span
            className={`inline-flex items-center font-medium rounded-full bg-bb-warning-soft text-bb-warning border border-amber-200 ${sizeClasses} ${className}`}
            title="Periodic review due or details may have updated"
          >
            <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>Needs Re-verification</span>
          </span>
        );
      case 'Unverified':
      default:
        return (
          <span
            className={`inline-flex items-center font-medium rounded-full bg-stone-100 text-stone-600 border border-stone-200 ${sizeClasses} ${className}`}
          >
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>Pending Review</span>
          </span>
        );
    }
  }

  if (type === 'confidence') {
    switch (status) {
      case 'Likely Match':
        return (
          <span
            className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses} ${className}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            <span>Likely Match</span>
          </span>
        );
      case 'Possible Match':
        return (
          <span
            className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses} ${className}`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" aria-hidden="true" />
            <span>Possible Match (Confirm Details)</span>
          </span>
        );
      default:
        return (
          <span
            className={`inline-flex items-center font-medium rounded-full bg-sky-50 text-sky-800 border border-sky-200 ${sizeClasses} ${className}`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" aria-hidden="true" />
            <span>Needs Confirmation</span>
          </span>
        );
    }
  }

  if (type === 'demo') {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-bb-butter-soft text-amber-900 border border-amber-300 ${sizeClasses} ${className}`}
      >
        <Sparkles className="w-3 h-3 text-amber-700 flex-shrink-0" aria-hidden="true" />
        <span>Demo Fixture • Verified Sample Data</span>
      </span>
    );
  }

  if (type === 'category') {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-bb-surface-soft text-bb-ink-muted border border-bb-line ${sizeClasses} ${className}`}
      >
        {children || status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-bb-surface-soft text-bb-ink border border-bb-line ${sizeClasses} ${className}`}
    >
      {children || status}
    </span>
  );
};
