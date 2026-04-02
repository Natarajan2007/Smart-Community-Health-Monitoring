import axios from 'axios';
import { eligibilityService } from './eligibilityService.js';
import { recommendationEngine } from './recommendationEngine.js';

/**
 * OpenAI Service - Handles all AI chat interactions and eligibility checks
 * @module openaiService
 */

const API_URL = 'http://localhost:5000/api/chat';
const REQUEST_TIMEOUT = 30000; // 30 seconds

const systemPrompt = {
  en: `You are an expert AI assistant for the DBT Awareness Platform helping Indian students understand:

CORE CONCEPTS:
1. Aadhaar-Linked Bank Accounts (physical bank branch process)
2. Aadhaar-Seeded Bank Accounts (online digital process)
3. DBT-Enabled Accounts (complete setup)
4. NPCI Mapping (government benefit system integration)
5. Common issues and troubleshooting steps

YOUR RESPONSIBILITIES:
- Provide step-by-step guidance in simple language
- Detect and diagnose issues (payment failure, inactive accounts, unsuccessful linking)
- Offer personalized solutions based on user's current state
- Always reference actionable next steps
- Be empathetic about frustrations with banking processes

RESPONSE FORMAT:
- Start with acknowledgement/empathy
- Explain the concept clearly using examples
- Provide numbered steps or bullet points
- Include timeline estimates
- Suggest when to contact bank vs other resources
- End with "Any other questions?" to keep conversation going

TONE: Friendly, supportive, patient - users may be frustrated or have low tech literacy.`,
  
  hi: `आप DBT जागरूकता प्लेटफॉर्म के लिए एक विशेषज्ञ AI सहायक हैं जो भारतीय छात्रों को समझने में मदद करते हैं:

मुख्य अवधारणाएं:
1. आधार-लिंक्ड बैंक खाते (बैंक शाखा में भौतिक प्रक्रिया)
2. आधार-सीडेड बैंक खाते (ऑनलाइन डिजिटल प्रक्रिया)
3. डीबीटी-सक्षम खाते (संपूर्ण सेटअप)
4. NPCI मैपिंग (सरकारी लाभ प्रणाली एकीकरण)
5. सामान्य समस्याएं और समस्या निवारण

आपकी जिम्मेदारियां:
- सरल भाषा में चरण-दर-चरण मार्गदर्शन प्रदान करें
- समस्याएं का पता लगाएं और निदान करें (भुगतान विफलता, निष्क्रिय खाते, असफल लिंकिंग)
- उपयोगकर्ता की वर्तमान स्थिति के आधार पर व्यक्तिगत समाधान दें
- हमेशा कार्रवाई योग्य अगले कदमों का संदर्भ दें
- बैंकिंग प्रक्रियाओं के साथ निराशा के बारे में सहानुभूतिपूर्ण रहें

प्रतिक्रिया प्रारूप:
- स्वीकृति/सहानुभूति के साथ शुरू करें
- अवधारणा को उदाहरणों का उपयोग करके स्पष्ट रूप से समझाएं
- संख्यांकित कदम या बुलेट पॉइंट्स प्रदान करें
- समय सीमा अनुमान शामिल करें
- बताएं कि बैंक से संपर्क कब करें बनाम अन्य संसाधन
- बातचीत को जारी रखने के लिए अंत में "कोई और सवाल?" के साथ समाप्त करें

टोन: मित्रवत, सहायक, धैर्यवान - उपयोगकर्ता निराश हो सकते हैं या कम तकनीकी साक्षरता वाले हो सकते हैं।`
};

/**
 * Sanitize user input to prevent injection attacks
 * @param {string} input - User input string
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .substring(0, 4000) // Limit length
    .replace(/[<>]/g, ''); // Remove potentially harmful characters
};

/**
 * Chat with AI - Send a message and get an AI response
 * @param {string} message - User message
 * @param {string} language - Language code ('en' or 'hi')
 * @param {Array} conversationHistory - Previous messages in conversation
 * @returns {Promise<Object>} Response with success status and message
 */
