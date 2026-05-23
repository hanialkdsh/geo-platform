// Sidebar Component
function Sidebar({ active, setActive, pendingCount }) {
  const [col, setCol] = useState(false);

  const nav = [
    { id: 'dashboard', icon: '◈', label: 'لوحة التحكم' },
    { id: 'alerts', icon: '◉', label: 'التنبيهات', badge: pendingCount },
    { id: 'products', icon: '◇', label: 'المنتجات' },
    { id: 'generate', icon: '✦', label: 'توليد رد' },
    { id: 'reports', icon: '◫', label: 'التقارير' },
    { id: 'settings', icon: '⚙', label: 'الإعدادات' },
  ];

  return (
    <aside
      style={{
        width: col ? 58 : 210,
        flexShrink: 0,
        background: '#08080F',
        borderLeft: '1px solid #1A1A28',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width .25s',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: col ? '18px 12px' : '18px 15px',
          borderBottom: '1px solid #1A1A28',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          justifyContent: col ? 'center' : 'flex-start',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'linear-gradient(135deg,#C9A96E,#8B6914)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 800,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          أ
        </div>
        {!col && (
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>أتمتة</div>
            <div style={{ color: '#C9A96E', fontSize: 9, letterSpacing: 1 }}>GEO PLATFORM</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 5px' }}>
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: col ? '10px 0' : '9px 11px',
              justifyContent: col ? 'center' : 'flex-start',
              borderRadius: 7,
              border: 'none',
              cursor: 'pointer',
              marginBottom: 2,
              background: active === item.id ? 'rgba(201,169,110,0.1)' : 'transparent',
              color: active === item.id ? '#C9A96E' : '#444',
              transition: 'all .15s',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
            {!col && <span style={{ fontSize: 13 }}>{item.label}</span>}
            {item.badge > 0 && !col && (
              <span
                style={{
                  marginRight: 'auto',
                  background: '#C9A96E',
                  color: '#000',
                  borderRadius: 10,
                  fontSize: 9,
                  padding: '1px 6px',
                  fontWeight: 800,
                }}
              >
                {item.badge}
              </span>
            )}
            {item.badge > 0 && col && (
              <span
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 6,
                  height: 6,
                  background: '#C9A96E',
                  borderRadius: '50%',
                }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCol((p) => !p)}
        style={{
          margin: '6px 5px',
          padding: '7px',
          borderRadius: 7,
          border: '1px solid #1A1A28',
          background: 'transparent',
          color: '#333',
          cursor: 'pointer',
          fontSize: 11,
        }}
      >
        {col ? '▸' : '◂'}
      </button>
    </aside>
  );
}

export default Sidebar;

// Missing import
import { useState } from 'react';
