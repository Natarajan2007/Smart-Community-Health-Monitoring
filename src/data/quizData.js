// Quiz data for Gamified Awareness Quiz
export const quizData = {
  en: [
    {
      id: 1,
      category: 'Aadhaar Basics',
      difficulty: 'Easy',
      question: 'What is Aadhaar?',
      options: [
        'A 12-digit unique identity number provided by UIDAI',
        'A bank account number',
        'A passport document',
        'A driving license'
      ],
      correct: 0,
      explanation: 'Aadhaar is a 12-digit unique identity number issued by the Unique Identification Authority of India (UIDAI). It\'s based on biometric data (fingerprints and iris) and demographic information.'
    },
    {
      id: 2,
      category: 'Aadhaar Basics',
      difficulty: 'Easy',
      question: 'Who issues Aadhaar?',
      options: [
        'Reserve Bank of India (RBI)',
        'Unique Identification Authority of India (UIDAI)',
        'Ministry of Finance',
        'State Government'
      ],
      correct: 1,
      explanation: 'Aadhaar is issued by the Unique Identification Authority of India (UIDAI), a statutory authority under the Ministry of Electronics and Information Technology.'
    },
    {
      id: 3,
      category: 'Linking vs Seeding',
      difficulty: 'Medium',
      question: 'What is the difference between Aadhaar LINKING and SEEDING?',
      options: [
        'Both mean the same thing',
        'Linking is done at bank branch, Seeding is done online',
        'Seeding is done at bank branch, Linking is done online',
        'Linking is permanent, Seeding is temporary'
      ],
      correct: 1,
      explanation: 'Aadhaar LINKING is the physical process done at a bank branch where you register your Aadhaar with your account. SEEDING is adding your Aadhaar number to an existing account through online banking.'
    },
    {
      id: 4,
      category: 'Linking vs Seeding',
      difficulty: 'Medium',
      question: 'Which step must be done first - Linking or Seeding?',
      options: [
        'Seeding must be done first',
        'Linking must be done first',
        'Both can be done simultaneously',
        'Order doesn\'t matter'
      ],
      correct: 1,
      explanation: 'Aadhaar LINKING must be done first. SEEDING won\'t work if LINKING isn\'t complete. This is the mandatory sequence for DBT eligibility.'
    },
    {
      id: 5,
      category: 'DBT Basics',
      difficulty: 'Easy',
      question: 'What does DBT stand for?',
      options: [
        'Dynamic Bank Transfer',
        'Direct Benefit Transfer',
        'Digital Banking Technology',
        'Distributed Blockchain Transfer'
      ],
      correct: 1,
      explanation: 'DBT stands for Direct Benefit Transfer. It\'s a government scheme to transfer subsidies and benefits directly into the bank accounts of beneficiaries.'
    },
    {
      id: 6,
      category: 'DBT Process',
      difficulty: 'Hard',
      question: 'What is NPCI Mapping in the context of DBT?',
      options: [
        'A new payment platform',
        'Mapping your account with the National Payments Corporation of India system for government benefit distribution',
        'A type of bank account',
        'A security measure to prevent fraud'
      ],
      correct: 1,
      explanation: 'NPCI Mapping connects your bank account with the National Payments Corporation of India (NPCI) system, allowing the system to recognize your account for government benefit disbursements.'
    },
    {
      id: 7,
      category: 'DBT Process',
      difficulty: 'Medium',
      question: 'How long does Aadhaar Linking typically take?',
      options: [
        'Instant',
        'Same day',
        '2-3 working days',
        '1-2 weeks'
      ],
      correct: 2,
      explanation: 'Aadhaar LINKING at a bank branch typically takes 2-3 working days for the bank to process and verify the linkage.'
    },
    {
      id: 8,
      category: 'Linking vs Seeding',
      difficulty: 'Hard',
      question: 'What are the three mandatory steps for DBT eligibility?',
      options: [
        'Aadhaar Linking + Pan Linking + KYC',
        'Aadhaar Linking + Aadhaar Seeding + NPCI Mapping',
        'Account Opening + Linking + Verification',
        'KYC + Biometric + Address Proof'
      ],
      correct: 1,
      explanation: 'The three mandatory steps are: 1) Aadhaar LINKING at bank branch, 2) Aadhaar SEEDING in online banking, 3) NPCI MAPPING activation. All three are required for DBT eligibility.'
    },
    {
      id: 9,
      category: 'Common Issues',
      difficulty: 'Medium',
      question: 'If Aadhaar Seeding fails, what should you check first?',
      options: [
        'Your internet connection',
        'Whether Aadhaar Linking is complete',
        'Your browser cache',
        'Your bank balance'
      ],
      correct: 1,
      explanation: 'Seeding fails if LINKING isn\'t complete first. Verify that LINKING status is complete before attempting SEEDING again.'
    },
    {
      id: 10,
      category: 'Real-world Scenario',
      difficulty: 'Hard',
      question: 'Ramesh linked his Aadhaar 3 days ago at the bank. When can he try Seeding?',
      options: [
        'Immediately after visiting the bank',
        'After 24 hours',
        'After the bank completes processing (2-3 working days)',
        'Only after getting written confirmation from bank'
      ],
      correct: 2,
      explanation: 'Ramesh should wait 2-3 working days after LINKING before attempting SEEDING. This allows the bank time to process and verify the linkage in their system.'
    }
  ],
  
  hi: [
    {
      id: 1,
      category: 'आधार मूल बातें',
      difficulty: 'आसान',
      question: 'आधार क्या है?',
      options: [
        'UIDAI द्वारा प्रदान की गई 12-अंकीय अद्वितीय पहचान संख्या',
        'एक बैंक खाता संख्या',
        'एक पासपोर्ट दस्तावेज',
        'एक ड्राइविंग लाइसेंस'
      ],
      correct: 0,
      explanation: 'आधार भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI) द्वारा जारी किया गया एक 12-अंकीय अद्वितीय पहचान संख्या है। यह जैव मीट्रिक डेटा (फिंगरप्रिंट और आईरिस) और जनसांख्यिकीय जानकारी पर आधारित है।'
    },
    {
      id: 2,
      category: 'आधार मूल बातें',
      difficulty: 'आसान',
      question: 'आधार कौन जारी करता है?',
      options: [
        'भारतीय रिजर्व बैंक (RBI)',
        'भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)',
        'वित्त मंत्रालय',
        'राज्य सरकार'
      ],
      correct: 1,
      explanation: 'आधार भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI) द्वारा जारी किया जाता है, जो इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय के अंतर्गत एक वैधानिक प्राधिकरण है।'
    },
    {
      id: 3,
      category: 'लिंकिंग बनाम सीडिंग',
      difficulty: 'माध्यम',
      question: 'आधार LINKING और SEEDING में क्या अंतर है?',
      options: [
        'दोनों का मतलब एक ही है',
        'लिंकिंग बैंक शाखा में की जाती है, सीडिंग ऑनलाइन की जाती है',
        'सीडिंग बैंक शाखा में की जाती है, लिंकिंग ऑनलाइन की जाती है',
        'लिंकिंग स्थायी है, सीडिंग अस्थायी है'
      ],
      correct: 1,
      explanation: 'आधार LINKING बैंक शाखा में की जाने वाली भौतिक प्रक्रिया है जहां आप अपने आधार को अपने खाते के साथ पंजीकृत करते हैं। SEEDING ऑनलाइन बैंकिंग के माध्यम से अपने आधार नंबर को किसी मौजूदा खाते में जोड़ना है।'
    },
    {
      id: 4,
      category: 'लिंकिंग बनाम सीडिंग',
      difficulty: 'माध्यम',
      question: 'कौन सा कदम पहले किया जाना चाहिए - लिंकिंग या सीडिंग?',
      options: [
        'सीडिंग पहले की जानी चाहिए',
        'लिंकिंग पहले की जानी चाहिए',
        'दोनों एक साथ किए जा सकते हैं',
        'क्रम महत्वपूर्ण नहीं है'
      ],
      correct: 1,
      explanation: 'आधार LINKING पहले किया जाना चाहिए। सीडिंग तब तक काम नहीं करेगी जब तक कि लिंकिंग पूरी न हो जाए। DBT पात्रता के लिए यह अनिवार्य अनुक्रम है।'
    },
    {
      id: 5,
      category: 'DBT मूल बातें',
      difficulty: 'आसान',
      question: 'DBT का अर्थ क्या है?',
      options: [
        'डायनामिक बैंक ट्रांसफर',
        'प्रत्यक्ष लाभ हस्तांतरण',
        'डिजिटल बैंकिंग तकनीक',
        'वितरित ब्लॉकचेन ट्रांसफर'
      ],
      correct: 1,
      explanation: 'DBT का अर्थ प्रत्यक्ष लाभ हस्तांतरण है। यह सरकारी लाभार्थियों के बैंक खातों में सीधे सब्सिडी और लाभ हस्तांतरित करने के लिए एक सरकारी योजना है।'
    },
    {
      id: 6,
      category: 'DBT प्रक्रिया',
      difficulty: 'कठिन',
      question: 'DBT के संदर्भ में NPCI मैपिंग क्या है?',
      options: [
        'एक नया भुगतान मंच',
        'आपके खाते को नेशनल पेमेंट्स कॉर्पोरेशन ऑफ इंडिया सिस्टम से मैप करना सरकारी लाभ वितरण के लिए',
        'एक प्रकार का बैंक खाता',
        'धोखाधड़ी को रोकने के लिए एक सुरक्षा उपाय'
      ],
      correct: 1,
      explanation: 'NPCI मैपिंग आपके बैंक खाते को नेशनल पेमेंट्स कॉर्पोरेशन ऑफ इंडिया (NPCI) सिस्टम से जोड़ता है, जिससे सिस्टम को सरकारी लाभ वितरण के लिए आपके खाते को पहचान सकता है।'
    },
    {
      id: 7,
      category: 'DBT प्रक्रिया',
      difficulty: 'माध्यम',
      question: 'आधार लिंकिंग में आमतौर पर कितना समय लगता है?',
      options: [
        'तुरंत',
        'उसी दिन',
        '2-3 कार्य दिवस',
        '1-2 सप्ताह'
      ],
      correct: 2,
      explanation: 'बैंक शाखा में आधार लिंकिंग को आमतौर पर 2-3 कार्य दिवस लगते हैं बैंक द्वारा लिंकेज को संसाधित और सत्यापित करने के लिए।'
    },
    {
      id: 8,
      category: 'लिंकिंग बनाम सीडिंग',
      difficulty: 'कठिन',
      question: 'DBT पात्रता के लिए तीन अनिवार्य कदम कौन से हैं?',
      options: [
        'आधार लिंकिंग + Pan लिंकिंग + KYC',
        'आधार लिंकिंग + आधार सीडिंग + NPCI मैपिंग',
        'खाता खोलना + लिंकिंग + सत्यापन',
        'KYC + जैव मीट्रिक + पता प्रमाण'
      ],
      correct: 1,
      explanation: 'तीन अनिवार्य कदम हैं: 1) बैंक शाखा में आधार लिंकिंग, 2) ऑनलाइन बैंकिंग में आधार सीडिंग, 3) NPCI मैपिंग सक्रियकरण। DBT पात्रता के लिए तीनों आवश्यक हैं।'
    },
    {
      id: 9,
      category: 'सामान्य समस्याएं',
      difficulty: 'माध्यम',
      question: 'यदि आधार सीडिंग विफल हो, तो आपको सबसे पहले क्या जांचना चाहिए?',
      options: [
        'आपका इंटरनेट कनेक्शन',
        'क्या आधार लिंकिंग पूरी हो गई है',
        'आपके ब्राउज़र का कैश',
        'आपकी बैंक बैलेंस'
      ],
      correct: 1,
      explanation: 'सीडिंग तब विफल होती है जब लिंकिंग पूरी न हुई हो। दोबारा सीडिंग का प्रयास करने से पहले सत्यापित करें कि लिंकिंग स्थिति पूरी है।'
    },
    {
      id: 10,
      category: 'वास्तविक दृश्य',
      difficulty: 'कठिन',
      question: 'रमेश ने 3 दिन पहले बैंक में अपना आधार लिंक किया। वह कब सीडिंग का प्रयास कर सकता है?',
      options: [
        'बैंक जाने के तुरंत बाद',
        '24 घंटे के बाद',
        'बैंक प्रोसेसिंग पूरी होने के बाद (2-3 कार्य दिवस)',
        'बैंक से लिखित पुष्टिकरण प्राप्त करने के बाद'
      ],
      correct: 2,
      explanation: 'रमेश को लिंकिंग के 2-3 कार्य दिवस बाद सीडिंग का प्रयास करना चाहिए। यह बैंक को उनके सिस्टम में लिंकेज को संसाधित और सत्यापित करने का समय देता है।'
    }
  ]
};

