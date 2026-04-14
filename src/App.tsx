import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { TabNav } from "./components/layout/TabNav";
import type { TabId } from "./components/layout/TabNav";
import { Footer } from "./components/layout/Footer";
import { Dashboard } from "./features/dashboard/Dashboard";
import { ContentMachine } from "./features/content/ContentMachine";
import { MoneyTracker } from "./features/money/MoneyTracker";
import { VitaPersonale } from "./features/life/VitaPersonale";
import { BrandDeals } from "./features/brands/BrandDeals";
import { LoginPage } from "./features/auth/LoginPage";
import { useAuth } from "./context/AuthContext";
import { useApp } from "./context/AppContext";
import {
  requestNotificationPermission,
  startReminderScheduler,
  stopReminderScheduler,
} from "./lib/notifications";

export default function App() {
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
          background: "var(--bg-deep)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-primary)",
          fontFamily: "var(--font-body)",
        }}
      >
        <div style={{ textAlign: "center", animation: "fadeIn 0.6s ease" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(135deg, var(--accent), #d4922f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              margin: "0 auto 16px",
              boxShadow: "0 4px 24px rgba(229, 166, 59, 0.3)",
            }}
          >
            ⚡
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              fontWeight: 400,
            }}
          >
            Caricamento...
          </div>
        </div>
      </div>
    );
  }

  if (isConfigured && !user) {
    return <LoginPage />;
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
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        color: "var(--text-primary)",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "22px 24px 0",
          borderBottom: "1px solid var(--border-subtle)",
          backdropFilter: "blur(16px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(8, 11, 20, 0.85)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <Header />
          {isConfigured && user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  maxWidth: 130,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </span>
              <button
                onClick={signOut}
                style={{
                  padding: "5px 12px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border-medium)",
                  background: "none",
                  color: "var(--text-secondary)",
                  fontSize: 10,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  transition: "all 0.2s ease",
                }}
              >
                Esci
              </button>
            </div>
          )}
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <TabNav active={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "28px 24px",
          maxWidth: 720,
          margin: "0 auto",
          animation: "fadeInUp 0.4s ease",
        }}
        key={activeTab}
      >
        {renderContent()}
      </div>

      <Footer />
    </div>
  );
}
