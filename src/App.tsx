import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Lazy Routes
import { LoginPage } from "./features/auth/LoginPage";
import LandingPage from "./pages/LandingPage";
const AppLayout = lazy(() => import("./components/layout/AppLayout").then(m => ({ default: m.AppLayout })));
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
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505", color: "#00f0ff", fontSize: "32px", fontWeight: "bold" }}>
      ⚡ PRODIGI.LIVE - TEST SYSTEM ONLINE ⚡
    </div>
  );
}
