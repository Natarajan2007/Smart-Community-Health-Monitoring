import React, { useState, useEffect } from 'react';
import { checkDBTEligibility, getPersonalizedRecommendations } from '../services/openaiService';
import '../scss/EligibilityChecker.scss';

const EligibilityChecker = ({ language = 'en' }) => {
  const [inputs, setInputs] = useState({
    aadhaarLinked: false,
    aadhaarSeeded: false,
    npciMapped: false,
    accountActive: true
  });

  const [eligibility, setEligibility] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [expandedAction, setExpandedAction] = useState(null);

  const labels = {
    en: {
      title: 'Check Your DBT Eligibility',
      subtitle: 'Answer these questions to see your eligibility status',
      checkButton: 'Check My Eligibility',
      resetButton: 'Reset',
      readiness: 'DBT Readiness',
      nextSteps: 'Your Action Items',
      completed: 'Completed ✓',
      pending: 'Pending',
      aadhaarLinked: 'Is your Aadhaar LINKED to your bank account?',
      aadhaarSeeded: 'Have you SEEDED your Aadhaar in online banking?',
      npciMapped: 'Is your NPCI mapping ACTIVATED?',
      accountActive: 'Is your bank account ACTIVE?',
      noActions: 'Great! Your account is already DBT-ready.',
      timeframe: 'Estimated time',
      impact: 'Impact on readiness'
    },
    hi: {
      title: 'अपनी DBT पात्रता जांचें',
      subtitle: 'अपनी पात्रता स्थिति देखने के लिए इन प्रश्नों का उत्तर दें',
      checkButton: 'मेरी पात्रता जांचें',
      resetButton: 'रीसेट करें',
      readiness: 'DBT तैयारी',
      nextSteps: 'आपकी कार्य वस्तुएं',
      completed: 'पूर्ण ✓',
      pending: 'लंबित',
      aadhaarLinked: 'क्या आपका आधार आपके बैंक खाते से जुड़ा है?',
      aadhaarSeeded: 'क्या आपने अपने आधार को ऑनलाइन बैंकिंग में सीड किया है?',
      npciMapped: 'क्या आपकी NPCI मैपिंग सक्रिय है?',
      accountActive: 'क्या आपका बैंक खाता सक्रिय है?',
      noActions: 'बहुत बढ़िया! आपका खाता पहले से ही DBT-तैयार है।',
      timeframe: 'अनुमानित समय',
      impact: 'तैयारी पर प्रभाव'
    }
  };

  const t = labels[language];

  const handleCheckboxChange = (field) => {
    setInputs(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleCheckEligibility = () => {
    const eligibilityResult = checkDBTEligibility(inputs, language);
    const recommendationsResult = getPersonalizedRecommendations(inputs, language);

    if (eligibilityResult.success) {
      setEligibility(eligibilityResult);
      setRecommendations(recommendationsResult.recommendations || []);
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setInputs({
      aadhaarLinked: false,
      aadhaarSeeded: false,
      npciMapped: false,
      accountActive: true
    });
    setShowResults(false);
    setEligibility(null);
    setRecommendations([]);
    setExpandedAction(null);
  };

  const getProgressColor = (readiness) => {
    if (readiness === 100) return '#10b981';
    if (readiness >= 75) return '#f59e0b';
    if (readiness >= 50) return '#f97316';
    return '#ef4444';
  };

  const progressColor = eligibility ? getProgressColor(eligibility.summary.readiness) : '#d1d5db';

  return (
    <div className="eligibility-checker" dir={language === 'hi' ? 'rtl' : 'ltr'}>
      <div className="checker-container">
        <div className="checker-header">
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <div className="input-section">
          <div className="checkbox-group">
            {[
              { id: 'aadhaarLinked', label: t.aadhaarLinked },
              { id: 'aadhaarSeeded', label: t.aadhaarSeeded },
              { id: 'npciMapped', label: t.npciMapped },
              { id: 'accountActive', label: t.accountActive }
            ].map(field => (
              <label key={field.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={inputs[field.id]}
                  onChange={() => handleCheckboxChange(field.id)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{field.label}</span>
                <span className={`status-badge ${inputs[field.id] ? 'completed' : 'pending'}`}>
                  {inputs[field.id] ? t.completed : t.pending}
                </span>
              </label>
            ))}
          </div>

          <div className="button-group">
            <button onClick={handleCheckEligibility} className="btn btn-primary">
              {t.checkButton}
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              {t.resetButton}
            </button>
          </div>
        </div>

        {showResults && eligibility && (
          <div className="results-section">
            {/* Status Card */}
            <div className="status-card" style={{ borderLeftColor: eligibility.summary.color }}>
              <div className="status-header">
                <h3>{eligibility.summary.label}</h3>
                <div className="readiness-gauge">
                  <div className="gauge-label">{t.readiness}</div>
                  <div className="gauge-bar">
                    <div
                      className="gauge-fill"
                      style={{
                        width: `${eligibility.summary.readiness}%`,
                        backgroundColor: eligibility.summary.color
                      }}
                    />
                  </div>
                  <div className="gauge-percentage">{eligibility.summary.readiness}%</div>
                </div>
              </div>
              <p className="status-description">{eligibility.summary.description}</p>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="recommendations-section">
                <h3>{t.nextSteps}</h3>
                <div className="actions-list">
                  {recommendations.map((action, index) => (
                    <div
                      key={action.id}
                      className={`action-card action-${action.type}`}
                      onClick={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
                    >
                      <div className="action-header">
                        <span className="action-priority">{action.priority > 0 ? `Step ${action.priority}` : '✓'}</span>
                        <h4>{action.title}</h4>
                        <span className="expand-icon">{expandedAction === action.id ? '−' : '+'}</span>
                      </div>

                      {expandedAction === action.id && (
                        <div className="action-details">
                          <p className="action-description">{action.description}</p>

                          {action.steps.length > 0 && (
                            <div className="steps">
                              <strong>{language === 'en' ? 'Steps:' : 'कदम:'}</strong>
                              <ol>
                                {action.steps.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                          <div className="meta-info">
                            <div className="meta-item">
                              <strong>{t.timeframe}:</strong>
                              <span>{action.timeline}</span>
                            </div>
                            <div className="meta-item">
                              <strong>{t.impact}:</strong>
                              <span>{action.impact}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {recommendations.length === 1 && (
                  <div className="success-message">
                    <div className="success-icon">✓</div>
                    <p>{t.noActions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityChecker;
