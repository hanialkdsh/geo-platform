import { useState, useEffect } from 'react';
import anthropic from '../services/anthropic.js';

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return `منذ ${Math.floor(diff / 86400)} يوم`;
}

const STATUS_COLORS = { pending: '#C9A96E', approved: '#4ECDC4', rejected: '#FF6B6B' };
const STATUS_LABELS = { pending: 'بانتظار المراجعة', approved: 'موافق', rejected: 'مرفوض' };

function AlertCard({ alert, onApprove, onReject, onRegen, regenLoading }) {
  const [reply, setReply] = useState(alert.suggested_reply || '');

  useEffect(() => setReply(alert.suggested_reply || ''), [alert.suggested_reply]);

  const isPending = alert.status === 'pending';

  return (
    <div
      style={{
        background: '#0B0B14',
        border: `1px solid ${isPending ? '#1A1A28' : STATUS_COLORS[alert.status] + '25'}`,
        borderRadius: 11,
        overflow: 'hidden',
        opacity: alert.status === 'rejected' ? 0.5 : 1,
        transition: 'all .2s',
      }}
    >
      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #1A1A28', display: 'flex', alignItems: 'center', gap: 9 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: '#1A1A28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C9A96E',
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {alert.author_handle?.[1]?.toUpperCase() || '؟'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#bbb', fontSize: 12 }}>{alert.author_handle}</div>
          <div style={{ color: '#333', fontSize: 10 }}>
            {timeAgo(alert.created_at)} · {alert.platform}
          </div>
        </div>
        <span
          style={{
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 20,
            background: STATUS_COLORS[alert.status] + '15',
            color: STATUS_COLORS[alert.status],
            border: `1px solid ${STATUS_COLORS[alert.status]}25`,
          }}
        >
          {STATUS_LABELS[alert.status]}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color:
              alert.relevance_score >= 85
                ? '#4ECDC4'
                : alert.relevance_score >= 70
                  ? '#C9A96E'
                  : '#FF6B6B',
          }}
        >
          {alert.relevance_score}%
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Original Post */}
        <div style={{ background: '#06060D', borderRadius: 7, padding: '8px 11px', borderRight: '2px solid #2A2A3A' }}>
          <div style={{ color: '#333', fontSize: 9, marginBottom: 3 }}>التغريدة الأصلية</div>
          <div style={{ color: '#666', fontSize: 13, lineHeight: 1.7, direction: 'rtl' }}>
            {alert.original_post}
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {alert.matched_keyword && (
            <span
              style={{
                fontSize: 10,
                padding: '2px 7px',
                borderRadius: 20,
                background: 'rgba(201,169,110,0.08)',
                color: '#C9A96E',
                border: '1px solid rgba(201,169,110,0.2)',
              }}
            >
              #{alert.matched_keyword}
            </span>
          )}
          {alert.products?.name && (
            <span
              style={{
                fontSize: 10,
                padding: '2px 7px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.03)',
                color: '#555',
              }}
            >
              📦 {alert.products.name}
            </span>
          )}
        </div>

        {/* Reply Textarea */}
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          disabled={!isPending}
          rows={3}
          style={{
            width: '100%',
            background: '#06060D',
            border: '1px solid #1A1A28',
            borderRadius: 7,
            padding: '8px 11px',
            color: isPending ? '#ddd' : '#555',
            fontSize: 13,
            lineHeight: 1.8,
            direction: 'rtl',
            resize: 'vertical',
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Actions */}
        {isPending && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => onApprove(alert.id, reply)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 7,
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(135deg,#4ECDC4,#2EAF9F)',
                color: '#000',
                fontWeight: 700,
                fontSize: 13,
                fontFamily: 'inherit',
              }}
            >
              ✓ موافق
            </button>
            <button
              onClick={() => onRegen(alert)}
              disabled={regenLoading === alert.id}
              style={{
                padding: '8px 12px',
                borderRadius: 7,
                border: '1px solid #1A1A28',
                background: 'transparent',
                color: regenLoading === alert.id ? '#C9A96E' : '#555',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              {regenLoading === alert.id ? '⟳' : '↺'}
            </button>
            <button
              onClick={() => onReject(alert.id)}
              style={{
                padding: '8px 12px',
                borderRadius: 7,
                border: '1px solid #FF6B6B25',
                background: 'transparent',
                color: '#FF6B6B',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AlertsView({ alerts, approve, reject, updateSuggested }) {
  const [filter, setFilter] = useState('all');
  const [regenLoading, setRegenLoading] = useState(null);

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.status === filter);

  const handleRegen = async (alert) => {
    setRegenLoading(alert.id);
    try {
      const r = await anthropic.generateReply(
        alert.original_post,
        alert.products?.name || 'المنتج',
        '',
        'نجدي'
      );
      updateSuggested(alert.id, r);
    } catch (error) {
      console.error('Failed to regenerate:', error);
    }
    setRegenLoading(null);
  };

  const filters = [
    { id: 'all', label: 'الكل', count: alerts.length },
    { id: 'pending', label: 'بانتظار مراجعة', count: alerts.filter((a) => a.status === 'pending').length },
    { id: 'approved', label: 'موافق', count: alerts.filter((a) => a.status === 'approved').length },
    { id: 'rejected', label: 'مرفوض', count: alerts.filter((a) => a.status === 'rejected').length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '5px 12px',
              borderRadius: 20,
              border: `1px solid ${filter === f.id ? '#C9A96E40' : '#1A1A28'}`,
              background: filter === f.id ? 'rgba(201,169,110,0.08)' : 'transparent',
              color: filter === f.id ? '#C9A96E' : '#444',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'inherit',
            }}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#333' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>◉</div>
          <div style={{ fontSize: 13 }}>لا يوجد تنبيهات</div>
        </div>
      )}

      {/* Alerts List */}
      {filtered.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onApprove={approve}
          onReject={reject}
          onRegen={handleRegen}
          regenLoading={regenLoading}
        />
      ))}
    </div>
  );
}