export const chatWithAI = async (message, language = 'en', conversationHistory = []) => {
  try {
    // Input validation
    if (!message || typeof message !== 'string') {
      return {
        success: false,
        message: language === 'en' 
          ? 'Invalid message format'
          : 'अमान्य संदेश प्रारूप',
        role: 'assistant'
      };
    }

    const sanitizedMessage = sanitizeInput(message);
    
    if (sanitizedMessage.length === 0) {
      return {
        success: false,
        message: language === 'en' 
          ? 'Please enter a valid message'
          : 'कृपया एक वैध संदेश दर्ज करें',
        role: 'assistant'
      };
    }

    // Validate conversation history
    if (!Array.isArray(conversationHistory)) {
      return {
        success: false,
        message: language === 'en' 
          ? 'Invalid conversation history'
          : 'अमान्य बातचीत इतिहास',
        role: 'assistant'
      };
    }

    const messages = [
      { role: 'system', content: systemPrompt[language] },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: sanitizedMessage }
    ];

    const response = await axios.post(API_URL, {
      messages: messages,
    }, {
      timeout: REQUEST_TIMEOUT
    });

    if (response.data.success && response.data.message) {
      return {
        success: true,
        message: response.data.message,
        role: 'assistant'
      };
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Chat API Error:', error.message);
    
    const isServerError = error.response?.status >= 500;
    const isNetworkError = error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND';
    
    let userMessage = language === 'en' 
      ? 'Sorry, I encountered an error. Please try again.'
      : 'खेद है, मुझे एक त्रुटि का सामना हुआ। कृपया फिर से प्रयास करें।';
    
    if (isNetworkError) {
      userMessage = language === 'en'
        ? 'Connection error. Please check your internet and try again.'
        : 'कनेक्शन त्रुटि। कृपया अपना इंटरनेट जांचें और फिर से प्रयास करें।';
    } else if (error.response?.status === 429) {
      userMessage = language === 'en'
        ? 'Too many requests. Please wait a moment and try again.'
        : 'बहुत सारे अनुरोध। कृपया एक क्षण प्रतीक्षा करें और फिर से प्रयास करें।';
    }
    
    return {
      success: false,
      message: userMessage,
      role: 'assistant'
    };
  }
};

/**
 * Check DBT eligibility based on user inputs
 * @param {Object} inputs - User input data (aadhaarLinked, aadhaarSeeded, npciMapped, accountActive)
 * @param {string} language - Language code ('en' or 'hi')
 * @returns {Object} Eligibility report with success status and readiness percentage
 */
export const checkDBTEligibility = (inputs, language = 'en') => {
  // Validate inputs
  const validation = eligibilityService.validateInputs(inputs);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
      message: language === 'en' 
        ? 'Invalid input provided'
        : 'अमान्य इनपुट प्रदान किया गया'
    };
  }

  const report = eligibilityService.generateReport(inputs, language);
  return {
    success: true,
    ...report
  };
};

/**
 * Get personalized recommendations for user based on DBT readiness
 * @param {Object} inputs - User state (aadhaarLinked, aadhaarSeeded, npciMapped)
 * @param {string} language - Language code ('en' or 'hi')
 * @returns {Object} Success status and personalized recommendations array
 */
export const getPersonalizedRecommendations = (inputs, language = 'en') => {
  const validation = eligibilityService.validateInputs(inputs);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }

  const recommendations = recommendationEngine.generateRecommendations(inputs, language);
  return {
    success: true,
    recommendations
  };
};

/**
 * Get solution for a specific DBT-related issue
 * @param {string} issueId - Issue identifier (e.g., 'payment_failed', 'account_inactive')
 * @param {string} language - Language code ('en' or 'hi')
 * @returns {Object} Success status and solution details
 */
