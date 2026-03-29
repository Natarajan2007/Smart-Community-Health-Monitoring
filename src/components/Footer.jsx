import React from 'react';

export default function Footer({ translations }) {
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
