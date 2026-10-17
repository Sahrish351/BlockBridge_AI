import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoBanner } from './components/common/DemoBanner';

import { LandingPage } from './pages/LandingPage';
import { ResourceCataloguePage } from './pages/ResourceCataloguePage';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { FindSupportIntakePage } from './pages/FindSupportIntakePage';
import { ActionPlanPage } from './pages/ActionPlanPage';
import { DashboardPage } from './pages/DashboardPage';
import { CommunityPartnersPage } from './pages/CommunityPartnersPage';
import { AdminQueuePage } from './pages/AdminQueuePage';
import { StandardsPage } from './pages/StandardsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPage, TermsPage } from './pages/PrivacyTermsPages';

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  const handleLoadScenario = (scenarioId: string) => {
    navigate(`/find-support?scenario=${scenarioId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bb-bg text-bb-ink">
      <DemoBanner onLoadScenario={handleLoadScenario} />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/find-support" element={<FindSupportIntakePage />} />
          <Route path="/resources" element={<ResourceCataloguePage />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/app/plans" element={<ActionPlanPage />} />
          <Route path="/app/plans/:id" element={<ActionPlanPage />} />
          <Route path="/community-partners" element={<CommunityPartnersPage />} />
          <Route path="/admin" element={<AdminQueuePage />} />
          <Route path="/resource-standards" element={<StandardsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
