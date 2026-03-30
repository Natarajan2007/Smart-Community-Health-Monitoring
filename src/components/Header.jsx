import React from 'react';

export default function Header({ language, setLanguage, translations, setCurrentPage }) {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <button 
              onClick={() => setCurrentPage('home')}
              className="logo-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <h1>{translations.navbar.home}</h1>
            </button>
          </div>
          <ul className="nav-links">
            <li><a href="#education">{translations.navbar.education}</a></li>
            <li><a href="#comparison">{translations.navbar.comparison}</a></li>
            <li><a href="#faq">{translations.navbar.faq}</a></li>
            <li><a href="#contact">{translations.navbar.contact}</a></li>
            <li>
              <button 
                onClick={() => setCurrentPage('eligibility')}
                className="feature-nav-btn"
              >
                ✓ {language === 'en' ? 'Check Eligibility' : 'पात्रता जांचें'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('quiz')}
                className="feature-nav-btn"
              >
                🎓 {language === 'en' ? 'Quiz' : 'क्विज़'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('analytics')}
                className="feature-nav-btn"
              >
                📊 {language === 'en' ? 'Analytics' : 'विश्लेषण'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('chat')}
                className="chat-nav-btn"
              >
                💬 {language === 'en' ? 'Chat' : 'चैट'}
              </button>
            </li>
          </ul>
          <div className="language-switcher">
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button 
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हिंदी
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
