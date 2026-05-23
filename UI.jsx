export function Badge({ label, color = "#C9A96E", size = "sm" }) {
  const padding = size === "sm" ? "2px 8px" : "4px 12px";
  const fontSize = size === "sm" ? 10 : 12;
  return (
    <span style={{
      fontSize, padding, borderRadius: 20, fontWeight: 600,
      background: color + "15", color, border: `1px solid ${color}25`,
      display: "inline-block", lineHeight: 1.6,
    }}>{label}</span>
  );
}

export function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 36, height: 20, borderRadius: 10, cursor: "pointer",
      background: value ? "#4ECDC4" : "#1A1A28",
      position: "relative", transition: "background .2s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, right: value ? 3 : 17,
        width: 14, height: 14, borderRadius: "50%",
        background: "#fff", transition: "right .2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }} />
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#0B0B14", border: "1px solid #1A1A28",
      borderRadius: 12, ...style,
    }}>{children}</div>
  );
}

export function Button({ children, onClick, variant = "primary", disabled = false, fullWidth = false, size = "md" }) {
  const padding = size === "sm" ? "6px 12px" : size === "lg" ? "12px 24px" : "9px 18px";
  const fontSize = size === "sm" ? 12 : size === "lg" ? 15 : 13;
  const styles = {
    primary: { background: disabled ? "#1A1A28" : "linear-gradient(135deg,#C9A96E,#8B6914)", color: disabled ? "#444" : "#000", border: "none" },
    secondary: { background: "transparent", color: "#888", border: "1px solid #1A1A28" },
    danger: { background: "transparent", color: "#FF6B6B", border: "1px solid #FF6B6B25" },
    success: { background: "linear-gradient(135deg,#4ECDC4,#2EAF9F)", color: "#000", border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding, fontSize, borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit", fontWeight: 600, transition: "all .2s",
      width: fullWidth ? "100%" : "auto",
      ...styles[variant],
    }}>{children}</button>
  );
}

export function Input({ label, value, onChange, placeholder, type = "text", disabled = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ color: "#555", fontSize: 11 }}>{label}</label>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        style={{
          background: "#06060D", border: "1px solid #1A1A28", borderRadius: 8,
          padding: "9px 12px", color: disabled ? "#555" : "#ddd", fontSize: 13,
          direction: "rtl", fontFamily: "inherit", outline: "none",
          width: "100%", boxSizing: "border-box",
          transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = "#C9A96E"}
        onBlur={e => e.target.style.borderColor = "#1A1A28"}
      />
    </div>
  );
}

export function Textarea({ label, value, onChange, placeholder, rows = 3, disabled = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ color: "#555", fontSize: 11 }}>{label}</label>}
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows} disabled={disabled}
        style={{
          background: "#06060D", border: "1px solid #1A1A28", borderRadius: 8,
          padding: "9px 12px", color: disabled ? "#555" : "#ddd", fontSize: 13,
          direction: "rtl", fontFamily: "inherit", outline: "none", resize: "vertical",
          width: "100%", boxSizing: "border-box", lineHeight: 1.8,
          transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = "#C9A96E"}
        onBlur={e => e.target.style.borderColor = "#1A1A28"}
      />
    </div>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ color: "#555", fontSize: 11 }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        background: "#06060D", border: "1px solid #1A1A28", borderRadius: 8,
        padding: "9px 12px", color: "#ddd", fontSize: 13,
        fontFamily: "inherit", outline: "none", cursor: "pointer",
        width: "100%", boxSizing: "border-box",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "2px solid #1A1A28", borderTopColor: "#C9A96E",
        animation: "spin .7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function Empty({ icon = "◈", message }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "#333" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 13 }}>{message}</div>
    </div>
  );
}

export function StatusDot({ status }) {
  const colors = { pending: "#C9A96E", approved: "#4ECDC4", rejected: "#FF6B6B", posted: "#A855F7" };
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors[status] || "#555", display: "inline-block", flexShrink: 0 }} />;
}

export function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
  return `منذ ${Math.floor(diff / 86400)} يوم`;
}
