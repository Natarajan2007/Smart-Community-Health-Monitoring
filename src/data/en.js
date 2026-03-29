export const en = {
  lang: 'English',
  langCode: 'en',
  navbar: {
    home: 'Home',
    education: 'Learn',
    comparison: 'Comparison',
    faq: 'FAQ',
    contact: 'Contact'
  },
  hero: {
    title: 'Understanding Aadhaar & DBT',
    subtitle: 'Your Guide to Direct Benefit Transfer and Bank Account Linking',
    cta: 'Get Started'
  },
  education: {
    title: 'Educational Module',
    subtitle: 'Understanding the Basics',
    aadhaarLinked: {
      title: 'Aadhaar-Linked Bank Account',
      description: 'An Aadhaar-linked bank account means your 12-digit Aadhaar number is registered with your bank account. This creates a one-time linkage for identification and verification purposes.',
      features: [
        'Links your Aadhaar to a specific bank account',
        'Used for KYC (Know Your Customer) verification',
        'Created when you open the account or later at the bank',
        'Can have multiple bank accounts linked to one Aadhaar'
      ]
    },
    aadhaarSeeded: {
      title: 'Aadhaar-Seeded Bank Account',
      description: 'Aadhaar-seeding is the process of linking your Aadhaar number with the National Payments Corporation of India (NPCI) system. This enables your bank account to receive digital payments.',
      features: [
        'Aadhaar number is stored in NPCI database',
        'Enables Aadhaar Enabled Payment System (AePS)',
        'Allows cash withdrawals using Aadhaar at ATMs',
        'Required for receiving government transfers via Aadhaar'
      ]
    },
    dbtEnabled: {
      title: 'DBT-Enabled Account',
      description: 'DBT (Direct Benefit Transfer) enabled means your bank account is active in the government\'s DBT system to receive welfare benefits like scholarships, subsidies, and allowances directly.',
      features: [
        'Account is registered in government DBT portal',
        'Receives direct government payments',
        'Requires Aadhaar seeding in NPCI',
        'Must have active bank account with proper KYC'
      ]
    },
    step1: 'Open a Bank Account',
    step2: 'Link with Aadhaar (KYC)',
    step3: 'Seed Aadhaar with NPCI',
    step4: 'Register for DBT Benefits',
    success: 'Your account is now ready to receive government benefits!'
  },
  comparison: {
    title: 'Comparison: Know the Difference',
    subtitle: 'Understanding the three banking concepts',
    columnHeaders: ['Feature', 'Aadhaar-Linked', 'Aadhaar-Seeded', 'DBT-Enabled'],
    rows: [
      {
        feature: 'Definition',
        linked: 'Aadhaar registered with bank for KYC',
        seeded: 'Aadhaar linked to NPCI system',
        dbt: 'Account activated in government DBT system'
      },
      {
        feature: 'Purpose',
        linked: 'Customer identification',
        seeded: 'Enable digital payments',
        dbt: 'Receive government benefits'
      },
      {
        feature: 'Authority',
        linked: 'Bank',
        seeded: 'NPCI',
        dbt: 'Government agency'
      },
      {
        feature: 'Can Receive Benefits',
        linked: '❌ No',
        seeded: '⚠️ Partially',
        dbt: '✅ Yes'
      },
      {
        feature: 'Required for AePS',
        linked: '❌ No',
        seeded: '✅ Yes',
        dbt: '✅ Yes'
      },
      {
        feature: 'Multiple Accounts',
        linked: '✅ Yes',
        seeded: 'Limited to 1-2',
        dbt: 'Limited to 1-2'
      }
    ]
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Get answers to common questions',
    questions: [
      {
        q: 'Can I have multiple Aadhaar-linked bank accounts?',
        a: 'Yes! You can link your single Aadhaar number to multiple bank accounts across different banks. However, for DBT and NPCI seeding, it\'s typically limited to 1-2 active accounts.'
      },
      {
        q: 'What if my Aadhaar is not seeded with NPCI?',
        a: 'Visit your bank and request Aadhaar seeding. The process is free and usually completed within 24-48 hours. You\'ll need your Aadhaar number and bank account details.'
      },
      {
        q: 'Why is my scholarship not been credited?',
        a: 'Common reasons: (1) Aadhaar not seeded with NPCI, (2) Bank account not registered in DBT portal, (3) Incorrect Aadhaar number in government records, (4) Account balance limit exceeded. Visit your bank to verify seeding status.'
      },
      {
        q: 'Is Aadhaar linking free?',
        a: 'Yes! Aadhaar linking and seeding are completely free. Your bank cannot charge any fee for these services. If asked for money, report it immediately.'
      },
      {
        q: 'How do I check if my account is DBT-enabled?',
        a: 'Contact your bank or send "DBT Status" to the relevant government portal. Some banks have online banking options to check DBT eligibility. Ask your bank customer service for help.'
      },
      {
        q: 'Can I receive benefits in a joint account?',
        a: 'Most government schemes require individual (sole proprietor) accounts for DBT benefits. Joint accounts usually cannot receive direct benefit transfers. Verify with your bank.'
      },
      {
        q: 'What is the waiting period after linking Aadhaar?',
        a: 'Aadhaar seeding typically takes 24-48 hours. DBT registration can take 5-7 working days. However, exact timelines vary by bank and government agency.'
      },
      {
        q: 'What if my bank shows "Aadhaar doesn\'t exist"?',
        a: 'This means your Aadhaar number in bank records doesn\'t match UIDAI database. Visit UIDAI office or check your Aadhaar card. Update your Aadhaar details at the bank.'
      }
    ]
  },
  commonIssues: {
    title: 'Common Problems & Solutions',
    issues: [
      {
        problem: '❌ "Aadhaar Seed Status Failed"',
        solution: 'This means NPCI did not record your Aadhaar seeding. Wait 48 hours and retry. If issue persists, visit your bank with Aadhaar card, bank passbook, and ID proof.'
      },
      {
        problem: '❌ "Account Not Registered in DBT"',
        solution: 'Contact your bank to register your account in DBT portal. Provide your Aadhaar, PAN, and account details. Registration is free and usually takes 5-7 days.'
      },
      {
        problem: '❌ "Multiple Aadhaar Records Found"',
        solution: 'You may have duplicate Aadhaar records. Contact UIDAI (1-800-300-1947) for consolidation or visit your nearest Aadhaar office with identity and address proof.'
      },
      {
        problem: '❌ "Account Does Not Support Digital Payments"',
        solution: 'Your account type may not support it. Check with your bank if you have a Basic Savings Account or Student Account. Upgrade to a standard Savings Account if needed.'
      }
    ]
  },
  contactSection: {
    title: 'Need Help?',
    subtitle: 'Important Contact Information',
    contacts: [
      { name: 'UIDAI Helpline', contact: '1-800-300-1947', desc: 'For Aadhaar-related issues' },
      { name: 'Your Bank Helpline', contact: 'Check your bank card', desc: 'For account and seeding issues' },
      { name: 'DBT Government Portal', contact: 'Visit dbt.gov.in', desc: 'For benefit registration' },
      { name: 'NPCI Helpline', contact: '1-800-200-3344', desc: 'For payment system issues' }
    ]
  },
  footer: {
    disclaimer: 'This is an educational resource. For official information, please refer to government sources.',
    copyright: '© 2024 Aadhaar & DBT Awareness Initiative'
  }
};
