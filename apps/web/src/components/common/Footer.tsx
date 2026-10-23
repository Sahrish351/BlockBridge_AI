import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bb-surface-soft border-t border-bb-line text-bb-ink-muted text-sm pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-bb-line">
          
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-bb-brand text-white flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 48 48" fill="none">
                  <path d="M10 32C10 32 16 22 24 22C32 22 38 32 38 32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M8 32H40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="24" cy="14" r="4.5" fill="#E98770" />
                </svg>
              </div>
              <span className="font-serif text-xl font-bold text-bb-ink">
                BlockBridge<span className="text-bb-brand text-xs ml-1 font-sans font-bold">AI</span>
              </span>
            </Link>
            <p className="text-xs text-bb-ink-muted leading-relaxed">
              An AI-assisted community resource navigator built for residents and local small businesses to move from a real need to a practical, source-backed action plan.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-bb-line text-xs font-medium text-bb-ink">
              <ShieldCheck className="w-3.5 h-3.5 text-bb-brand" />
              <span>Zero-hallucination resource matching</span>
            </div>
          </div>

          
          <div>
            <h4 className="font-semibold text-bb-ink uppercase text-xs tracking-wider mb-3">
              Discover Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/find-support" className="hover:text-bb-brand transition-colors">
                  Find Support (Guided Intake)
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-bb-brand transition-colors">
                  Browse Resource Catalogue
                </Link>
              </li>
              <li>
                <Link to="/find-support?type=small_business" className="hover:text-bb-brand transition-colors">
                  Small Business Support
                </Link>
              </li>
              <li>
                <Link to="/app" className="hover:text-bb-brand transition-colors">
                  My Action Plans & Saved Items
                </Link>
              </li>
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-bb-ink uppercase text-xs tracking-wider mb-3">
              Civic Platform & Partners
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/how-it-works" className="hover:text-bb-brand transition-colors">
                  How BlockBridge Works
                </Link>
              </li>
              <li>
                <Link to="/resource-standards" className="hover:text-bb-brand transition-colors">
                  Resource Standards & Freshness
                </Link>
              </li>
              <li>
                <Link to="/community-partners" className="hover:text-bb-brand transition-colors">
                  For Community Organizations
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-bb-brand transition-colors text-amber-900 font-medium">
                  Reviewer Queue (Moderation)
                </Link>
              </li>
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-bb-ink uppercase text-xs tracking-wider mb-3">
              Trust & Responsibility
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-bb-brand transition-colors">
                  Privacy Policy & Data Notice
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-bb-brand transition-colors">
                  Terms of Service & Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/resource-standards#accessibility" className="hover:text-bb-brand transition-colors">
                  Accessibility Commitment (WCAG 2.2)
                </Link>
              </li>
              <li>
                <span className="text-bb-ink-subtle">
                  Hacktoberfest 2026: Track 3 Community Development
                </span>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="pt-8 space-y-4">
          <div className="bg-white/80 p-4 rounded-xl border border-bb-line text-xs leading-relaxed text-bb-ink-muted">
            <p className="font-semibold text-bb-ink mb-1 flex items-center gap-1.5">
              <span>Important Community Notice & Disclaimer:</span>
            </p>
            <p>
              BlockBridge AI helps people discover and organize community resources. It is not a government agency, grant provider, legal adviser, or emergency service. Resource details and eligibility can change. Always confirm requirements, availability, and deadlines with the official provider. Recommendations are informational and do not guarantee eligibility or assistance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-bb-ink-subtle gap-2">
            <p>
              © 2026 BlockBridge AI. Built for the Black Code Collective Hacktoberfest — Track 3: Community Development.
            </p>
            <div className="flex items-center gap-1 text-xs">
              <span>Crafted with dignity & civic care</span>
              <Heart className="w-3.5 h-3.5 text-bb-coral inline fill-bb-coral" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
