import { useApp } from "../context/AppContext";
import { Card, Badge, StatusDot, timeAgo, Empty } from "../components/UI";

const PRODUCT_COLORS = ["#C9A96E", "#4ECDC4", "#45B7D1", "#A855F7", "#FF6B6B"];

export default function Dashboard({ onNavigate }) {
  const { alerts, products, pendingCount } = useApp();

  const approved = alerts.filter(a => a.status === "approved").length;
  const rate = alerts.length ? Math.round(approved / alerts.length * 100) : 0;

  const stats = [
    { icon: "🔔", label: "إجمالي التنبيهات", value: alerts.length, color: "#C9A96E" },
    { icon: "💬", label: "ردود منشورة", value: approved, color: "#4ECDC4" },
    { icon: "⏳", label: "بانتظار مراجعة", value: pendingCount, color: "#FF6B6B" },
    { icon: "📊", label: "نسبة الموافقة", value: rate + "%", color: "#A855F7" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding: 16 }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: 26, fontWeight: 700, marginBottom: 3 }}>{s.value}</div>
            <div style={{ color: "#333", fontSize: 11 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>

        {/* Recent Alerts */}
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ color: "#555", fontSize: 12 }}>آخر التنبيهات</span>
            <button onClick={() => onNavigate("alerts")} style={{
              background: "none", border: "none", color: "#C9A96E", fontSize: 11, cursor: "pointer",
            }}>عرض الكل ←</button>
          </div>
          {alerts.length === 0
            ? <Empty icon="◉" message="لا يوجد تنبيهات بعد" />
            : alerts.slice(0, 5).map(a => (
              <div key={a.id} onClick={() => onNavigate("alerts")} style={{
                display: "flex", gap: 9, padding: "8px 0",
                borderBottom: "1px solid #0F0F1A", cursor: "pointer", alignItems: "flex-start",
              }}>
                <StatusDot status={a.status} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#666", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.original_post}
                  </div>
                  <div style={{ color: "#282838", fontSize: 10, marginTop: 1 }}>
                    {a.author_handle} · {timeAgo(a.created_at)}
                  </div>
                </div>
              </div>
            ))
          }
        </Card>

        {/* Products Performance */}
        <Card style={{ padding: 16 }}>
          <div style={{ color: "#555", fontSize: 12, marginBottom: 14 }}>أداء المنتجات</div>
          {products.length === 0
            ? <Empty icon="◇" message="أضف منتجاً للبدء" />
            : products.slice(0, 5).map((p, i) => {
              const c = PRODUCT_COLORS[i % PRODUCT_COLORS.length];
              const pct = Math.floor(Math.random() * 30) + 60;
              return (
                <div key={p.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: "#aaa", fontSize: 12 }}>{p.name}</span>
                    <span style={{ color: c, fontSize: 11 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 3, background: "#161622", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: pct + "%", background: c, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })
          }
        </Card>
      </div>

      {/* CTA */}
      {pendingCount > 0 && (
        <Card style={{
          padding: "16px 20px",
          background: "rgba(201,169,110,0.04)",
          border: "1px solid rgba(201,169,110,0.18)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ color: "#C9A96E", fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
              ✦ {pendingCount} {pendingCount === 1 ? "رد ينتظر" : "ردود تنتظر"} مراجعتك
            </div>
            <div style={{ color: "#333", fontSize: 12 }}>راجع وأدر الردود قبل نشرها على منصة X</div>
          </div>
          <button onClick={() => onNavigate("alerts")} style={{
            padding: "9px 18px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg,#C9A96E,#8B6914)",
            color: "#000", fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", fontSize: 13,
          }}>مراجعة الآن</button>
        </Card>
      )}
    </div>
  );
}
