import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Button, Input, Textarea, Select, Toggle, Badge, Empty, Spinner } from "../components/UI";

const COLORS = ["#C9A96E", "#4ECDC4", "#45B7D1", "#A855F7", "#FF6B6B"];
const DIALECT_OPTIONS = [
  { value: "نجدي", label: "نجدي — الرياض" },
  { value: "حجازي", label: "حجازي — جدة" },
];

function ProductForm({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dialect, setDialect] = useState("نجدي");
  const [keywords, setKeywords] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) { setError("اسم المنتج مطلوب"); return; }
    setSaving(true);
    setError("");
    try {
      const kwList = keywords.split("،").map(k => k.trim()).filter(Boolean);
      await onSave({ name: name.trim(), description: description.trim(), dialect, keywords: kwList });
    } catch (e) {
      setError(e.message || "حدث خطأ أثناء الحفظ");
    }
    setSaving(false);
  };

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ color: "#C9A96E", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>إضافة منتج جديد</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Input label="اسم المنتج *" value={name} onChange={setName} placeholder="مثال: عطر الفاخر" />
          <Select label="اللهجة" value={dialect} onChange={setDialect} options={DIALECT_OPTIONS} />
        </div>
        <Textarea label="وصف المنتج" value={description} onChange={setDescription} placeholder="وصف قصير يساعد الذكاء الاصطناعي على فهم المنتج..." rows={2} />
        <Input label="الكلمات المفتاحية (مفصولة بـ ،)" value={keywords} onChange={setKeywords} placeholder="مثال: عطر رجالي، بارفيوم فاخر، ريحة حلوة" />
        {error && <div style={{ color: "#FF6B6B", fontSize: 12 }}>{error}</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={handleSave} disabled={saving} fullWidth>{saving ? "جاري الحفظ..." : "حفظ المنتج"}</Button>
          <Button onClick={onCancel} variant="secondary">إلغاء</Button>
        </div>
      </div>
    </Card>
  );
}

function ProductCard({ product, color }) {
  const { toggleProduct, deleteProduct } = useApp();
  const [deleting, setDeleting] = useState(false);
  const keywords = product.keywords || [];

  const handleDelete = async () => {
    if (!window.confirm(`حذف "${product.name}"؟`)) return;
    setDeleting(true);
    try { await deleteProduct(product.id); } catch {}
    setDeleting(false);
  };

  return (
    <Card style={{ opacity: deleting ? .5 : 1, transition: "opacity .2s" }}>
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 13 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 9, flexShrink: 0,
          background: color + "12", border: `1px solid ${color}20`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color, fontSize: 18,
        }}>◈</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#ddd", fontSize: 14, fontWeight: 600, marginBottom: 5 }}>{product.name}</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {keywords.length === 0
              ? <span style={{ color: "#2A2A3A", fontSize: 11 }}>لا توجد كلمات مفتاحية</span>
              : keywords.map((k, i) => (
                <Badge key={i} label={typeof k === "object" ? k.keyword : k} color={color} size="sm" />
              ))
            }
          </div>
          {product.description && (
            <div style={{ color: "#333", fontSize: 11, marginTop: 5 }}>{product.description}</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <span style={{ color: "#2A2A3A", fontSize: 11 }}>{product.is_active ? "نشط" : "متوقف"}</span>
          <Toggle value={product.is_active} onChange={val => toggleProduct(product.id, val)} />
          <button onClick={handleDelete} disabled={deleting} style={{
            padding: "3px 8px", borderRadius: 5, border: "1px solid #FF6B6B20",
            background: "transparent", color: "#FF6B6B40", cursor: "pointer", fontSize: 11,
          }}>حذف</button>
        </div>
      </div>
    </Card>
  );
}

export default function Products() {
  const { products, loading, addProduct } = useApp();
  const [showForm, setShowForm] = useState(false);

  if (loading) return <Spinner />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "#ddd", fontSize: 17, marginBottom: 3 }}>المنتجات المُراقبة</h2>
          <p style={{ color: "#444", fontSize: 12 }}>{products.length} منتج مُضاف</p>
        </div>
        <Button onClick={() => setShowForm(p => !p)} variant={showForm ? "secondary" : "primary"} size="sm">
          {showForm ? "إلغاء" : "+ إضافة منتج"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <ProductForm
          onSave={async (data) => { await addProduct(data); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Products list */}
      {products.length === 0 && !showForm
        ? <Empty icon="◇" message="لا يوجد منتجات — أضف منتجك الأول" />
        : products.map((p, i) => (
          <ProductCard key={p.id} product={p} color={COLORS[i % COLORS.length]} />
        ))
      }
    </div>
  );
}
