import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { ToastContainer, toast } from "../ui/Toast";
import { Header } from "./Header";
import { TabNav } from "./TabNav";
import type { TabId } from "./TabNav";
import { Footer } from "./Footer";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  requestNotificationPermission,
  startReminderScheduler,
  stopReminderScheduler,
} from "../../lib/notifications";

// Lazy Loaded Features
const Dashboard = lazy(() => import("../../features/dashboard/Dashboard").then(m => ({ default: m.Dashboard })));
const ContentMachine = lazy(() => import("../../features/content/ContentMachine").then(m => ({ default: m.ContentMachine })));
const PreviewStudio = lazy(() => import("../../features/preview/PreviewStudio").then(m => ({ default: m.PreviewStudio })));
const MoneyTracker = lazy(() => import("../../features/money/MoneyTracker").then(m => ({ default: m.MoneyTracker })));
const VitaPersonale = lazy(() => import("../../features/life/VitaPersonale").then(m => ({ default: m.VitaPersonale })));
const BrandDeals = lazy(() => import("../../features/brands/BrandDeals").then(m => ({ default: m.BrandDeals })));
const Settings = lazy(() => import("../../features/settings/Settings").then(m => ({ default: m.Settings })));
const AdminDashboard = lazy(() => import("../../features/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AICopilot = lazy(() => import("../../features/ai/AICopilot").then(m => ({ default: m.AICopilot })));

// Loading Component
function FeatureLoading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px 0", color: "rgba(255,255,255,0.3)" }}>
      <div className="animate-glow" style={{ fontSize: 24 }}>⚡</div>
    </div>
  );
}

export function AppLayout() {
  const { user, loading, signOut, isConfigured } = useAuth();
  const { state, setState } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  const showToast = (msg: string, type: any = "success") => toast(msg, type);

  const bgStyle = useMemo(() => {
    const config = state.settings?.background;
    if (!config || config.type === "default") {
      return { backgroundImage: "url('/bg-dark-neon.png')", backgroundColor: "#050505" };
    }
    if (config.type === "photo") {
      return { backgroundImage: `url("${config.value}")`, backgroundColor: "#050505" };
    }
    if (config.type === "gradient") {
      return { backgroundImage: config.value, backgroundColor: "#050505" };
    }
    if (config.type === "solid") {
      return { backgroundColor: config.value, backgroundImage: "none" };
    }
    return { backgroundImage: "url('/bg-dark-neon.png')", backgroundColor: "#050505" };
  }, [state.settings?.background]);

  // Daily reset check for routine
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    // If the last date a streak was recorded or the user logged in isn't today, reset the routine
    if (state.checkedRoutine && state.checkedRoutine.length > 0 && state.streak?.lastDate !== today) {
      // Note: we only reset if it's NOT today. 
      // If we want a strict reset, we could use a separate "lastResetDate" field.
      // For now, if streak.lastDate isn't today, it's a new day or we missed a day.
      setState(s => ({ ...s, checkedRoutine: [] }));
    }
  }, [state.streak?.lastDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Start reminder scheduler
  useEffect(() => {
    requestNotificationPermission();
    startReminderScheduler(() => state.reminders ?? []);
    return () => stopReminderScheduler();
  }, [state.reminders]);

  if (isConfigured && loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="animate-glow animate-float" style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            Apertura ecosistema...
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if user is missing
  if (isConfigured && !user) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "content":
        return <ContentMachine />;
      case "preview":
        return <PreviewStudio />;
      case "money":
        return <MoneyTracker />;
      case "life":
        return <VitaPersonale state={state} setState={setState} showToast={showToast} />;
      case "brands":
        return <BrandDeals state={state} setState={setState} showToast={showToast} />;
      case "settings":
        return <Settings state={state} setState={setState} showToast={showToast} />;
      case "admin":
        return <AdminDashboard />;
      case "ai":
        return <AICopilot showToast={showToast} />;
      default:
        return <Dashboard />;
    }
  };
  // Apply background to document.body
  useEffect(() => {
    const body = document.body;
    
    // Reset defaults first
    body.style.backgroundImage = "none";
    body.style.backgroundColor = "#050505";

    if (bgStyle.backgroundImage) {
      body.style.backgroundImage = bgStyle.backgroundImage;
    }
    if (bgStyle.backgroundColor) {
      body.style.backgroundColor = bgStyle.backgroundColor;
    }

    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundAttachment = "fixed";

    return () => {
      // Optional: reset on unmount, but usually we want it to persist across the app
    };
  }, [bgStyle]);

  return (
    <div style={{ 
      minHeight: "100vh",
      paddingBottom: "calc(20px + var(--safe-bottom))",
      position: "relative",
      overflowX: "hidden"
    }}>
      {/* Overlay scuro per leggibilità testi su sfondi chiari */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div
        style={{
          padding: "calc(12px + var(--safe-top)) 16px 0",
          borderBottom: "1px solid var(--glass-border)",
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            flexWrap: "wrap",
            gap: 8
          }}
        >
          <Header />
          {isConfigured && user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div 
                className="animate-glow"
                style={{
                  background: "var(--accent-gradient)",
                  color: "#000",
                  padding: "4px 8px",
                  borderRadius: 12,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                🚀 {state.streak?.count || 0} gg
              </div>
              <button
                onClick={signOut}
                className="premium-btn secondary"
                style={{ padding: "4px 8px", fontSize: 10, minHeight: 32 }}
              >
                Esci
              </button>
            </div>
          )}
        </div>
        <TabNav active={activeTab} onChange={setActiveTab} />
      </div>

      <div style={{ 
        padding: "24px 16px", 
        maxWidth: 1000, 
        margin: "0 auto",
        width: "100%"
      }}>
        <Suspense fallback={<FeatureLoading />}>
          {renderContent()}
        </Suspense>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
}
