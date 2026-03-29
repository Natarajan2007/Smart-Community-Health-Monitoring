import React, { useState } from 'react';

export default function FAQ({ translations }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const t = translations.faq;
  
  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="faq">
      <div className="container">
        <h2>{t.title}</h2>
        <p className="subtitle">{t.subtitle}</p>
        
        <div className="faq-container">
          {t.questions.map((item, idx) => (
            <div key={idx} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleExpand(idx)}
              >
                <span>{item.q}</span>
                <span className="faq-icon">{expandedIndex === idx ? '−' : '+'}</span>
              </button>
              {expandedIndex === idx && (
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
