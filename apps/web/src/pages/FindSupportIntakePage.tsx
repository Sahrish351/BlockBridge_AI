import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  FileText
} from 'lucide-react';
import { ResourceMatch, ResourceCategory } from '../types';
import { apiService } from '../services/apiService';
import { Button } from '../components/common/Button';
import { ResourceCard } from '../components/resources/ResourceCard';

export const FindSupportIntakePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Intake State
  const initialType = (searchParams.get('type') as any) || 'resident';
  const [userType, setUserType] = useState<'resident' | 'small_business' | 'exploring'>(initialType);
  const [location, setLocation] = useState('Atlanta, GA');
  const [postalCode, setPostalCode] = useState('30310');
  const [category] = useState<ResourceCategory | 'All'>('All');
  const [description, setDescription] = useState('');
  const [urgency] = useState<'Standard' | 'Urgent' | 'Immediate Emergency'>('Standard');

  // Orchestration & Results State
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [orchestrationMessage, setOrchestrationMessage] = useState('');
  const [orchestrationProgress, setOrchestrationProgress] = useState(0);
  const [results, setResults] = useState<ResourceMatch[] | null>(null);
  const [selectedForPlan, setSelectedForPlan] = useState<string[]>([]);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);

  // Load sample scenarios if triggered
  const loadScenario = (scenarioId: string) => {
    if (scenarioId === 'scenario-small-business') {
      setUserType('small_business');
      setLocation('Atlanta, GA');
      setPostalCode('30310');
      setDescription('I run a small neighborhood café in West End Atlanta and need help finding business coaching and funding opportunities to expand our kitchen equipment.');
    } else {
      setUserType('resident');
      setLocation('Atlanta, GA');
      setPostalCode('30314');
      setDescription('I need help with utility bills and grocery assistance while I look for a new job in Atlanta.');
    }
  };

  useEffect(() => {
    const scenario = searchParams.get('scenario');
    if (scenario) {
      loadScenario(scenario);
    }
  }, [searchParams]);

  const handleStartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveDesc = description.trim() || (
      userType === 'small_business'
        ? 'Looking for small business grants, commercial space assistance, or CDFI microloans.'
        : 'Looking for utility assistance, emergency food support, or workforce job training.'
    );

    setIsOrchestrating(true);
    setResults(null);

    try {
      const matches = await apiService.orchestrateRecommendations(
        {
          user_type: userType,
          location,
          postal_code: postalCode,
          category,
          description: effectiveDesc,
          urgency,
        },
        (stageMsg: string, prog: number) => {
          setOrchestrationMessage(stageMsg);
          setOrchestrationProgress(prog);
        }
      );

      setResults(matches);
      // Pre-select top 2 resources for instant action plan creation
      setSelectedForPlan(matches.slice(0, 2).map((m: ResourceMatch) => m.resource.id));
    } catch {
      // Error handling
    } finally {
      setIsOrchestrating(false);
    }
  };

  const toggleSelectForPlan = (id: string) => {
    setSelectedForPlan((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGenerateActionPlan = async () => {
    if (!results || selectedForPlan.length === 0) return;
    setIsCreatingPlan(true);

    const chosenResources = results
      .filter((m) => selectedForPlan.includes(m.resource.id))
      .map((m) => m.resource);

    const planTitle =
      userType === 'small_business'
        ? 'Small Business Growth & Capital Action Plan'
        : 'Community Support & Household Stability Plan';

    const planGoal = `Follow through on applications for ${chosenResources.map((r) => r.provider_name).join(', ')}`;

    const plan = await apiService.createActionPlanFromResources(
      planTitle,
      planGoal,
      chosenResources
    );

    setIsCreatingPlan(false);
    navigate(`/app/plans/${plan.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
          Intelligent Guided Discovery
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
          Tell Us What You Need
        </h1>
        <p className="text-sm text-bb-ink-muted leading-relaxed">
          Describe your situation in plain language. BlockBridge AI extracts matching criteria and checks them against verified public records—highlighting both confirmed facts and items needing provider verification.
        </p>

        {/* Quick Scenario Fill Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-bb-ink-subtle">Try a pre-loaded hackathon scenario:</span>
          <button
            type="button"
            onClick={() => loadScenario('scenario-small-business')}
            className="px-2.5 py-1 rounded-full bg-bb-surface-soft border border-bb-line text-bb-ink hover:border-bb-brand transition-colors font-medium cursor-pointer"
          >
            ☕ Scenario A: Small Business Owner (Marcus)
          </button>
          <button
            type="button"
            onClick={() => loadScenario('scenario-resident-relief')}
            className="px-2.5 py-1 rounded-full bg-bb-surface-soft border border-bb-line text-bb-ink hover:border-bb-brand transition-colors font-medium cursor-pointer"
          >
            🏠 Scenario B: Resident Utility Support (Keisha)
          </button>
        </div>
      </div>

      {/* Guided Intake Form */}
      <div className="bg-white rounded-3xl border border-bb-line p-6 sm:p-8 shadow-card">
        <form onSubmit={handleStartSearch} className="space-y-6">
          {/* Step 1: Who are you seeking support for? */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-bb-ink">
              1. Who is this support for?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setUserType('resident')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3.5 ${
                  userType === 'resident'
                    ? 'border-bb-brand bg-bb-brand-soft/40 text-bb-ink'
                    : 'border-bb-line bg-white hover:bg-bb-surface-soft text-bb-ink-muted'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  userType === 'resident' ? 'bg-bb-brand text-white' : 'bg-bb-surface-soft text-bb-ink-muted'
                }`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-bb-ink">Resident / Individual</h4>
                  <p className="text-xs text-bb-ink-muted mt-0.5">Household utilities, emergency food, rent assistance, workforce training</p>
                </div>
              </div>

              <div
                onClick={() => setUserType('small_business')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3.5 ${
                  userType === 'small_business'
                    ? 'border-bb-brand bg-bb-brand-soft/40 text-bb-ink'
                    : 'border-bb-line bg-white hover:bg-bb-surface-soft text-bb-ink-muted'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  userType === 'small_business' ? 'bg-bb-brand text-white' : 'bg-bb-surface-soft text-bb-ink-muted'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-bb-ink">Small Business Owner</h4>
                  <p className="text-xs text-bb-ink-muted mt-0.5">Commercial grants, CDFI low-interest loans, mentorship, incubator cohorts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-bb-ink mb-1">
                City & State
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Atlanta, GA"
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-bb-ink mb-1">
                ZIP Code <span className="text-bb-ink-subtle font-normal">(For localized corridor matching)</span>
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 30310"
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
              />
            </div>
          </div>

          {/* Step 3: Plain Language Description */}
          <div>
            <label className="block text-xs font-semibold text-bb-ink mb-1">
              Describe your situation in your own words
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                userType === 'small_business'
                  ? 'e.g., I run an independent catering company in southwest Atlanta and need capital for commercial equipment...'
                  : 'e.g., I have an overdue electric bill and need emergency utility assistance before the end of the month...'
              }
              className="w-full text-sm p-4 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus resize-none leading-relaxed"
            />
          </div>

          {/* Privacy Reassurance Note */}
          <div className="p-3.5 rounded-xl bg-bb-surface-soft border border-bb-line text-xs text-bb-ink-muted flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-bb-brand flex-shrink-0 mt-0.5" />
            <span>
              <strong>Privacy Notice:</strong> We do not ask for or store sensitive credentials (no SSNs, banking credentials, or legal documents). Your description is processed strictly for catalogue matching.
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isOrchestrating}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Analyze Need & Search Verified Programs
            </Button>
          </div>
        </form>
      </div>

      {/* AI Orchestration Stage Visualizer */}
      {isOrchestrating && (
        <div className="bg-white rounded-3xl border border-bb-brand-border p-8 shadow-card text-center space-y-5 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-bb-brand-soft text-bb-brand flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-serif text-xl font-bold text-bb-ink">
              Analyzing Public Catalogue
            </h3>
            <p className="text-xs text-bb-brand font-medium">
              {orchestrationMessage}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto bg-bb-line h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-bb-brand h-full rounded-full transition-all duration-300"
              style={{ width: `${orchestrationProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Recommendations & Action Plan Generator Area */}
      {results && (
        <section className="space-y-6 pt-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-bb-line">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
                Discovery Matches
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bb-ink">
                Found {results.length} Verified Programs
              </h2>
              <p className="text-xs text-bb-ink-muted mt-1">
                Select the programs you want to pursue to automatically generate a step-by-step action plan.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleGenerateActionPlan}
              disabled={selectedForPlan.length === 0}
              isLoading={isCreatingPlan}
              leftIcon={<FileText className="w-4 h-4" />}
            >
              Create Action Plan ({selectedForPlan.length})
            </Button>
          </div>

          {/* Results Grid with Checkbox Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map(({ resource, confidence, why_fit_reasons, what_to_confirm }) => {
              const isSelected = selectedForPlan.includes(resource.id);
              return (
                <div key={resource.id} className="relative">
                  {/* Select pill badge */}
                  <div className="absolute top-4 right-14 z-10">
                    <button
                      type="button"
                      onClick={() => toggleSelectForPlan(resource.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm border ${
                        isSelected
                          ? 'bg-bb-brand text-white border-bb-brand'
                          : 'bg-white text-bb-ink border-bb-line hover:border-bb-brand'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Selected for Plan' : 'Select'}</span>
                    </button>
                  </div>

                  <ResourceCard
                    resource={resource}
                    matchConfidence={confidence}
                    whyFitReasons={why_fit_reasons}
                    whatToConfirm={what_to_confirm}
                    onAddToPlan={() => {
                      if (!isSelected) toggleSelectForPlan(resource.id);
                      handleGenerateActionPlan();
                    }}
                    isAddedToPlan={isSelected}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Floating/Fixed CTA for generating plan */}
          <div className="bg-bb-surface-soft rounded-2xl p-6 border border-bb-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif font-bold text-lg text-bb-ink">
                Ready to turn these recommendations into an action plan?
              </h4>
              <p className="text-xs text-bb-ink-muted">
                {selectedForPlan.length} programs selected. We'll assemble official prerequisites, deadlines, and tracking milestones.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerateActionPlan}
              disabled={selectedForPlan.length === 0}
              isLoading={isCreatingPlan}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Build My Action Plan
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};
