import React from 'react';

/**
 * Education Component - Core Educational Content
 * 
 * Displays three main concepts about bank account types:
 * - Aadhaar-Linked Bank Accounts
 * - Aadhaar-Seeded Bank Accounts
 * - DBT-Enabled Accounts
 * 
 * Each concept is presented in an interactive card with features list.
 * Fully supports bilingual content (English/Hindi with RTL layout).
 * 
 * @component
 * @param {Object} translations - Translation object containing education section text and content
 * @param {Object} translations.education - Education module translations
 * @returns {JSX.Element} Educational content section with three account type cards
 * 
 * @example
 * <Education translations={translations} />
 */
export default function Education({ translations }) {
  const t = translations.education;
  
  return (
    <section id="education" className="education">
      <div className="container">
        <h2>{t.title}</h2>
        <p className="subtitle">{t.subtitle}</p>
        
        <div className="education-grid">
          <div className="card">
            <div className="card-icon">📎</div>
            <h3>{t.aadhaarLinked.title}</h3>
            <p>{t.aadhaarLinked.description}</p>
            <ul>
              {t.aadhaarLinked.features.map((feature, idx) => (
                <li key={`linked_${idx}`}>✓ {feature}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-icon">🌱</div>
            <h3>{t.aadhaarSeeded.title}</h3>
            <p>{t.aadhaarSeeded.description}</p>
            <ul>
              {t.aadhaarSeeded.features.map((feature, idx) => (
                <li key={`seeded_${idx}`}>✓ {feature}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-icon">✅</div>
            <h3>{t.dbtEnabled.title}</h3>
            <p>{t.dbtEnabled.description}</p>
            <ul>
              {t.dbtEnabled.features.map((feature, idx) => (
                <li key={`dbt_${idx}`}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="steps">
          <h3>📋 {translations.footer.copyright.includes('2024') ? 'How to Get Benefits' : 'लाभ कैसे प्राप्त करें'}</h3>
          <div className="step-flow">
            <div className="step">
              <div className="step-number">1</div>
              <p>{t.step1}</p>
            </div>
            <div className="arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <p>{t.step2}</p>
            </div>
            <div className="arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <p>{t.step3}</p>
            </div>
            <div className="arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <p>{t.step4}</p>
            </div>
          </div>
          <p className="success-msg">✅ {t.success}</p>
        </div>

        <div className="issues-section">
          <h3>⚠️ {translations.commonIssues.title}</h3>
          <div className="issues-grid">
            {translations.commonIssues.issues.map((issue, idx) => (
              <div key={`issue_${idx}`} className="issue-card">
                <h4>{issue.problem}</h4>
                <p>{issue.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
