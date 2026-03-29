import React from 'react';

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
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-icon">🌱</div>
            <h3>{t.aadhaarSeeded.title}</h3>
            <p>{t.aadhaarSeeded.description}</p>
            <ul>
              {t.aadhaarSeeded.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-icon">✅</div>
            <h3>{t.dbtEnabled.title}</h3>
            <p>{t.dbtEnabled.description}</p>
            <ul>
              {t.dbtEnabled.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
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
              <div key={idx} className="issue-card">
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
