import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Bookmark, 
  MapPin, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  PlusCircle, 
  Check
} from 'lucide-react';
import { Resource } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface ResourceCardProps {
  resource: Resource;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onAddToPlan?: (resource: Resource) => void;
  onReportIssue?: (resource: Resource) => void;
  whyFitReasons?: string[];
  whatToConfirm?: string[];
  matchConfidence?: string;
  isAddedToPlan?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isSaved = false,
  onToggleSave,
  onAddToPlan,
  onReportIssue,
  whyFitReasons,
  whatToConfirm,
  matchConfidence,
  isAddedToPlan = false,
}) => {
  return (
    <article className="bg-bb-surface rounded-2xl border border-bb-line p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header: Category, Badges & Save Action */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-bb-surface-soft text-bb-ink-muted border border-bb-line">
              {resource.category}
            </span>
            <Badge type="verification" status={resource.verification_status} size="sm" />
            {matchConfidence && (
              <Badge type="confidence" status={matchConfidence} size="sm" />
            )}
          </div>

          {onToggleSave && (
            <button
              onClick={() => onToggleSave(resource.id)}
              className={`p-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-bb-focus ${
                isSaved 
                  ? 'bg-bb-brand-soft text-bb-brand font-semibold' 
                  : 'text-bb-ink-muted hover:text-bb-ink hover:bg-bb-surface-soft'
              }`}
              aria-label={isSaved ? 'Remove from saved resources' : 'Save resource for later'}
              title={isSaved ? 'Saved in your workspace' : 'Save resource'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-bb-brand' : ''}`} />
            </button>
          )}
        </div>

        {/* Provider & Program Title */}
        <div className="mb-2">
          <p className="text-xs font-medium text-bb-brand-hover tracking-wide uppercase">
            {resource.provider_name}
          </p>
          <h3 className="font-serif text-xl font-bold text-bb-ink leading-snug mt-0.5 group-hover:text-bb-brand transition-colors">
            <Link to={`/resources/${resource.id}`} className="focus:outline-none focus:underline">
              {resource.name}
            </Link>
          </h3>
        </div>

        {/* Plain Language Summary */}
        <p className="text-sm text-bb-ink-muted line-clamp-2 leading-relaxed mb-4">
          {resource.summary}
        </p>

        {/* "Why This Fits" (Grounded AI matching explanation) */}
        {whyFitReasons && whyFitReasons.length > 0 && (
          <div className="mb-3 p-3 rounded-xl bg-bb-brand-soft/40 border border-bb-brand-border/40 text-xs text-bb-ink">
            <p className="font-semibold text-bb-brand-hover flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-bb-brand" />
              <span>Why this matches your situation:</span>
            </p>
            <ul className="space-y-0.5 list-disc list-inside text-bb-ink-muted">
              {whyFitReasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* "What to Confirm" (Explicit Unknowns & Eligibility Uncertainty) */}
        {whatToConfirm && whatToConfirm.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950">
            <p className="font-semibold text-amber-900 flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Items needing confirmation:</span>
            </p>
            <ul className="space-y-0.5 list-disc list-inside text-amber-900/80">
              {whatToConfirm.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata Strip: Geographic Coverage & Source checked date */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-bb-ink-muted mb-4 pt-2 border-t border-bb-line/60">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-bb-ink-subtle" />
            <span>{resource.city ? `${resource.city}, ${resource.region}` : resource.coverage_type}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-bb-ink-subtle" />
            <span>Verified: {resource.source_checked_at}</span>
          </span>
          <span className="text-bb-ink-subtle">
            Deadline: <span className="text-bb-ink font-medium">{resource.deadline}</span>
          </span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-bb-line flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <a
            href={resource.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-bb-brand hover:text-bb-brand-hover underline focus:outline-none focus:ring-1 focus:ring-bb-focus rounded"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {onReportIssue && (
            <button
              onClick={() => onReportIssue(resource)}
              className="text-[11px] text-bb-ink-subtle hover:text-bb-ink transition-colors underline focus:outline-none"
            >
              Suggest update
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/resources/${resource.id}`}>
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </Link>

          {onAddToPlan && (
            <Button
              variant={isAddedToPlan ? "secondary" : "primary"}
              size="sm"
              onClick={() => onAddToPlan(resource)}
              disabled={isAddedToPlan}
              leftIcon={isAddedToPlan ? <Check className="w-3.5 h-3.5 text-bb-success" /> : <PlusCircle className="w-3.5 h-3.5" />}
            >
              {isAddedToPlan ? 'In Plan' : 'Add to Plan'}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};
