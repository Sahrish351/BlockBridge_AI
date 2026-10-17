import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  MapPin, 
  FileText, 
  Check, 
  PlusCircle
} from 'lucide-react';
import { Resource } from '../types';
import { apiService } from '../services/apiService';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ReportIssueModal } from '../components/resources/ReportIssueModal';

export const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false);
  const [addedToPlan, setAddedToPlan] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [res, saved] = await Promise.all([
          apiService.getResourceById(id),
          apiService.getSavedResourceIds()
        ]);
        setResource(res);
        setIsSaved(saved.includes(id));
      } catch {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleToggleSave = async () => {
    if (!resource) return;
    const nowSaved = await apiService.toggleSaveResource(resource.id);
    setIsSaved(nowSaved);
  };

  const handleCreatePlan = async () => {
    if (!resource) return;
    const plan = await apiService.createActionPlanFromResources(
      `${resource.name} Action Plan`,
      `Follow through on application requirements for ${resource.name} by ${resource.deadline}`,
      [resource]
    );
    setAddedToPlan(true);
    setTimeout(() => {
      navigate(`/app/plans/${plan.id}`);
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-bb-brand border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xs text-bb-ink-muted">Loading verified resource details...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-bb-ink">Resource Not Found</h2>
        <p className="text-xs text-bb-ink-muted">The requested resource could not be found in our verified catalogue.</p>
        <Link to="/resources">
          <Button variant="primary" size="md">Return to Catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-bb-ink-muted hover:text-bb-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Resource Catalogue</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <header className="bg-white rounded-3xl p-6 sm:p-8 border border-bb-line shadow-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-bb-surface-soft text-bb-ink-muted border border-bb-line">
              {resource.category}
            </span>
            <Badge type="verification" status={resource.verification_status} size="md" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isSaved ? "secondary" : "ghost"}
              size="sm"
              onClick={handleToggleSave}
              leftIcon={<Bookmark className={`w-4 h-4 ${isSaved ? 'fill-bb-brand text-bb-brand' : ''}`} />}
            >
              {isSaved ? 'Saved in Workspace' : 'Save for Later'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReporting(true)}
            >
              Suggest Update
            </Button>
          </div>
        </div>

        <div>
          <p className="text-xs sm:text-sm font-semibold text-bb-brand tracking-wider uppercase mb-1">
            {resource.provider_name}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-bb-ink leading-tight">
            {resource.name}
          </h1>
        </div>

        <p className="text-sm sm:text-base text-bb-ink-muted leading-relaxed">
          {resource.description}
        </p>

        {/* Action Button Bar */}
        <div className="pt-4 border-t border-bb-line flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-bb-ink-muted">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-bb-brand" />
              <span>{resource.city ? `${resource.city}, ${resource.region}` : resource.coverage_type}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-bb-brand" />
              <span>Checked: {resource.source_checked_at}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={resource.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                rightIcon={<ExternalLink className="w-4 h-4" />}
              >
                Visit Official Portal
              </Button>
            </a>

            <Button
              variant="primary"
              size="md"
              onClick={handleCreatePlan}
              disabled={addedToPlan}
              className="w-full sm:w-auto"
              leftIcon={addedToPlan ? <Check className="w-4 h-4 text-bb-success" /> : <PlusCircle className="w-4 h-4" />}
            >
              {addedToPlan ? 'Plan Created!' : 'Add to Action Plan'}
            </Button>
          </div>
        </div>
      </header>

      {/* Structured Facts vs. Items to Confirm (Crucial PRD Requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What We Know (Source-Verified Facts) */}
        <div className="bg-white rounded-2xl p-6 border border-bb-line shadow-card space-y-4">
          <h2 className="font-serif text-lg font-bold text-bb-ink flex items-center gap-2 pb-2 border-b border-bb-line">
            <CheckCircle2 className="w-5 h-5 text-bb-success" />
            <span>What We Know (From Official Source)</span>
          </h2>

          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <p className="font-semibold text-bb-ink">Application Process:</p>
              <p className="text-bb-ink-muted">{resource.application_method}</p>
            </div>
            <div>
              <p className="font-semibold text-bb-ink">Cost / Fee Structure:</p>
              <p className="text-bb-ink-muted">{resource.cost_details}</p>
            </div>
            <div>
              <p className="font-semibold text-bb-ink">Application Deadline:</p>
              <p className="text-bb-ink-muted">{resource.deadline}</p>
            </div>
            <div>
              <p className="font-semibold text-bb-ink">Target Audience:</p>
              <p className="text-bb-ink-muted">{resource.audience}</p>
            </div>
            <div>
              <p className="font-semibold text-bb-ink">Source Provenance:</p>
              <p className="text-bb-ink-muted">{resource.provenance_type} ({resource.source_notes})</p>
            </div>
          </div>
        </div>

        {/* What to Confirm with Provider (Uncertainty Checklist) */}
        <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200/70 shadow-card space-y-4">
          <h2 className="font-serif text-lg font-bold text-amber-950 flex items-center gap-2 pb-2 border-b border-amber-200">
            <HelpCircle className="w-5 h-5 text-amber-800" />
            <span>What to Confirm with Provider</span>
          </h2>

          <div className="space-y-3 text-xs text-amber-900 leading-relaxed">
            <p>
              BlockBridge AI never guarantees program admission or assistance. Before submitting materials, verify these specifics with {resource.provider_name}:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Current Funding Cycle:</strong> Confirm whether the current application window is accepting new applicants today.
              </li>
              <li>
                <strong>Specific Geographic Boundaries:</strong> Some programs prioritize specific zip codes (e.g. Westside or designated opportunity zones).
              </li>
              <li>
                <strong>Income & Documentation Thresholds:</strong> Confirm your current tax return or paystub documentation satisfies exact program thresholds.
              </li>
              {resource.contact_details && (
                <li className="pt-1 list-none font-semibold text-amber-950">
                  Direct Contact: {resource.contact_details}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Required Documents Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-bb-line shadow-card space-y-4">
        <h2 className="font-serif text-xl font-bold text-bb-ink flex items-center gap-2">
          <FileText className="w-5 h-5 text-bb-brand" />
          <span>Required Preparation & Documents</span>
        </h2>
        <p className="text-xs text-bb-ink-muted">
          Based on the official provider requirements, gathering these documents first will speed up your application and prevent processing delays:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {resource.required_documents.map((doc: string, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-bb-surface-soft border border-bb-line text-xs font-medium text-bb-ink flex items-center gap-2.5"
            >
              <div className="w-5 h-5 rounded-md bg-bb-brand-soft text-bb-brand flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for reporting errors */}
      <ReportIssueModal
        resource={resource}
        isOpen={isReporting}
        onClose={() => setIsReporting(false)}
      />
    </div>
  );
};
