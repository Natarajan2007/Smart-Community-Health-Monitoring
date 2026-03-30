import { dbtEligibilityRules } from '../data/dbtRules.js';

// Eligibility Checker Service
export const eligibilityService = {
  // Check DBT eligibility
  checkEligibility: (userInputs) => {
    return dbtEligibilityRules.checkEligibility({
      aadhaarLinked: userInputs.aadhaarLinked || false,
      aadhaarSeeded: userInputs.aadhaarSeeded || false,
      npciMapped: userInputs.npciMapped || false,
      accountActive: userInputs.accountActive !== false // default true
    });
  },

  // Get pending actions
  getPendingActions: (userInputs) => {
    return dbtEligibilityRules.getPendingActions({
      aadhaarLinked: userInputs.aadhaarLinked || false,
      aadhaarSeeded: userInputs.aadhaarSeeded || false,
      npciMapped: userInputs.npciMapped || false,
      accountActive: userInputs.accountActive !== false
    });
  },

  // Get common issues
  getCommonIssues: (language = 'en') => {
    return dbtEligibilityRules.commonIssues[language] || dbtEligibilityRules.commonIssues.en;
  },

  // Format eligibility report
  generateReport: (userInputs, language = 'en') => {
    const eligibility = eligibilityService.checkEligibility(userInputs);
    const actions = eligibilityService.getPendingActions(userInputs);
    const issues = eligibilityService.getCommonIssues(language);

    return {
      status: eligibility,
      pendingActions: actions,
      commonIssues: issues,
      summary: {
        label: eligibility.label[language],
        description: eligibility.description[language],
        readiness: eligibility.readiness,
        color: eligibility.color
      }
    };
  },

  // Validate inputs
  validateInputs: (inputs) => {
    const errors = [];

    if (typeof inputs.aadhaarLinked !== 'boolean') {
      errors.push('Aadhaar Linked must be true or false');
    }
    if (typeof inputs.aadhaarSeeded !== 'boolean') {
      errors.push('Aadhaar Seeded must be true or false');
    }
    if (typeof inputs.npciMapped !== 'boolean') {
      errors.push('NPCI Mapped must be true or false');
    }
    if (inputs.accountActive !== undefined && typeof inputs.accountActive !== 'boolean') {
      errors.push('Account Active must be true or false');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Export for API usage
export default eligibilityService;
