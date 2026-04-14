import React, { memo } from 'react';

/**
 * Footer Component - Page Footer
 * Displays disclaimer and copyright information.
 * 
 * Memoized component to prevent unnecessary re-renders.
 * 
 * @component
 * @param {Object} translations - Translation object containing footer text
 * @returns {JSX.Element} Footer section
 */
function Footer({ translations }) {
  const t = translations.footer;
  
  return (
    <footer className="footer">
      <div className="container">
        <p className="disclaimer">⚖️ {t.disclaimer}</p>
        <p className="copyright">{t.copyright}</p>
      </div>
    </footer>
  );
}

export default memo(Footer);
