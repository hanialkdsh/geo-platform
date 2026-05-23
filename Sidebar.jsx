import { useState } from "react";

const NAV = [
  { id: "dashboard", icon: "◈", label: "لوحة التحكم" },
  { id: "alerts",    icon: "◉", label: "التنبيهات" },
  { id: "products",  icon: "◇", label: "المنتجات" },
  { id: "generate",  icon: "✦", label: "توليد رد" },
  { id: "reports",   icon: "◫", label: "التقارير" },
  { id: "settings",  icon: "⚙", label: "الإعدادات" },
];

export default function Sidebar({ active, onNavigate, pendingCount, connected }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? 58 : 212,
      flexShrink: 0,
      background: "#07070E",
      borderLeft: "1px solid #161622",
      display: "flex",
      flexDirection: "column",
      transition: "width .25s cubic-bezier(.4,0,.2,1)",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "18px 0" : "18px 16px",
        borderBottom: "1px solid #161622",
        display: "flex", alignItems: "center",
        gap: 10, justifyContent: collapsed ? "center" : "flex-start",
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7, flexShrink: 0,
          background: "linear-gradient(135deg,#C9A96E,#7A5A0A)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#000", fontWeight: 800, fontSize: 15,
        }}>أ</div>
        {!collapsed && (
          <div>
            <div style={{ color: "#E8E8E8", fontWeight: 700, fontSize: 13, lineHeight: 1 }}>أتمتة</div>
            <div style={{ color: "#C9A96E", fontSize: 8, letterSpacing: 1.5, marginTop: 2 }}>GEO PLATFORM</div>
          </div>
        )}
      </div>

      {/* Connection status */}
      {!collapsed && (
        <div style={{
          margin: "10px 10px 0",
          padding: "5px 10px",
          borderRadius: 6,
          background: connected ? "rgba(78,205,196,0.06)" : "rgba(201,169,110,0.06)",
          border: `1px solid ${connected ? "rgba(78,205,196,0.15)" : "rgba(201,169,110,0.15)"}`,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: connected ? "#4ECDC4" : "#C9A96E",
            animation: connected ? "none" : "pulse 2s infinite",
          }} />
          <span style={{ fontSize: 10, color: connected ? "#4ECDC4" : "#C9A96E" }}>
            {connected ? "Supabase متصل" : "وضع تجريبي"}
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 6px" }}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: 9, padding: collapsed ? "10px 0" : "9px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 8, border: "none", cursor: "pointer",
              marginBottom: 2, position: "relative",
              background: isActive ? "rgba(201,169,110,0.1)" : "transparent",
              color: isActive ? "#C9A96E" : "#3A3A4E",
              transition: "all .15s",
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize: 13 }}>{item.label}</span>}
              {item.id === "alerts" && pendingCount > 0 && !collapsed && (
                <span style={{
                  marginRight: "auto", background: "#C9A96E", color: "#000",
                  borderRadius: 10, fontSize: 9, padding: "1px 6px", fontWeight: 800,
                }}>{pendingCount}</span>
              )}
              {item.id === "alerts" && pendingCount > 0 && collapsed && (
                <span style={{
                  position: "absolute", top: 5, right: 5,
                  width: 7, height: 7, background: "#C9A96E", borderRadius: "50%",
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(p => !p)} style={{
        margin: "6px", padding: "8px", borderRadius: 8,
        border: "1px solid #161622", background: "transparent",
        color: "#2A2A3A", cursor: "pointer", fontSize: 11, transition: "color .15s",
      }}
        onMouseEnter={e => e.target.style.color = "#555"}
        onMouseLeave={e => e.target.style.color = "#2A2A3A"}
      >{collapsed ? "▸" : "◂"}</button>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </aside>
  );
}
