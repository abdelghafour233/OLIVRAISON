import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API Key not found. AI features will be disabled.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
    const client = getClient();
    if (!client) return "يرجى إضافة مفتاح API لتفعيل الميزات الذكية.";

    try {
        const prompt = `
        أنت خبير تسويق إلكتروني. اكتب وصفاً تسويقياً جذاباً وقصيراً (حوالي 30 كلمة) لمنتج في متجر إلكتروني.
        اسم المنتج: ${productName}
        التصنيف: ${category}
        اللغة: العربية
        الأسلوب: احترافي ومقنع للزبون المغربي.
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating description:", error);
        return "حدث خطأ أثناء توليد الوصف. يرجى المحاولة لاحقاً.";
    }
};

export const analyzeStoreData = async (ordersCount: number, revenue: number): Promise<string> => {
    const client = getClient();
    if (!client) return "يرجى تفعيل API للحصول على التحليل.";

    try {
        const prompt = `
        بصفتك مستشار أعمال، قدم نصيحة واحدة قصيرة جداً (جملتين) لمدير متجر إلكتروني.
        عدد الطلبات الحالية: ${ordersCount}
        الإيرادات: ${revenue} درهم مغربي.
        `;
        
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text.trim();
    } catch (e) {
        return "لا يمكن إجراء التحليل حالياً.";
    }
}