// Scoring Logic
export const scoringRules = {
  pointsPerCorrectAnswer: 10,
  bonusForAllCorrect: 50,
  streakBonus: 5, // bonus per correct in a row
  timeBonus: {
    veryFast: 15, // < 15 seconds per question
    fast: 10, // < 30 seconds
    medium: 5 // < 60 seconds
  }
};

// Achievement Badges
export const badges = {
  en: {
    learner: {
      name: 'Quick Learner',
      description: 'Answered 3 questions correctly',
      icon: '📚',
      requirement: { correctAnswers: 3 }
    },
    expert: {
      name: 'DBT Expert',
      description: 'Scored 90% or higher',
      icon: '🎓',
      requirement: { percentage: 90 }
    },
    speedster: {
      name: 'Speed Runner',
      description: 'Completed quiz in under 5 minutes',
      icon: '⚡',
      requirement: { timeSeconds: 300 }
    },
    perfect: {
      name: 'Perfect Score',
      description: 'Got 100% on the quiz',
      icon: '👑',
      requirement: { percentage: 100 }
    },
    persistence: {
      name: 'Persistence Master',
      description: 'Retook the quiz and improved',
      icon: '💪',
      requirement: { scoreImprovement: true }
    }
  },
  hi: {
    learner: {
      name: 'तेज़ शिक्षार्थी',
      description: '3 प्रश्नों का सही उत्तर दिया',
      icon: '📚',
      requirement: { correctAnswers: 3 }
    },
    expert: {
      name: 'DBT विशेषज्ञ',
      description: '90% या उससे अधिक स्कोर किया',
      icon: '🎓',
      requirement: { percentage: 90 }
    },
    speedster: {
      name: 'स्पीड रनर',
      description: '5 मिनट में क्विज पूरा किया',
      icon: '⚡',
      requirement: { timeSeconds: 300 }
    },
    perfect: {
      name: 'परफेक्ट स्कोर',
      description: 'क्विज में 100% पाया',
      icon: '👑',
      requirement: { percentage: 100 }
    },
    persistence: {
      name: 'दृढ़ता मास्टर',
      description: 'क्विज दोबारा लिया और सुधार किया',
      icon: '💪',
      requirement: { scoreImprovement: true }
    }
  }
};
