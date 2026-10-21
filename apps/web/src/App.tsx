import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { ResourceCataloguePage } from './pages/ResourceCataloguePage';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { FindSupportIntakePage } from './pages/FindSupportIntakePage';
import { DashboardPage } from './pages/DashboardPage';
import { CommunityPartnersPage } from './pages/CommunityPartnersPage';
import { StandardsPage } from './pages/StandardsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPage, TermsPage } from './pages/PrivacyTermsPages';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

import { useLocation } from 'react-router-dom';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/app') || location.pathname.startsWith('/admin');

  if (isDashboardRoute) {
    return (
      <Routes>
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bb-bg text-bb-ink">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/find-support" element={<FindSupportIntakePage />} />
          <Route path="/resources" element={<ResourceCataloguePage />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/community-partners" element={<CommunityPartnersPage />} />
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
