import React, { memo } from 'react';

/**
 * Comparison Component - Side-by-side Account Comparison
 * Displays a detailed comparison table of Aadhaar-Linked, Aadhaar-Seeded, and DBT-Enabled accounts.
 * 
 * Memoized component to prevent unnecessary re-renders.
 * 
 * @component
 * @param {Object} translations - Translation object containing comparison data and text
 * @returns {JSX.Element} Comparison section with table and summary boxes
 */
function Comparison({ translations }) {
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
                  <th key={`header_${idx}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((row, idx) => (
                <tr key={`row_${idx}`}>
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

export default memo(Comparison);
