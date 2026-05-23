import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Button, Input } from "../components/UI";

const PLAN_META = {
  trial:   { label: "تجريبية", color: "#888",    credits: 20 },
  starter: { label: "ناشئ",   color: "#C9A96E",  credits: 100 },
  growth:  { label: "نمو",    color: "#4ECDC4",  credits: 400 },
  store:   { label: "متجر",   color: "#A855F7",  credits: 9999 },
};

export default function Settings() {
  const { connected, refresh } = useApp();
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  const connections = [
    { name: "Supabase — قاعدة البيانات",    ok: connected,  note: "ypyrufojozdkmtoqwlgj" },
    { name: "Anthropic API — توليد الردود",  ok: true,       note: "claude-sonnet-4" },
    { name: "X API — رصد التغريدات",         ok: false,      note: "غير مُعد بعد" },
    { name: "Telegram Bot — الإشعارات",      ok: false,      note: "غير مُعد بعد" },
  ];

  const handleTest = async () => {
    setTesting(true);
    await refresh();
    setTesting(false);
  };

  return (
    <div style={{ maxWidth: 580, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ color: "#ddd", fontSize: 17, marginBottom: 3 }}>الإعدادات</h2>
        <p style={{ color: "#444", fontSize: 12 }}>حالة الاتصال بالخدمات وإدارة الحساب</p>
      </div>

      {/* Connection Status */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ color: "#555", fontSize: 12 }}>حالة الاتصال</span>
          <Button onClick={handleTest} variant="secondary" size="sm" disabled={testing}>
            {testing ? "جاري الفحص..." : "↺ فحص الاتصال"}
          </Button>
        </div>
        {connections.map(c => (
          <div key={c.name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 0", borderBottom: "1px solid #0F0F1A",
          }}>
            <div>
              <div style={{ color: "#aaa", fontSize: 13 }}>{c.name}</div>
              <div style={{ color: "#2A2A3A", fontSize: 10, marginTop: 2 }}>{c.note}</div>
            </div>
            <span style={{
              fontSize: 11, padding: "2px 9px", borderRadius: 20,
              background: c.ok ? "rgba(78,205,196,0.08)" : "rgba(255,255,255,0.02)",
              color: c.ok ? "#4ECDC4" : "#444",
              border: `1px solid ${c.ok ? "rgba(78,205,196,0.2)" : "#161622"}`,
            }}>{c.ok ? "✓ متصل" : "غير مُعد"}</span>
          </div>
        ))}
      </Card>

      {/* Next Steps */}
      <Card style={{
        padding: 16,
        background: "rgba(201,169,110,0.03)",
        border: "1px solid rgba(201,169,110,0.12)",
      }}>
        <div style={{ color: "#C9A96E", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
          الخطوات التالية لاكتمال الإعداد
        </div>
        {[
          { step: "1", title: "إعداد X API", desc: "للرصد التلقائي لتغريدات السوق السعودي", done: false },
          { step: "2", title: "إنشاء Telegram Bot", desc: "لاستقبال التنبيهات الفورية", done: false },
          { step: "3", title: "بناء سيناريو Make.com", desc: "لأتمتة دورة الرصد والتوليد والتنبيه", done: false },
          { step: "4", title: "نشر على Vercel", desc: "لمشاركة المنصة مع العملاء", done: false },
        ].map(item => (
          <div key={item.step} style={{
            display: "flex", gap: 12, padding: "9px 0",
            borderBottom: "1px solid #0F0F1A", alignItems: "flex-start",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              background: item.done ? "#4ECDC4" : "#161622",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: item.done ? "#000" : "#444", fontSize: 10, fontWeight: 700,
            }}>{item.done ? "✓" : item.step}</div>
            <div>
              <div style={{ color: item.done ? "#4ECDC4" : "#888", fontSize: 13 }}>{item.title}</div>
              <div style={{ color: "#333", fontSize: 11, marginTop: 2 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Plans */}
      <Card style={{ padding: 16 }}>
        <div style={{ color: "#555", fontSize: 12, marginBottom: 14 }}>باقات الاشتراك</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(PLAN_META).map(([key, plan]) => (
            <div key={key} style={{
              background: "#06060D", borderRadius: 8,
              padding: "11px 13px",
              border: `1px solid ${plan.color}20`,
            }}>
              <div style={{ color: plan.color, fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{plan.label}</div>
              <div style={{ color: "#444", fontSize: 11 }}>
                {plan.credits === 9999 ? "غير محدود" : `${plan.credits} تنبيه/شهر`}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
