# GEO Platform v2 — دليل التشغيل

## هيكلة المجلدات
```
src/
├── App.js                  ← نقطة الدخول الرئيسية
├── context/
│   └── AppContext.jsx      ← Global State (alerts, products)
├── services/
│   ├── supabase.js         ← كل عمليات قاعدة البيانات
│   └── anthropic.js        ← توليد الردود بالذكاء الاصطناعي
├── components/
│   ├── Sidebar.jsx         ← القائمة الجانبية
│   └── UI.jsx              ← مكونات مشتركة (Button, Input, Card...)
└── pages/
    ├── Dashboard.jsx       ← لوحة التحكم
    ├── Alerts.jsx          ← التنبيهات
    ├── Products.jsx        ← المنتجات
    ├── Generate.jsx        ← توليد رد مخصص
    ├── Reports.jsx         ← التقارير
    └── Settings.jsx        ← الإعدادات
```

## خطوات التشغيل

### 1. انسخ الملفات
انسخ محتوى مجلد `src/` إلى `C:\Users\hani\geo-platform\src\`
وانسخ `server.js` و `package.json` إلى `C:\Users\hani\geo-platform\`

### 2. ثبّت المكتبات
```powershell
cd C:\Users\hani\geo-platform
npm install
```

### 3. أضف Anthropic API Key
افتح `server.js` وغيّر:
```
const ANTHROPIC_KEY = "YOUR_ANTHROPIC_KEY_HERE";
```

### 4. شغّل السيرفر (PowerShell 1)
```powershell
node server.js
```

### 5. شغّل المنصة (PowerShell 2)
```powershell
npm start
```

## روابط مهمة
- المنصة: http://localhost:3000
- السيرفر: http://localhost:3001
- Supabase: https://supabase.com/dashboard/project/ypyrufojozdkmtoqwlgj
