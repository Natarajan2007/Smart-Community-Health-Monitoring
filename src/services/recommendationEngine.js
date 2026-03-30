import { dbtEligibilityRules } from '../data/dbtRules.js';

// Personalized Recommendation Engine
export const recommendationEngine = {
  // Analyze user state and generate personalized recommendations
  generateRecommendations: (userInputs, language = 'en') => {
    const recommendations = [];

    // Priority-based recommendations
    if (!userInputs.aadhaarLinked) {
      recommendations.push({
        id: 'priority_1_aadhaar_linking',
        priority: 1,
        type: 'critical',
        category: language === 'en' ? 'Account Setup' : 'खाता सेटअप',
        title: language === 'en' 
          ? '🔴 Link Aadhaar to Your Bank Account'
          : '🔴 अपने बैंक खाते को आधार से लिंक करें',
        description: language === 'en'
          ? 'Aadhaar linking is the foundation for DBT eligibility. This must be done first before any other steps.'
          : 'आधार लिंकिंग DBT पात्रता की नींव है। किसी अन्य कदम से पहले यह पहले किया जाना चाहिए।',
        action: language === 'en' ? 'Link Now' : 'अब लिंक करें',
        steps: [
          language === 'en' ? 'Visit bank branch with Aadhaar card' : 'आधार कार्ड के साथ बैंक शाखा पर जाएं',
          language === 'en' ? 'Fill Aadhaar linking form' : 'आधार लिंकिंग फॉर्म भरें',
          language === 'en' ? 'Submit proof documents' : 'प्रमाण दस्तावेज जमा करें',
          language === 'en' ? 'Wait for bank confirmation' : 'बैंक की पुष्टिकरण का प्रतीक्षा करें'
        ],
        timeline: language === 'en' ? '2-3 working days' : '2-3 कार्य दिवस',
        impact: language === 'en' ? 'Critical - 0% → 25% readiness' : 'महत्वपूर्ण - 0% → 25% तैयारी'
      });
    }

    // After linking, seed Aadhaar
    if (userInputs.aadhaarLinked && !userInputs.aadhaarSeeded) {
      recommendations.push({
        id: 'priority_2_aadhaar_seeding',
        priority: 2,
        type: 'high',
        category: language === 'en' ? 'Digital Setup' : 'डिजिटल सेटअप',
        title: language === 'en'
          ? '🟠 Seed Aadhaar in Your Online Banking'
          : '🟠 अपनी ऑनलाइन बैंकिंग में आधार सीड करें',
        description: language === 'en'
          ? 'Seeding adds your Aadhaar number to your bank database. This is faster than linking and can be done online.'
          : 'सीडिंग आपके आधार नंबर को आपके बैंक डेटाबेस में जोड़ता है। यह लिंकिंग से तेज़ है और ऑनलाइन किया जा सकता है।',
        action: language === 'en' ? 'Seed Now' : 'अब सीड करें',
        steps: [
          language === 'en' ? 'Log into online banking' : 'ऑनलाइन बैंकिंग में लॉगिन करें',
          language === 'en' ? 'Find "KYC" or "Aadhaar" section' : '"KYC" या "आधार" सेक्शन खोजें',
          language === 'en' ? 'Enter your 12-digit Aadhaar number' : 'अपनी 12-अंकीय आधार नंबर दर्ज करें',
          language === 'en' ? 'Verify with OTP' : 'OTP से सत्यापन करें'
        ],
        timeline: language === 'en' ? 'Instant to 24 hours' : 'तुरंत से 24 घंटे',
        impact: language === 'en' ? 'High - 25% → 50% readiness' : 'उच्च - 25% → 50% तैयारी'
      });
    }

    // NPCI Mapping
    if (userInputs.aadhaarLinked && userInputs.aadhaarSeeded && !userInputs.npciMapped) {
      recommendations.push({
        id: 'priority_3_npci_mapping',
        priority: 3,
        type: 'high',
        category: language === 'en' ? 'DBT Activation' : 'DBT सक्रियकरण',
        title: language === 'en'
          ? '🟡 Activate NPCI Mapping for DBT'
          : '🟡 DBT के लिए NPCI मैपिंग सक्रिय करें',
        description: language === 'en'
          ? 'NPCI mapping ensures your account is recognized by government benefit distribution systems.'
          : 'NPCI मैपिंग सुनिश्चित करता है कि आपका खाता सरकारी लाभ वितरण प्रणालियों द्वारा पहचाना जाता है।',
        action: language === 'en' ? 'Activate Now' : 'अब सक्रिय करें',
        steps: [
          language === 'en' ? 'Call bank customer service' : 'बैंक कस्टमर सर्विस को कॉल करें',
          language === 'en' ? 'Request "DBT Activation" or "NPCI Mapping"' : '"DBT सक्रियकरण" या "NPCI मैपिंग" का अनुरोध करें',
          language === 'en' ? 'Provide your Aadhaar number' : 'अपनी आधार संख्या प्रदान करें',
          language === 'en' ? 'Wait for bank SMS confirmation' : 'बैंक SMS पुष्टिकरण का प्रतीक्षा करें'
        ],
        timeline: language === 'en' ? '1-2 working days' : '1-2 कार्य दिवस',
        impact: language === 'en' ? 'High - 50% → 75% readiness' : 'उच्च - 50% → 75% तैयारी'
      });
    }

    // Account activation
    if (!userInputs.accountActive) {
      recommendations.push({
        id: 'account_activation',
        priority: 4,
        type: 'medium',
        category: language === 'en' ? 'Account Health' : 'खाता स्वास्थ्य',
        title: language === 'en'
          ? '🔵 Activate Your Bank Account'
          : '🔵 अपने बैंक खाते को सक्रिय करें',
        description: language === 'en'
          ? 'Your account appears inactive. DBT requires an active account status.'
          : 'आपका खाता निष्क्रिय दिखाई दे रहा है। DBT को सक्रिय खाता स्थिति की आवश्यकता है।',
        action: language === 'en' ? 'Activate' : 'सक्रिय करें',
        steps: [
          language === 'en' ? 'Visit your bank branch' : 'अपनी बैंक शाखा पर जाएं',
          language === 'en' ? 'Request account reactivation' : 'खाते के पुनः सक्रियकरण का अनुरोध करें',
          language === 'en' ? 'Deposit minimum balance (if required)' : 'न्यूनतम शेष राशि जमा करें (यदि आवश्यक हो)',
          language === 'en' ? 'Get written confirmation' : 'लिखित पुष्टिकरण प्राप्त करें'
        ],
        timeline: language === 'en' ? '1-3 working days' : '1-3 कार्य दिवस',
        impact: language === 'en' ? 'Medium - Final step' : 'माध्यम - अंतिम चरण'
      });
    }

    // Success message if fully eligible
    if (userInputs.aadhaarLinked && userInputs.aadhaarSeeded && userInputs.npciMapped && userInputs.accountActive) {
      recommendations.push({
        id: 'fully_eligible',
        priority: 0,
        type: 'success',
        category: language === 'en' ? 'Congratulations' : 'बधाই हो',
        title: language === 'en'
          ? '✅ Your Account is DBT Ready!'
          : '✅ आपका खाता DBT तैयार है!',
        description: language === 'en'
          ? 'Your account has completed all DBT requirements. Government benefits should reach your account smoothly.'
          : 'आपके खाते ने सभी DBT आवश्यकताओं को पूरा कर लिया है। सरकारी लाभ आपके खाते में सुचारू रूप से पहुंचना चाहिए।',
        action: language === 'en' ? '✓ Ready' : '✓ तैयार',
        steps: [],
        timeline: language === 'en' ? 'Already complete' : 'पहले से पूर्ण',
        impact: language === 'en' ? 'Success - 100% readiness' : 'सफलता - 100% तैयारी'
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  },

  // Get intelligent suggestions based on common issues
  suggestSolutions: (issue, language = 'en') => {
    const issues = dbtEligibilityRules.commonIssues[language] || dbtEligibilityRules.commonIssues.en;
    return issues[issue] || null;
  },

  // Provide contextual help
  getContextualHelp: (context, language = 'en') => {
    const helpTopics = {
      en: {
        'what_is_aadhaar_linking': 'Aadhaar LINKING means connecting your 12-digit Aadhaar ID to your bank account at a bank branch.',
        'what_is_aadhaar_seeding': 'Aadhaar SEEDING means adding your Aadhaar number to your existing bank account through online banking.',
        'difference_linking_seeding': 'LINKING is physical (at branch), SEEDING is digital (online). Both are needed for DBT.',
        'what_is_npci': 'NPCI is National Payments Corporation of India. NPCI mapping ensures your bank account is in government benefit systems.',
        'why_dbt_needs_aadhaar': 'Aadhaar is used to verify your identity and prevent duplicate benefits. It\'s essential for DBT.',
        'how_long_to_receive_benefits': 'After all steps are complete, benefits typically arrive within 5-10 days of disbursement date.',
        'can_i_check_status': 'Yes, you can check your DBT eligibility status through banks or the Aadhaar website (uidai.gov.in).'
      },
      hi: {
        'what_is_aadhaar_linking': 'आधार LINKING का मतलब है अपने 12-अंकीय आधार ID को बैंक शाखा में अपने बैंक खाते से जोड़ना।',
        'what_is_aadhaar_seeding': 'आधार SEEDING का मतलब है ऑनलाइन बैंकिंग के माध्यम से अपने आधार नंबर को अपने मौजूदा बैंक खाते में जोड़ना।',
        'difference_linking_seeding': 'LINKING शारीरिक है (शाखा में), SEEDING डिजिटल है (ऑनलाइन)। DBT के लिए दोनों आवश्यक हैं।',
        'what_is_npci': 'NPCI भारत का राष्ट्रीय भुगतान निगम है। NPCI मैपिंग सुनिश्चित करता है कि आपका बैंक खाता सरकारी लाभ प्रणालियों में है।',
        'why_dbt_needs_aadhaar': 'आधार का उपयोग आपकी पहचान सत्यापित करने और डुप्लिकेट लाभों को रोकने के लिए किया जाता है। यह DBT के लिए आवश्यक है।',
        'how_long_to_receive_benefits': 'सभी कदम पूरे होने के बाद, लाभ आमतौर पर वितरण तारीख के 5-10 दिन बाद आते हैं।',
        'can_i_check_status': 'हाँ, आप बैंकों या आधार वेबसाइट (uidai.gov.in) के माध्यम से अपनी DBT पात्रता स्थिति जांच सकते हैं।'
      }
    };

    return helpTopics[language]?.[context] || 'Topic not found';
  }
};

export default recommendationEngine;
