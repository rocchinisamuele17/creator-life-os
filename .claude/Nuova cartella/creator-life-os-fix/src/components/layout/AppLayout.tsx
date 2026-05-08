import { useState, useEffect } from "react";
import { Header } from "./Header";
import { TabNav } from "./TabNav";
import type { TabId } from "./TabNav";
import { Footer } from "./Footer";
import { Dashboard } from "../../features/dashboard/Dashboard";
import { ContentMachine } from "../../features/content/ContentMachine";
import { MoneyTracker } from "../../features/money/MoneyTracker";
import { VitaPersonale } from "../../features/life/VitaPersonale";
import { BrandDeals } from "../../features/brands/BrandDeals";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { Navigate } from "react-router-dom";
import {
  requestNotificationPermission,
  startReminderScheduler,
  stopReminderScheduler,
} from "../../lib/notifications";

export function AppLayout() {
  const { user, loading, signOut, isConfigured } = useAuth();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

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
        <div style={{ textAlign: "center" }} role="status" aria-live="polite">
          <div className="animate-glow animate-float" style={{ fontSize: 32, marginBottom: 12 }} aria-hidden="true">
            ⚡
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            Apertura ecosistema...
          </div>
        </div>
      </div>
    );
  }

  if (isConfigured && !user) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "content":
        return <ContentMachine />;
      case "money":
        return <MoneyTracker />;
      case "life":
        return <VitaPersonale />;
      case "brands":
        return <BrandDeals />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      {/* Skip link */}
      <a href="#app-content" className="skip-link">
        Vai al contenuto principale
      </a>

      <header className="app-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Header />
          {isConfigured && user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="premium-btn secondary"
                style={{ padding: "6px 12px", fontSize: 12 }}
                aria-label="Esci dall'account"
              >
                Esci
              </button>
            </div>
          )}
        </div>
        <TabNav active={activeTab} onChange={setActiveTab} />
      </header>

      <main
        id="app-content"
        className="app-content"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}
