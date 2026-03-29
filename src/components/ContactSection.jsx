import React from 'react';

export default function ContactSection({ translations }) {
  const t = translations.contactSection;
  
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2>{t.title}</h2>
        <p className="subtitle">{t.subtitle}</p>
        
        <div className="contacts-grid">
          {t.contacts.map((contact, idx) => (
            <div key={idx} className="contact-card">
              <h4>📞 {contact.name}</h4>
              <p className="contact-number">{contact.contact}</p>
              <p className="contact-desc">{contact.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
