import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { db } from "../services/supabase";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [a, p] = await Promise.all([db.alerts.list(), db.products.list()]);
      setAlerts(a || []);
      setProducts(p || []);
      setConnected(true);
    } catch {
      setConnected(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const approveAlert = async (id, reply) => {
    await db.alerts.update(id, { status: "approved", edited_reply: reply, approved_at: new Date().toISOString() });
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "approved", edited_reply: reply } : a));
  };

  const rejectAlert = async (id) => {
    await db.alerts.update(id, { status: "rejected" });
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "rejected" } : a));
  };

  const updateAlertReply = (id, text) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, suggested_reply: text } : a));
  };

  const addProduct = async ({ name, description, dialect, keywords }) => {
    const [created] = await db.products.create({ name, description, dialect, is_active: true });
    for (const kw of keywords) {
      await db.keywords.create({ product_id: created.id, keyword: kw.trim(), platform: "x" });
    }
    await refresh();
    return created;
  };

  const toggleProduct = async (id, is_active) => {
    await db.products.update(id, { is_active });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active } : p));
  };

  const deleteProduct = async (id) => {
    await db.keywords.deleteByProduct(id);
    await db.products.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const pendingCount = alerts.filter(a => a.status === "pending").length;

  return (
    <AppContext.Provider value={{
      alerts, products, loading, connected, pendingCount, refresh,
      approveAlert, rejectAlert, updateAlertReply,
      addProduct, toggleProduct, deleteProduct,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
