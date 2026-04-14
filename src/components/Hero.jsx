import React, { memo } from 'react';

/**
 * Hero Component - Landing Section
 * Displays the main hero banner with title, subtitle, and call-to-action button.
 * 
 * Memoized component to prevent unnecessary re-renders.
 * 
 * @component
 * @param {Object} translations - Translation object containing hero text
 * @returns {JSX.Element} Hero section
 */
function Hero({ translations }) {
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

export default memo(Hero);
