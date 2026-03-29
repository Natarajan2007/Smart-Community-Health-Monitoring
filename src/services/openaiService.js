import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chat';

const systemPrompt = {
  en: `You are a helpful AI assistant trained to provide information about Aadhaar, DBT (Direct Benefit Transfer), and related Indian financial systems. You help users understand:
1. Aadhaar-Linked Bank Accounts
2. Aadhaar-Seeded Bank Accounts
3. DBT-Enabled Accounts
4. How these systems work
5. Common issues and troubleshooting

Be concise, clear, and supportive. If you don't know something, say "I don't have information about that" instead of guessing.`,
  
  hi: `आप एक सहायक AI सहायक हैं जो आधार, डीबीटी (प्रत्यक्ष लाभ हस्तांतरण) और संबंधित भारतीय वित्तीय प्रणालियों के बारे में जानकारी प्रदान करने के लिए प्रशिक्षित हैं। आप उपयोगकर्ताओं को समझने में मदद करते हैं:
1. आधार-लिंक्ड बैंक खाते
2. आधार-सीडेड बैंक खाते
3. डीबीटी-सक्षम खाते
4. ये सिस्टम कैसे काम करते हैं
5. सामान्य समस्याएं और समस्या निवारण

संक्षिप्त, स्पष्ट और सहायक रहें। यदि आप कुछ नहीं जानते, तो अनुमान लगाने के बजाय "मेरे पास इस बारे में जानकारी नहीं है" कहें।`
};

export const chatWithAI = async (message, language = 'en', conversationHistory = []) => {
  try {
    const messages = [
      { role: 'system', content: systemPrompt[language] },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await axios.post(API_URL, {
      messages: messages,
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        role: 'assistant'
      };
    } else {
      return {
        success: false,
        message: language === 'en' 
          ? 'Sorry, I encountered an error. Please try again.'
          : 'खेद है, मुझे एक त्रुटि का सामना हुआ। कृपया फिर से प्रयास करें।',
        role: 'assistant'
      };
    }
  } catch (error) {
    console.error('Chat API Error:', error.message);
    return {
      success: false,
      message: language === 'en' 
        ? 'Sorry, I encountered an error. Please try again.'
        : 'खेद है, मुझे एक त्रुटि का सामना हुआ। कृपया फिर से प्रयास करें।',
      role: 'assistant'
    };
  }
};
