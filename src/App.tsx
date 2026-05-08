import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Lazy Routes
const LoginPage = lazy(() => import("./features/auth/LoginPage").then(m => ({ default: m.LoginPage })));
const AppLayout = lazy(() => import("./components/layout/AppLayout").then(m => ({ default: m.AppLayout })));
const LandingPage = lazy(() => import("./pages/LandingPage").then(m => ({ default: m.default })));
const TermsPage = lazy(() => import("./pages/Terms").then(m => ({ default: m.default })));
const PrivacyPage = lazy(() => import("./pages/Privacy").then(m => ({ default: m.default })));
const CookiePage = lazy(() => import("./pages/Cookies").then(m => ({ default: m.default })));
const PricingPage = lazy(() => import("./pages/PricingPage").then(m => ({ default: m.default })));
function PageLoading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505" }}>
      <div className="animate-glow" style={{ fontSize: 32 }}>⚡</div>
    </div>
  );
}

export default function App() {
  const { user, isConfigured } = useAuth();
  
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route 
            path="/" 
            element={isConfigured && user ? <Navigate to="/app" replace /> : <LandingPage />} 
          />
          <Route 
            path="/login" 
            element={isConfigured && user ? <Navigate to="/app" replace /> : <LoginPage />} 
          />
          <Route path="/termini" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookie" element={<CookiePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route 
            path="/app/*" 
            element={<AppLayout />} 
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