export const getIssueSolution = (issueId, language = 'en') => {
  const solution = recommendationEngine.suggestSolutions(issueId, language);
  return {
    success: solution !== null,
    solution
  };
};

/**
 * Get contextual help for a specific topic or feature
 * @param {string} topic - Topic name (e.g., 'aadhaar_linking', 'dbt_transfer')
 * @param {string} language - Language code ('en' or 'hi')
 * @returns {Object} Success status and help content
 */
export const getContextualHelp = (topic, language = 'en') => {
  const help = recommendationEngine.getContextualHelp(topic, language);
  return {
    success: true,
    help
  };
};

/**
 * Chat with AI using context-awareness of user's DBT readiness state
 * Provides personalized recommendations based on user progress
 * @param {string} message - User's message or query
 * @param {Object} userState - User's current state (aadhaarLinked, aadhaarSeeded, npciMapped, accountActive)
 * @param {string} language - Language code ('en' or 'hi')
 * @param {Array} conversationHistory - Previous messages in conversation for context
 * @returns {Promise<Object>} Response with AI message and contextual recommendations
 */
export const chatWithContextAwareness = async (message, userState, language = 'en', conversationHistory = []) => {
  try {
    // Input validation
    if (!message || typeof message !== 'string') {
      return {
        success: false,
        message: language === 'en' 
          ? 'Invalid message format'
          : 'अमान्य संदेश प्रारूप',
        role: 'assistant'
      };
    }

    if (!userState || typeof userState !== 'object') {
      return {
        success: false,
        message: language === 'en' 
          ? 'Invalid user state'
          : 'अमान्य उपयोगकर्ता स्थिति',
        role: 'assistant'
      };
    }

    const sanitizedMessage = sanitizeInput(message);
    if (sanitizedMessage.length === 0) {
      return {
        success: false,
        message: language === 'en' 
          ? 'Please enter a valid message'
          : 'कृपया एक वैध संदेश दर्ज करें',
        role: 'assistant'
      };
    }

    // Get personalized recommendations based on user state
    const recommendations = recommendationEngine.generateRecommendations(userState, language);
    
    // Build context-aware system prompt with user's readiness status
    const statusInfo = `${userState.aadhaarLinked ? '✓' : '✗'} Linked | ${userState.aadhaarSeeded ? '✓' : '✗'} Seeded | ${userState.npciMapped ? '✓' : '✗'} NPCI Mapped`;
    const priorityActions = recommendations.slice(0, 3)
      .map(r => `- ${r.title?.[language] || r.title || ''}`)
      .join('\n');
    
    const contextPrompt = systemPrompt[language] + `\n\nUSER CONTEXT:\nCurrent DBT Readiness: ${statusInfo}\n\nPriority Actions:\n${priorityActions}`;

    const messages = [
      { role: 'system', content: contextPrompt },
      ...conversationHistory.slice(-10),
      { role: 'user', content: sanitizedMessage }
    ];

    const response = await axios.post(API_URL, {
      messages: messages,
    }, {
      timeout: REQUEST_TIMEOUT
    });

    if (response.data.success && response.data.message) {
      return {
        success: true,
        message: response.data.message,
        role: 'assistant',
        contextRecommendations: recommendations
      };
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Chat API Error:', error.message);
    
    const isNetworkError = error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND';
    let userMessage = language === 'en' 
      ? 'Sorry, I encountered an error. Please try again.'
      : 'खेद है, मुझे एक त्रुटि का सामना हुआ। कृपया फिर से प्रयास करें।';
    
    if (isNetworkError) {
      userMessage = language === 'en'
        ? 'Connection error. Please check your internet and try again.'
        : 'कनेक्शन त्रुटि। कृपया अपना इंटरनेट जांचें और फिर से प्रयास करें।';
    }
    
    return {
      success: false,
      message: userMessage,
      role: 'assistant'
    };
  }
};
