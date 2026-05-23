import { useApp } from "../context/AppContext";
import { Card } from "../components/UI";

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const MOCK_DAILY = [4, 7, 6, 9, 11, 8, 2];
const MOCK_REPLIES = [3, 5, 4, 7, 8, 6, 1];

function BarChart({ data1, data2, labels }) {
  const max = Math.max(...data1, ...data2, 1);
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 110 }}>
      {labels.map((label, i) => (
        <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 90 }}>
            <div style={{
              flex: 1, background: "rgba(201,169,110,0.25)", borderRadius: "3px 3px 0 0",
              height: `${(data1[i] / max) * 88}px`, transition: "height .7s ease",
              minHeight: data1[i] > 0 ? 3 : 0,
            }} />
            <div style={{
              flex: 1, background: "#4ECDC4", borderRadius: "3px 3px 0 0",
              height: `${(data2[i] / max) * 88}px`, transition: "height .7s ease",
              minHeight: data2[i] > 0 ? 3 : 0,
            }} />
          </div>
          <div style={{ color: "#2A2A3A", fontSize: 8 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, color, sub }) {
  return (
    <Card style={{ padding: 14 }}>
      <div style={{ color: "#444", fontSize: 11, marginBottom: 7 }}>{label}</div>
      <div style={{ color, fontSize: 22, fontWeight: 700, marginBottom: 3 }}>{value}</div>
      {sub && <div style={{ color: "#2A2A3A", fontSize: 10 }}>{sub}</div>}
    </Card>
  );
}

export default function Reports() {
  const { alerts, products } = useApp();

  const approved = alerts.filter(a => a.status === "approved").length;
  const pending = alerts.filter(a => a.status === "pending").length;
  const rejected = alerts.filter(a => a.status === "rejected").length;
  const total = alerts.length;
  const convRate = total ? Math.round(approved / total * 100) : 0;
  const estImpressions = approved * 850;

  const topProduct = products.find(p => p.is_active) || null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h2 style={{ color: "#ddd", fontSize: 17, marginBottom: 3 }}>التقارير</h2>
        <p style={{ color: "#444", fontSize: 12 }}>أداء المنصة خلال الأسبوع الماضي</p>
      </div>

      {/* Bar chart */}
      <Card style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "#555", fontSize: 12 }}>التنبيهات مقابل الردود المنشورة (أسبوعي)</span>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#555", fontSize: 10 }}>
              <span style={{ width: 8, height: 8, background: "rgba(201,169,110,0.25)", borderRadius: 2 }} />
              تنبيهات
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#555", fontSize: 10 }}>
              <span style={{ width: 8, height: 8, background: "#4ECDC4", borderRadius: 2 }} />
              ردود منشورة
            </span>
          </div>
        </div>
        <BarChart data1={MOCK_DAILY} data2={MOCK_REPLIES} labels={DAYS} />
      </Card>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatCard label="إجمالي التنبيهات" value={total} color="#C9A96E" sub="هذا الأسبوع" />
        <StatCard label="ردود موافق عليها" value={approved} color="#4ECDC4" sub={`${pending} بانتظار المراجعة`} />
        <StatCard label="نسبة التحويل" value={convRate + "%"} color="#A855F7" sub={`${rejected} مرفوض`} />
        <StatCard label="وصول تقديري" value={estImpressions.toLocaleString()} color="#45B7D1" sub="impression" />
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card style={{ padding: 16 }}>
          <div style={{ color: "#555", fontSize: 12, marginBottom: 12 }}>توزيع حالات التنبيهات</div>
          {[
            { label: "بانتظار المراجعة", value: pending, color: "#C9A96E", total },
            { label: "موافق عليها", value: approved, color: "#4ECDC4", total },
            { label: "مرفوضة", value: rejected, color: "#FF6B6B", total },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#888", fontSize: 12 }}>{item.label}</span>
                <span style={{ color: item.color, fontSize: 12, fontWeight: 600 }}>{item.value}</span>
              </div>
              <div style={{ height: 3, background: "#161622", borderRadius: 2 }}>
                <div style={{
                  height: "100%", background: item.color, borderRadius: 2,
                  width: item.total ? `${Math.round(item.value / item.total * 100)}%` : "0%",
                  transition: "width .8s ease",
                }} />
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ padding: 16 }}>
          <div style={{ color: "#555", fontSize: 12, marginBottom: 12 }}>ملخص الأداء</div>
          {[
            { label: "أكثر منتج نشاطاً", value: topProduct?.name || "—", color: "#C9A96E" },
            { label: "متوسط نقاط الصلة", value: alerts.length ? Math.round(alerts.reduce((s, a) => s + (a.relevance_score || 0), 0) / alerts.length) + "%" : "—", color: "#4ECDC4" },
            { label: "المنتجات النشطة", value: products.filter(p => p.is_active).length, color: "#45B7D1" },
            { label: "إجمالي الكلمات المفتاحية", value: products.reduce((s, p) => s + (p.keywords?.length || 0), 0), color: "#A855F7" },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "8px 0", borderBottom: "1px solid #0F0F1A",
              alignItems: "center",
            }}>
              <span style={{ color: "#666", fontSize: 12 }}>{item.label}</span>
              <span style={{ color: item.color, fontSize: 13, fontWeight: 700 }}>{item.value}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
