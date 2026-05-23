import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Products from "./pages/Products";
import Generate from "./pages/Generate";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const PAGE_TITLES = {
  dashboard: "لوحة التحكم",
  alerts:    "التنبيهات",
  products:  "المنتجات",
  generate:  "توليد رد مخصص",
  reports:   "التقارير",
  settings:  "الإعدادات",
};

function Shell() {
  const [page, setPage] = useState("dashboard");
  const { pendingCount, connected, refresh, loading } = useApp();

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} />,
    alerts:    <Alerts />,
    products:  <Products />,
    generate:  <Generate />,
    reports:   <Reports />,
    settings:  <Settings />,
  };

  return (
    <div style={{
      display: "flex", height: "100vh",
      background: "#06060D",
      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
      direction: "rtl", overflow: "hidden",
    }}>
      <Sidebar
        active={page}
        onNavigate={setPage}
        pendingCount={pendingCount}
        connected={connected}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{
          padding: "13px 22px",
          borderBottom: "1px solid #0F0F1A",
          background: "#06060D",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <h1 style={{ color: "#ccc", fontSize: 14, fontWeight: 600 }}>
            {PAGE_TITLES[page]}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {pendingCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#C9A96E", fontSize: 11 }}>
                <span style={{
                  width: 5, height: 5, background: "#C9A96E",
                  borderRadius: "50%", animation: "pulse 1.8s infinite",
                }} />
                {pendingCount} تنبيه جديد
              </div>
            )}

            <button onClick={refresh} disabled={loading} style={{
              padding: "5px 11px", borderRadius: 7,
              border: "1px solid #1A1A28", background: "transparent",
              color: loading ? "#2A2A3A" : "#444", cursor: loading ? "not-allowed" : "pointer",
              fontSize: 11, transition: "color .15s",
            }}>↺ تحديث</button>

            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg,#C9A96E,#7A5A0A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#000", fontSize: 12, fontWeight: 800,
            }}>م</div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "auto", padding: "20px 22px" }}>
          <div style={{ animation: "fadeIn .25s ease" }}>
            {pages[page]}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #06060D; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1A1A28; border-radius: 2px; }
        input, textarea, select, button { font-family: 'IBM Plex Sans Arabic', sans-serif !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <AppProvider>
        <Shell />
      </AppProvider>
    </>
  );
}
