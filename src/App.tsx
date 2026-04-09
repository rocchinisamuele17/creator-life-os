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

  // Start reminder scheduler
  useEffect(() => {
    requestNotificationPermission();
    startReminderScheduler(() => state.reminders ?? []);
    return () => stopReminderScheduler();
  }, [state.reminders]);

  // If Supabase is configured, require auth
  if (isConfigured && loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
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
    <div style={{ minHeight: "100vh", background: "#0a0a0b", color: "#fff" }}>
      <div
        style={{
          padding: "20px 20px 0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
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
                  color: "rgba(255,255,255,0.35)",
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
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "none",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Esci
              </button>
            </div>
          )}
        </div>
        <TabNav active={activeTab} onChange={setActiveTab} />
      </div>

      <div style={{ padding: 20, maxWidth: 680, margin: "0 auto" }}>
        {renderContent()}
      </div>

      <Footer />
    </div>
  );
}
