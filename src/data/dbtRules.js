// DBT Eligibility Rules Engine
export const dbtEligibilityRules = {
  // Define all possible states and their DBT readiness
  states: {
    AADHAAR_LINKED: "aadhaar_linked",
    AADHAAR_SEEDED: "aadhaar_seeded",
    NPCI_MAPPED: "npci_mapped",
    ACCOUNT_ACTIVE: "account_active"
  },

  // Eligibility scenarios
  scenarios: {
    FULLY_ENABLED: {
      id: "fully_enabled",
      label: { en: "DBT Ready ✅", hi: "DBT तैयार ✅" },
      description: {
        en: "Your account is fully DBT-enabled and ready to receive benefits.",
        hi: "आपका खाता पूरी तरह से DBT-सक्षम है और लाभ प्राप्त करने के लिए तैयार है।"
      },
      requirements: {
        aadhaarLinked: true,
        aadhaarSeeded: true,
        npciMapped: true,
        accountActive: true
      },
      readiness: 100,
      color: "#10b981"
    },

    NEARLY_COMPLETE: {
      id: "nearly_complete",
      label: { en: "Almost Ready ⚠️", hi: "लगभग तैयार ⚠️" },
      description: {
        en: "Your account is almost DBT-enabled. Complete the missing steps below.",
        hi: "आपका खाता लगभग DBT-सक्षम है। नीचे दिए गए लापता कदमों को पूरा करें।"
      },
      requirements: {
        aadhaarLinked: true,
        aadhaarSeeded: true,
        npciMapped: true,
        accountActive: false
      },
      readiness: 75,
      color: "#f59e0b"
    },

    PARTIALLY_CONFIGURED: {
      id: "partially_configured",
      label: { en: "In Progress 🔄", hi: "चल रहा है 🔄" },
      description: {
        en: "Your account has some DBT requirements met. More steps needed.",
        hi: "आपके खाते में कुछ DBT आवश्यकताएं पूरी हो गई हैं। अधिक कदम आवश्यक हैं।"
      },
      requirements: {
        aadhaarLinked: true,
        aadhaarSeeded: true,
        npciMapped: false,
        accountActive: false
      },
      readiness: 50,
      color: "#f97316"
    },

    NEEDS_AADHAAR: {
      id: "needs_aadhaar",
      label: { en: "Aadhaar Required 🔴", hi: "आधार आवश्यक 🔴" },
      description: {
        en: "Your account needs Aadhaar linking to be DBT-enabled.",
        hi: "DBT-सक्षम होने के लिए आपके खाते को आधार लिंकिंग की आवश्यकता है।"
      },
      requirements: {
        aadhaarLinked: false,
        aadhaarSeeded: false,
        npciMapped: false,
        accountActive: true
      },
      readiness: 0,
      color: "#ef4444"
    }
  },

  // Get eligibility status based on inputs
  checkEligibility: function(inputs) {
    const {
      aadhaarLinked = false,
      aadhaarSeeded = false,
      npciMapped = false,
      accountActive = true
    } = inputs;

    // Match against scenarios
    if (aadhaarLinked && aadhaarSeeded && npciMapped && accountActive) {
      return this.scenarios.FULLY_ENABLED;
    }

    if (aadhaarLinked && aadhaarSeeded && npciMapped && !accountActive) {
      return this.scenarios.NEARLY_COMPLETE;
    }

    if (aadhaarLinked && aadhaarSeeded && !npciMapped) {
      return this.scenarios.PARTIALLY_CONFIGURED;
    }

    if (!aadhaarLinked || !aadhaarSeeded) {
      return this.scenarios.NEEDS_AADHAAR;
    }

    return this.scenarios.NEEDS_AADHAAR;
  },

  // Get pending actions
  getPendingActions: function(inputs) {
    const actions = [];

    if (!inputs.aadhaarLinked) {
      actions.push({
        id: "link_aadhaar",
        priority: 1,
        label: { en: "Link Aadhaar to Bank Account", hi: "बैंक खाते से आधार को लिंक करें" },
        steps: {
          en: [
            "Visit your bank branch with original Aadhaar card and passbook",
            "Fill the Aadhaar linking form (form available at bank)",
            "Submit identity and address proof",
            "Bank processes the request (takes 2-3 working days)"
          ],
          hi: [
            "मूल आधार कार्ड और पासबुक के साथ अपनी बैंक शाखा जाएं",
            "आधार लिंकिंग फॉर्म भरें (फॉर्म बैंक में उपलब्ध है)",
            "पहचान और पता प्रमाण जमा करें",
            "बैंक अनुरोध को संसाधित करता है (2-3 कार्य दिवस लगते हैं)"
          ]
        },
        timeframe: { en: "2-3 working days", hi: "2-3 कार्य दिवस" }
      });
    }

    if (!inputs.aadhaarSeeded) {
      actions.push({
        id: "seed_aadhaar",
        priority: 2,
        label: { en: "Seed Aadhaar into Bank Account", hi: "बैंक खाते में आधार सीड करें" },
        steps: {
          en: [
            "Log into your online banking portal",
            "Navigate to 'Aadhaar Linking' or 'KYC Updates'",
            "Enter your 12-digit Aadhaar number",
            "Verify via OTP sent to registered mobile number",
            "Confirmation message displays when successful"
          ],
          hi: [
            "अपने ऑनलाइन बैंकिंग पोर्टल में लॉगिन करें",
            "'आधार लिंकिंग' या 'KYC अपडेट' पर जाएं",
            "अपना 12-अंकीय आधार नंबर दर्ज करें",
            "पंजीकृत मोबाइल नंबर पर भेजे गए OTP से सत्यापन करें",
            "सफल होने पर पुष्टिकरण संदेश प्रदर्शित होता है"
          ]
        },
        timeframe: { en: "Instant to 24 hours", hi: "तुरंत से 24 घंटे" }
      });
    }

    if (!inputs.npciMapped) {
      actions.push({
        id: "activate_npci",
        priority: 3,
        label: { en: "Activate NPCI Mapping", hi: "NPCI मैपिंग सक्रिय करें" },
        steps: {
          en: [
            "Contact your bank's customer service",
            "Request 'NPCI Mapping Activation' or 'DBT Activation'",
            "Provide Aadhaar number and account details",
            "Bank processes the request",
            "You'll receive confirmation via SMS"
          ],
          hi: [
            "अपने बैंक की ग्राहक सेवा से संपर्क करें",
            "'NPCI मैपिंग सक्रियकरण' या 'DBT सक्रियकरण' का अनुरोध करें",
            "आधार नंबर और खाता विवरण प्रदान करें",
            "बैंक अनुरोध को संसाधित करता है",
            "आपको SMS के माध्यम से पुष्टिकरण प्राप्त होगा"
          ]
        },
        timeframe: { en: "1-2 working days", hi: "1-2 कार्य दिवस" }
      });
    }

    if (!inputs.accountActive) {
      actions.push({
        id: "activate_account",
        priority: 4,
        label: { en: "Activate Your Account", hi: "अपने खाते को सक्रिय करें" },
        steps: {
          en: [
            "Log into your online banking portal",
            "Navigate to 'Account Settings'",
            "Check if account status is 'Active'",
            "If inactive, contact bank to activate",
            "May require minimum balance"
          ],
          hi: [
            "अपने ऑनलाइन बैंकिंग पोर्टल में लॉगिन करें",
            "'खाता सेटिंग्स' पर जाएं",
            "जांचें कि खाता स्थिति 'सक्रिय' है या नहीं",
            "यदि निष्क्रिय है, तो सक्रिय करने के लिए बैंक से संपर्क करें",
            "न्यूनतम शेष राशि की आवश्यकता हो सकती है"
          ]
        },
        timeframe: { en: "Immediately", hi: "तुरंत" }
      });
    }

    return actions.sort((a, b) => a.priority - b.priority);
  },

  // Common issues and solutions
  commonIssues: {
    en: {
      "aadhaar_not_linking": {
        title: "Aadhaar Not Getting Linked",
        solution: "Check if your mobile number matches in bank records. Visit branch with updated mobile SIM. Sometimes Aadhaar SEEDING doesn't work if LINKING isn't complete first.",
        steps: [
          "Verify your Aadhaar number is correct (12 digits)",
          "Check if mobile number in Aadhaar matches bank records",
          "Visit bank branch with Aadhaar and ID proof",
          "Request bank to manually link Aadhaar",
          "Wait for bank confirmation"
        ]
      },
      "dbt_not_working": {
        title: "DBT Benefits Not Received",
        solution: "Verify all three steps are complete: Aadhaar LINKED, Aadhaar SEEDED, NPCI MAPPED. Check your account for blockages or suspended status.",
        steps: [
          "Confirm Aadhaar linking status with bank",
          "Check Aadhaar seeding in online banking",
          "Verify NPCI mapping is activated",
          "Check if account is active and no pending KYC",
          "Contact benefit disbursing ministry"
        ]
      },
      "account_blocked": {
        title: "Account Blocked or Suspended",
        solution: "Accounts get blocked due to inactivity, regulatory issues, or fraud suspicion. Visit bank with identity proof to unblock.",
        steps: [
          "Contact bank immediately",
          "Request reason for suspension",
          "Provide required documents if KYC expired",
          "File unblocking request",
          "Bank processes within 5-7 working days"
        ]
      },
      "seeding_failed": {
        title: "Aadhaar Seeding Failed",
        solution: "Seeding fails if LINKING isn't complete first. Ensure account is active, no duplicate Aadhaar issues.",
        steps: [
          "Ensure Aadhaar LINKING is complete first",
          "Check if account is active",
          "Try seeding again after 24 hours",
          "Use different browser or clear cache",
          "Visit bank if online method fails"
        ]
      }
    },
    hi: {
      "aadhaar_not_linking": {
        title: "आधार लिंक नहीं हो रहा है",
        solution: "जांचें कि आपका मोबाइल नंबर बैंक रिकॉर्ड से मेल खाता है। अपडेट किए गए मोबाइल SIM के साथ शाखा पर जाएं। कभी-कभी आधार SEEDING काम नहीं करता है यदि LINKING पहले पूर्ण नहीं होता है।",
        steps: [
          "सत्यापित करें कि आपका आधार नंबर सही है (12 अंक)",
          "जांचें कि आधार में मोबाइल नंबर बैंक रिकॉर्ड से मेल खाता है",
          "आधार और ID प्रमाण के साथ बैंक शाखा पर जाएं",
          "बैंक से आधार को मैन्युअल रूप से लिंक करने का अनुरोध करें",
          "बैंक की पुष्टिकरण का प्रतीक्षा करें"
        ]
      },
      "dbt_not_working": {
        title: "DBT लाभ प्राप्त नहीं हो रहे हैं",
        solution: "सत्यापित करें कि सभी तीन चरण पूर्ण हैं: आधार LINKED, आधार SEEDED, NPCI MAPPED। अपने खाते में ब्लॉकेज या निलंबित स्थिति की जांच करें।",
        steps: [
          "बैंक के साथ आधार लिंकिंग स्थिति की पुष्टि करें",
          "ऑनलाइन बैंकिंग में आधार सीडिंग की जांच करें",
          "NPCI मैपिंग सक्रिय है यह सत्यापित करें",
          "जांचें कि खाता सक्रिय है और कोई लंबित KYC नहीं है",
          "लाभ वितरण मंत्रालय से संपर्क करें"
        ]
      },
      "account_blocked": {
        title: "खाता ब्लॉक या निलंबित है",
        solution: "खाते निष्क्रियता, नियामक समस्याओं या धोखाधड़ी संदेह के कारण ब्लॉक हो जाते हैं। पहचान प्रमाण के साथ बैंक जाएं।",
        steps: [
          "तुरंत बैंक से संपर्क करें",
          "निलंबन का कारण पूछें",
          "यदि KYC समाप्त हुआ तो आवश्यक दस्तावेज प्रदान करें",
          "अनब्लॉकिंग अनुरोध दाखिल करें",
          "बैंक 5-7 कार्य दिवसों में संसाधित करता है"
        ]
      },
      "seeding_failed": {
        title: "आधार सीडिंग विफल हुई",
        solution: "सीडिंग विफल होती है यदि LINKING पहले पूर्ण नहीं है। सुनिश्चित करें कि खाता सक्रिय है, कोई डुप्लिकेट आधार समस्याएं नहीं हैं।",
        steps: [
          "सुनिश्चित करें कि आधार LINKING पहले पूर्ण है",
          "जांचें कि खाता सक्रिय है",
          "24 घंटे के बाद फिर से सीडिंग का प्रयास करें",
          "विभिन्न ब्राउज़र का उपयोग करें या कैश साफ़ करें",
          "यदि ऑनलाइन विधि विफल हो तो बैंक जाएं"
        ]
      }
    }
  }
};
