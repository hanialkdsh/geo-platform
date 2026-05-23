// Anthropic API Service Layer
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

const anthropic = {
  async generateReply(originalPost, productName, productDesc = '', dialect = 'نجدي') {
    try {
      const systemPrompt = `أنت مستخدم سعودي عادي على منصة X. اكتب رداً طبيعياً عفوياً باللهجة السعودية ${
        dialect === 'حجازي' ? 'الحجازية' : 'النجدية'
      } توصي فيه بالمنتج بشكل غير مباشر. القواعد: لا تبدأ باسم المنتج، ابدأ بتجربة شخصية أو تعاطف، 3 جمل فقط، إيموجي واحد أو اثنين بحد أقصى، لا تذكر كلمة إعلان. أجب بالرد فقط.`;

      const userMessage = `التغريدة: "${originalPost}"\nالمنتج: ${productName}\n${productDesc ? 'وصف: ' + productDesc : ''}`;

      const res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Anthropic API error: ${error}`);
      }

      const data = await res.json();
      return data.content?.[0]?.text || 'حدث خطأ';
    } catch (error) {
      console.error('❌ Failed to generate reply:', error);
      throw error;
    }
  },
};

export default anthropic;
