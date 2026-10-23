import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ShieldAlert } from 'lucide-react';
import { Resource, ResourceCategory } from '../types';
import { apiService } from '../services/apiService';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ReportIssueModal } from '../components/resources/ReportIssueModal';
import { Button } from '../components/common/Button';
export const ResourceCataloguePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportingResource, setReportingResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [selectedCoverage, setSelectedCoverage] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const categories: (ResourceCategory | 'All')[] = [
    'All',
    'Small Business Support',
    'Utilities & Household Bills',
    'Food & Essential Needs',
    'Employment & Workforce Training',
    'Housing & Rental Support',
    'Community & Civic Services'
  ];
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resList, saved] = await Promise.all([
        apiService.getResources({
          search: searchQuery,
          category: selectedCategory,
          coverage: selectedCoverage,
          status: selectedStatus,
        }),
        apiService.getSavedResourceIds()
      ]);
      setResources(resList);
      setSavedIds(saved);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedCoverage, selectedStatus]);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };
  const handleToggleSave = async (id: string) => {
    const isNowSaved = await apiService.toggleSaveResource(id);
    if (isNowSaved) {
      setSavedIds(prev => [...prev, id]);
    } else {
      setSavedIds(prev => prev.filter(x => x !== id));
    }
  };
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCoverage('All');
    setSelectedStatus('All');
    setSearchParams({});
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
          Verified Catalogue
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bb-ink">
          Browse Verified Community Resources
        </h1>
        <p className="text-sm text-bb-ink-muted max-w-2xl leading-relaxed">
          Every program in this catalogue has been checked against official government, municipal, or nonprofit sources. All entries display their source checked date, eligibility criteria, and official portal links.
        </p>
      </div>
      {}
      <div className="bg-white rounded-2xl border border-bb-line p-4 sm:p-6 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-bb-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by program, provider, service keyword (e.g., Invest Atlanta, utilities, LIHEAP)..."
              className="w-full text-sm pl-11 pr-4 py-2.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
            />
          </div>
          <Button variant="primary" size="md" type="submit">
            Search Catalogue
          </Button>
          {(searchQuery || selectedCategory !== 'All' || selectedCoverage !== 'All' || selectedStatus !== 'All') && (
            <Button variant="ghost" size="md" onClick={clearAllFilters} leftIcon={<X className="w-4 h-4" />}>
              Clear
            </Button>
          )}
        </form>
        {}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-bb-line">
          <span className="text-xs font-semibold text-bb-ink-muted mr-1">Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-bb-brand text-white font-semibold'
                  : 'bg-bb-surface-soft text-bb-ink-muted hover:text-bb-ink hover:bg-bb-line'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-bb-ink-muted">
          <div className="flex items-center gap-2">
            <span>Coverage:</span>
            <select
              value={selectedCoverage}
              onChange={(e) => setSelectedCoverage(e.target.value)}
              className="px-2 py-1 rounded-lg bg-bb-surface-soft border border-bb-line text-xs font-medium text-bb-ink"
            >
              <option value="All">All Regions</option>
              <option value="City">City of Atlanta</option>
              <option value="Regional">Regional Metro</option>
              <option value="Statewide">Statewide Georgia</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>Verification:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1 rounded-lg bg-bb-surface-soft border border-bb-line text-xs font-medium text-bb-ink"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Needs Re-verification">Needs Re-verification</option>
            </select>
          </div>
          <span className="ml-auto font-medium text-bb-ink">
            Showing {resources.length} verified programs
          </span>
        </div>
      </div>
      {}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-bb-line p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-bb-line rounded w-1/3"></div>
              <div className="h-6 bg-bb-line rounded w-3/4"></div>
              <div className="h-16 bg-bb-line rounded w-full"></div>
              <div className="h-8 bg-bb-line rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-2xl border border-bb-line p-12 text-center max-w-lg mx-auto space-y-4">
          <ShieldAlert className="w-12 h-12 text-bb-coral mx-auto" />
          <h3 className="font-serif text-xl font-bold text-bb-ink">
            No matching programs in our verified catalogue
          </h3>
          <p className="text-xs text-bb-ink-muted leading-relaxed">
            We only return programs with human-verified official provenance. Try clearing your filters, broadening your keyword, or suggesting a community resource for our review team.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="secondary" size="sm" onClick={clearAllFilters}>
              Reset Filters
            </Button>
            <Button variant="primary" size="sm" onClick={() => (window.location.href = '/community-partners')}>
              Suggest a Resource
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isSaved={savedIds.includes(resource.id)}
              onToggleSave={handleToggleSave}
              onReportIssue={(res: Resource) => setReportingResource(res)}
            />
          ))}
        </div>
      )}
      {}
      <ReportIssueModal
        resource={reportingResource}
        isOpen={!!reportingResource}
        onClose={() => setReportingResource(null)}
      />
    </div>
  );
};
