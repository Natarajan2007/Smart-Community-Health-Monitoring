import React from 'react';

export default function Hero({ translations }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{translations.hero.title}</h1>
        <p>{translations.hero.subtitle}</p>
        <button className="cta-btn">{translations.hero.cta}</button>
      </div>
    </section>
  );
}
