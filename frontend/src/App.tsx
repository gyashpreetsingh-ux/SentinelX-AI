import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { BehaviorPage } from './pages/BehaviorPage';
import { HoneypotsPage } from './pages/HoneypotsPage';
import { RiskEnginePage } from './pages/RiskEnginePage';
import { IncidentsPage } from './pages/IncidentsPage';
import { IncidentDetailPage } from './pages/IncidentDetailPage';
import { EndpointsPage } from './pages/EndpointsPage';
import { EndpointDetailPage } from './pages/EndpointDetailPage';
import { ResponsePage } from './pages/ResponsePage';
import { PhishingPage } from './pages/PhishingPage';
import { ThreatIntelPage } from './pages/ThreatIntelPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AuditPage } from './pages/AuditPage';
import { SimulationPage } from './pages/SimulationPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-950 flex items-center justify-center text-cyan-400 font-mono text-xs">
        VERIFYING SESSION CONTEXT...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated SOC Console Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/behavior" element={<BehaviorPage />} />
              <Route path="/honeypots" element={<HoneypotsPage />} />
              <Route path="/risk-engine" element={<RiskEnginePage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/incidents/:id" element={<IncidentDetailPage />} />
              <Route path="/endpoints" element={<EndpointsPage />} />
              <Route path="/endpoints/:id" element={<EndpointDetailPage />} />
              <Route path="/response" element={<ResponsePage />} />
              <Route path="/phishing" element={<PhishingPage />} />
              <Route path="/threat-intelligence" element={<ThreatIntelPage />} />
              <Route path="/policies" element={<PoliciesPage />} />
              <Route path="/audit" element={<AuditPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/architecture" element={<ArchitecturePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
