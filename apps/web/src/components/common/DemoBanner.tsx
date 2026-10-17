import React from 'react';
import { Sparkles, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DemoBannerProps {
  onLoadScenario?: (scenarioId: string) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onLoadScenario }) => {
  return (
    <aside aria-label="Demo mode disclosure" className="bg-bb-butter-soft border-b border-amber-200/70 text-amber-950 py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-amber-200/80 text-amber-900 font-semibold px-2 py-0.5 rounded text-[11px] uppercase tracking-wide">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            Hackathon Demo Mode
          </span>
          <span className="text-amber-900">
            Loaded with <strong>12 source-verified Atlanta & Georgia community programs</strong>. All organization details and criteria are from public records.
          </span>
        </div>

        <div className="flex items-center gap-3 font-medium">
          <span className="text-amber-800 hidden md:inline">Quick Scenarios:</span>
          {onLoadScenario ? (
            <>
              <button
                onClick={() => onLoadScenario('scenario-small-business')}
                className="underline hover:text-amber-950 transition-colors cursor-pointer"
              >
                Small Business (Marcus)
              </button>
              <span className="text-amber-300">•</span>
              <button
                onClick={() => onLoadScenario('scenario-resident-relief')}
                className="underline hover:text-amber-950 transition-colors cursor-pointer"
              >
                Resident Energy & Food (Keisha)
              </button>
            </>
          ) : (
            <Link
              to="/find-support"
              className="inline-flex items-center gap-1 text-bb-brand hover:underline font-semibold"
            >
              <span>Test Discovery Flow</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
          <Link
            to="/resource-standards"
            className="text-amber-800 hover:text-amber-950 flex items-center gap-1 pl-2 border-l border-amber-300"
            title="Read our data verification policy"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verification Standards</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
