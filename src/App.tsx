import { useState } from "react";
import { Header } from "./components/layout/Header";
import { TabNav } from "./components/layout/TabNav";
import type { TabId } from "./components/layout/TabNav";
import { Footer } from "./components/layout/Footer";
import { Dashboard } from "./features/dashboard/Dashboard";
import { ContentMachine } from "./features/content/ContentMachine";
import { MoneyTracker } from "./features/money/MoneyTracker";
import { VitaPersonale } from "./features/life/VitaPersonale";
import { BrandDeals } from "./features/brands/BrandDeals";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

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
        <Header />
        <TabNav active={activeTab} onChange={setActiveTab} />
      </div>

      <div style={{ padding: 20, maxWidth: 680, margin: "0 auto" }}>
        {renderContent()}
      </div>

      <Footer />
    </div>
  );
}
