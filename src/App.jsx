// Main App Component - All Views Integration
import { useState, useEffect, useCallback } from 'react';
import db from './services/supabase.js';

// Import Components
import Sidebar from './components/Sidebar.jsx';
import DashboardView from './components/DashboardView.jsx';
import AlertsView from './components/AlertsView.jsx';
import ProductsView from './components/ProductsView.jsx';
import GenerateView from './components/GenerateView.jsx';
import ReportsView from './components/ReportsView.jsx';
import SettingsView from './components/SettingsView.jsx';

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [a, p] = await Promise.all([db.getAlerts(), db.getProducts()]);
      setAlerts(a);
      setProducts(p);
      setConnected(true);
    } catch (error) {
      console.error('❌ Failed to fetch data:', error);
      setConnected(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Alert Actions
  const approve = async (id, reply) => {
    setAlerts((p) => p.map((a) => (a.id === id ? { ...a, status: 'approved', edited_reply: reply } : a)));
    try {
      await db.approveAlert(id, reply);
    } catch (error) {
      console.error('❌ Failed to approve alert:', error);
    }
  };

  const reject = async (id) => {
    setAlerts((p) => p.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
    try {
      await db.rejectAlert(id);
    } catch (error) {
      console.error('❌ Failed to reject alert:', error);
    }
  };

  const updateSuggested = (id, text) => {
    setAlerts((p) => p.map((a) => (a.id === id ? { ...a, suggested_reply: text } : a)));
  };

  // Product Actions
  const addProduct = async ({ name, description, dialect, keywords }) => {
    try {
      await db.addProduct({ name, description, dialect, keywords });
      await fetchData();
    } catch (error) {
      console.error('❌ Failed to add product:', error);
    }
  };

  const toggleProduct = async (id, val) => {
    setProducts((p) => p.map((pr) => (pr.id === id ? { ...pr, is_active: val } : pr)));
    try {
      await db.toggleProduct(id, val);
    } catch (error) {
      console.error('❌ Failed to toggle product:', error);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((p) => p.filter((pr) => pr.id !== id));
    try {
      await db.deleteProduct(id);
    } catch (error) {
      console.error('❌ Failed to delete product:', error);
    }
  };

  const pendingCount = alerts.filter((a) => a.status === 'pending').length;

  const viewTitles = {
    dashboard: 'لوحة التحكم',
    alerts: 'التنبيهات',
    products: 'المنتجات',
    generate: 'توليد رد',
    reports: 'التقارير',
    settings: 'الإعدادات',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background: #06060D;
        }
        ::-webkit-scrollbar {
          width: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: #1A1A28;
          border-radius: 2px;
        }
        input, textarea, select {
          font-family: 'IBM Plex Sans Arabic', sans-serif !important;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          height: '100vh',
          background: '#06060D',
          fontFamily: "'IBM Plex Sans Arabic', sans-serif",
          direction: 'rtl',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar */}
        <Sidebar active={active} setActive={setActive} pendingCount={pendingCount} />

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <header
            style={{
              padding: '13px 20px',
              borderBottom: '1px solid #1A1A28',
              background: '#06060D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ color: '#ddd', fontSize: 14, fontWeight: 600 }}>{viewTitles[active]}</h1>
              <span
                style={{
                  fontSize: 9,
                  padding: '2px 7px',
                  borderRadius: 10,
                  background: connected ? 'rgba(78,205,196,0.08)' : 'rgba(255,107,107,0.08)',
                  color: connected ? '#4ECDC4' : '#FF6B6B',
                  border: `1px solid ${connected ? 'rgba(78,205,196,0.2)' : 'rgba(255,107,107,0.2)'}`,
                }}
              >
                {connected ? '● Supabase متصل' : '● وضع تجريبي'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {pendingCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#C9A96E', fontSize: 11 }}>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      background: '#C9A96E',
                      borderRadius: '50%',
                      animation: 'pulse 1.8s infinite',
                    }}
                  />
                  {pendingCount} تنبيه جديد
                </div>
              )}
              <button
                onClick={fetchData}
                style={{
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: '1px solid #1A1A28',
                  background: 'transparent',
                  color: '#444',
                  cursor: 'pointer',
                  fontSize: 11,
                }}
              >
                ↺ تحديث
              </button>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#C9A96E,#8B6914)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                م
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main style={{ flex: 1, overflow: 'auto', padding: '18px 20px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#333', fontSize: 13 }}>
                جاري التحميل...
              </div>
            ) : (
              <div style={{ animation: 'fadeIn .3s ease' }}>
                {active === 'dashboard' && (
                  <DashboardView alerts={alerts} products={products} setActive={setActive} />
                )}
                {active === 'alerts' && (
                  <AlertsView alerts={alerts} approve={approve} reject={reject} updateSuggested={updateSuggested} />
                )}
                {active === 'products' && (
                  <ProductsView
                    products={products}
                    addProduct={addProduct}
                    toggleProduct={toggleProduct}
                    deleteProduct={deleteProduct}
                  />
                )}
                {active === 'generate' && <GenerateView products={products} />}
                {active === 'reports' && <ReportsView alerts={alerts} />}
                {active === 'settings' && <SettingsView connected={connected} />}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
