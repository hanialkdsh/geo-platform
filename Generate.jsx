import { useState } from "react";
import { useApp } from "../context/AppContext";
import { generateReply } from "../services/anthropic";
import { Card, Button, Textarea, Select, Empty } from "../components/UI";

const DIALECT_OPTIONS = [
  { value: "نجدي", label: "نجدي — الرياض" },
  { value: "حجازي", label: "حجازي — جدة" },
];

export default function Generate() {
  const { products } = useApp();
  const [post, setPost] = useState("");
  const [productId, setProductId] = useState("");
  const [dialect, setDialect] = useState("نجدي");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedProduct = products.find(p => p.id === productId);

  const productOptions = [
    { value: "", label: "اختر منتجاً..." },
    ...products.map(p => ({ value: p.id, label: p.name })),
  ];

  const handleGenerate = async () => {
    if (!post.trim() || !selectedProduct) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const r = await generateReply({
        post: post.trim(),
        productName: selectedProduct.name,
        productDesc: selectedProduct.description || "",
        dialect,
      });
      setResult(r);
    } catch (e) {
      setError(e.message || "حدث خطأ أثناء التوليد. تأكد من إعداد السيرفر.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGenerate = post.trim().length > 0 && productId && !loading;

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ color: "#ddd", fontSize: 17, marginBottom: 4 }}>توليد رد مخصص</h2>
        <p style={{ color: "#444", fontSize: 13 }}>
          الصق التغريدة واختر منتجك — سيصيغ الذكاء الاصطناعي رداً عفوياً باللهجة السعودية
        </p>
      </div>

      {products.length === 0 ? (
        <Empty icon="◇" message="أضف منتجاً أولاً من صفحة المنتجات" />
      ) : (
        <>
          <Card style={{ padding: 18, display: "flex", flexDirection: "column", gap: 13 }}>
            <Textarea
              label="التغريدة الأصلية"
              value={post}
              onChange={setPost}
              placeholder="الصق التغريدة هنا... مثال: وين أحسن مكان أشتري منه عطر رجالي بالرياض؟"
              rows={3}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Select label="المنتج" value={productId} onChange={setProductId} options={productOptions} />
              <Select label="اللهجة" value={dialect} onChange={setDialect} options={DIALECT_OPTIONS} />
            </div>

            {selectedProduct?.description && (
              <div style={{
                background: "#06060D", borderRadius: 7, padding: "7px 11px",
                border: "1px solid #161622",
              }}>
                <div style={{ color: "#2A2A3A", fontSize: 9, marginBottom: 2 }}>وصف المنتج المختار</div>
                <div style={{ color: "#555", fontSize: 12 }}>{selectedProduct.description}</div>
              </div>
            )}

            <Button onClick={handleGenerate} disabled={!canGenerate} fullWidth size="lg">
              {loading ? "✦ جاري التوليد..." : "✦ ولّد الرد"}
            </Button>

            {error && (
              <div style={{
                background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.2)",
                borderRadius: 8, padding: "10px 12px", color: "#FF6B6B", fontSize: 12,
              }}>
                ⚠️ {error}
                <div style={{ color: "#FF6B6B80", fontSize: 11, marginTop: 4 }}>
                  تأكد من تشغيل السيرفر: node server.js
                </div>
              </div>
            )}
          </Card>

          {result && (
            <Card style={{
              padding: 18,
              background: "rgba(201,169,110,0.03)",
              border: "1px solid rgba(201,169,110,0.2)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ color: "#C9A96E", fontSize: 12, fontWeight: 600 }}>✦ الرد المولّد</span>
                <div style={{ display: "flex", gap: 7 }}>
                  <Button onClick={handleCopy} variant="secondary" size="sm">
                    {copied ? "✓ تم النسخ" : "نسخ"}
                  </Button>
                  <Button onClick={handleGenerate} variant="secondary" size="sm">↺ جديد</Button>
                </div>
              </div>
              <p style={{
                color: "#ddd", fontSize: 14, lineHeight: 2,
                direction: "rtl", margin: 0,
              }}>{result}</p>

              <div style={{
                marginTop: 14, padding: "10px 12px",
                background: "#06060D", borderRadius: 7,
                border: "1px solid #161622",
              }}>
                <div style={{ color: "#2A2A3A", fontSize: 10, marginBottom: 5 }}>
                  عدد الأحرف: {result.length} · مناسب للنشر على X
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 10, color: result.length <= 280 ? "#4ECDC4" : "#FF6B6B" }}>
                    {result.length <= 280 ? "✓ ضمن حد X" : "✕ يتجاوز 280 حرف"}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
