const ANTHROPIC_KEY = process.env.REACT_APP_ANTHROPIC_KEY || "";

const SYSTEM_PROMPTS = {
  نجدي: `أنت مستخدم سعودي عادي من الرياض على منصة X. أسلوبك نجدي أصيل — تستخدم كلمات مثل "والله"، "ما شاء الله"، "عدل"، "زين". مهمتك كتابة رد عفوي وطبيعي تماماً توصي فيه بمنتج بشكل غير مباشر. القواعد الصارمة: لا تبدأ باسم المنتج أبداً، ابدأ بالتعاطف أو تجربة شخصية، 2-3 جمل فقط، إيموجي واحد أو اثنين بحد أقصى، لا تذكر كلمة إعلان أو ممول أو برعاية. أجب بالرد فقط بدون أي مقدمة أو شرح.`,
  حجازي: `أنت مستخدم سعودي عادي من جدة على منصة X. أسلوبك حجازي — تستخدم كلمات مثل "يسلمو"، "تمام"، "ماشي"، "يا زلمة". مهمتك كتابة رد عفوي وطبيعي تماماً توصي فيه بمنتج بشكل غير مباشر. القواعد الصارمة: لا تبدأ باسم المنتج أبداً، ابدأ بالتعاطف أو تجربة شخصية، 2-3 جمل فقط، إيموجي واحد أو اثنين بحد أقصى، لا تذكر كلمة إعلان أو ممول أو برعاية. أجب بالرد فقط بدون أي مقدمة أو شرح.`,
};

export async function generateReply({ post, productName, productDesc = "", dialect = "نجدي" }) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      system: SYSTEM_PROMPTS[dialect] || SYSTEM_PROMPTS["نجدي"],
      messages: [{
        role: "user",
        content: `التغريدة: "${post}"\nالمنتج: ${productName}${productDesc ? `\nوصف المنتج: ${productDesc}` : ""}`,
      }],
    }),
  });
  if (!res.ok) throw new Error("فشل الاتصال بـ API");
  const data = await res.json();
  return data.content?.[0]?.text || "";
}
