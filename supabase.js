const SUPABASE_URL = "https://ypyrufojozdkmtoqwlgj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweXJ1Zm9qb3pka210b3F3bGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjY3NzgsImV4cCI6MjA5NTEwMjc3OH0.hLHj7z55Qxgnj45Y5jW9A3mzFRXeX6htPkiqqX42098";

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

async function request(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
}

export const db = {
  alerts: {
    list: () => request("/alerts?select=*,products(name,dialect)&order=created_at.desc&limit=100"),
    update: (id, data) => request(`/alerts?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(data),
    }),
  },
  products: {
    list: () => request("/products?select=*,keywords(*)&order=created_at.desc"),
    create: (data) => request("/products", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(data),
    }),
    update: (id, data) => request(`/products?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(data),
    }),
    delete: (id) => request(`/products?id=eq.${id}`, { method: "DELETE" }),
  },
  keywords: {
    create: (data) => request("/keywords", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(data),
    }),
    deleteByProduct: (productId) => request(`/keywords?product_id=eq.${productId}`, { method: "DELETE" }),
  },
};
