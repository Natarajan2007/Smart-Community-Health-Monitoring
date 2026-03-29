import React from 'react';

export default function Comparison({ translations }) {
  const t = translations.comparison;
  
  return (
    <section id="comparison" className="comparison">
      <div className="container">
        <h2>{t.title}</h2>
        <p className="subtitle">{t.subtitle}</p>
        
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                {t.columnHeaders.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="feature-name">{row.feature}</td>
                  <td>{row.linked}</td>
                  <td>{row.seeded}</td>
                  <td>{row.dbt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="comparison-summary">
          <div className="summary-box green">
            <h4>✅ DBT-Enabled Account</h4>
            <p>The ONLY way to receive government benefits directly</p>
          </div>
          <div className="summary-box yellow">
            <h4>⚠️ Aadhaar-Seeded Account</h4>
            <p>Necessary step before DBT activation</p>
          </div>
          <div className="summary-box blue">
            <h4>📎 Aadhaar-Linked Account</h4>
            <p>Basic requirement, not sufficient for benefits</p>
          </div>
        </div>
      </div>
    </section>
  );
}
