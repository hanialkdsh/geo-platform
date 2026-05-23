import { useState } from "react";
import { useApp } from "../context/AppContext";
import { generateReply } from "../services/anthropic";
import { Card, Button, Badge, Empty, Spinner, timeAgo } from "../components/UI";

const STATUS_META = {
  pending:  { label: "بانتظار المراجعة", color: "#C9A96E" },
  approved: { label: "موافق عليه",       color: "#4ECDC4" },
  rejected: { label: "مرفوض",            color: "#FF6B6B" },
  posted:   { label: "تم النشر",         color: "#A855F7" },
};

function AlertCard({ alert }) {
  const { approveAlert, rejectAlert, updateAlertReply } = useApp();
  const [reply, setReply] = useState(alert.suggested_reply || "");
  const [regenLoading, setRegenLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const meta = STATUS_META[alert.status] || STATUS_META.pending;
  const isPending = alert.status === "pending";

  const handleApprove = async () => {
    setActionLoading(true);
    try { await approveAlert(alert.id, reply); } catch {}
    setActionLoading(false);
  };

  const handleReject = async () => {
    setActionLoading(true);
    try { await rejectAlert(alert.id); } catch {}
    setActionLoading(false);
  };

  const handleRegen = async () => {
    setRegenLoading(true);
    try {
      const r = await generateReply({
        post: alert.original_post,
        productName: alert.products?.name || "المنتج",
        dialect: alert.products?.dialect || "نجدي",
      });
      setReply(r);
      updateAlertReply(alert.id, r);
    } catch {}
    setRegenLoading(false);
  };

  return (
    <Card style={{ opacity: alert.status === "rejected" ? .5 : 1, transition: "opacity .2s" }}>
      {/* Header */}
      <div style={{
        padding: "11px 15px", borderBottom: "1px solid #0F0F1A",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: "#161622", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#C9A96E", fontWeight: 700, fontSize: 13,
        }}>{alert.author_handle?.[1]?.toUpperCase() || "؟"}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#bbb", fontSize: 13 }}>{alert.author_handle}</div>
          <div style={{ color: "#2A2A3A", fontSize: 10 }}>{timeAgo(alert.created_at)} · {alert.platform}</div>
        </div>
        <Badge label={meta.label} color={meta.color} />
        {alert.relevance_score && (
          <span style={{
            fontSize: 12, fontWeight: 700,
            color: alert.relevance_score >= 85 ? "#4ECDC4" : alert.relevance_score >= 70 ? "#C9A96E" : "#FF6B6B",
          }}>{alert.relevance_score}%</span>
        )}
      </div>

      <div style={{ padding: "13px 15px", display: "flex", flexDirection: "column", gap: 11 }}>
        {/* Original post */}
        <div style={{
          background: "#06060D", borderRadius: 8,
          padding: "9px 12px", borderRight: "2px solid #1E1E2E",
        }}>
          <div style={{ color: "#2A2A3A", fontSize: 9, marginBottom: 3 }}>التغريدة الأصلية</div>
          <div style={{ color: "#666", fontSize: 13, lineHeight: 1.75 }}>{alert.original_post}</div>
          {alert.original_url && (
            <a href={alert.original_url} target="_blank" rel="noopener noreferrer" style={{
              color: "#C9A96E", fontSize: 10, display: "block", marginTop: 5,
            }}>فتح التغريدة ↗</a>
          )}
        </div>

        {/* Metadata */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {alert.matched_keyword && <Badge label={`#${alert.matched_keyword}`} />}
          {alert.products?.name && <Badge label={`📦 ${alert.products.name}`} color="#666" />}
        </div>

        {/* Reply textarea */}
        <div>
          <div style={{ color: "#2A2A3A", fontSize: 9, marginBottom: 5 }}>
            الرد المقترح {isPending ? "— قابل للتعديل" : ""}
          </div>
          <textarea
            value={reply}
            onChange={e => { setReply(e.target.value); updateAlertReply(alert.id, e.target.value); }}
            disabled={!isPending}
            rows={3}
            style={{
              width: "100%", background: "#06060D", border: "1px solid #1A1A28",
              borderRadius: 8, padding: "9px 12px",
              color: isPending ? "#ddd" : "#555",
              fontSize: 13, lineHeight: 1.8, direction: "rtl",
              resize: "vertical", fontFamily: "inherit",
              outline: "none", boxSizing: "border-box",
              transition: "border-color .2s",
            }}
            onFocus={e => isPending && (e.target.style.borderColor = "#C9A96E")}
            onBlur={e => (e.target.style.borderColor = "#1A1A28")}
          />
        </div>

        {/* Actions */}
        {isPending && (
          <div style={{ display: "flex", gap: 7 }}>
            <Button onClick={handleApprove} variant="success" disabled={actionLoading || !reply.trim()} size="sm">
              {actionLoading ? "..." : "✓ موافق ونشر"}
            </Button>
            <Button onClick={handleRegen} variant="secondary" disabled={regenLoading} size="sm">
              {regenLoading ? "⟳ جاري..." : "↺ توليد جديد"}
            </Button>
            <Button onClick={handleReject} variant="danger" disabled={actionLoading} size="sm">✕</Button>
          </div>
        )}
      </div>
    </Card>
  );
}

const FILTERS = [
  { id: "all",      label: "الكل" },
  { id: "pending",  label: "بانتظار المراجعة" },
  { id: "approved", label: "موافق" },
  { id: "rejected", label: "مرفوض" },
];

export default function Alerts() {
  const { alerts, loading } = useApp();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? alerts : alerts.filter(a => a.status === filter);
  const counts = FILTERS.reduce((acc, f) => {
    acc[f.id] = f.id === "all" ? alerts.length : alerts.filter(a => a.status === f.id).length;
    return acc;
  }, {});

  if (loading) return <Spinner />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: "5px 13px", borderRadius: 20, cursor: "pointer",
            border: `1px solid ${filter === f.id ? "#C9A96E40" : "#1A1A28"}`,
            background: filter === f.id ? "rgba(201,169,110,0.08)" : "transparent",
            color: filter === f.id ? "#C9A96E" : "#444",
            fontSize: 12, fontFamily: "inherit", transition: "all .15s",
          }}>
            {f.label} <span style={{ opacity: .6 }}>({counts[f.id]})</span>
          </button>
        ))}
      </div>

      {/* Alert cards */}
      {filtered.length === 0
        ? <Empty icon="◉" message="لا يوجد تنبيهات في هذا التصنيف" />
        : filtered.map(a => <AlertCard key={a.id} alert={a} />)
      }
    </div>
  );
}
