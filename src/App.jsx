import React, { useState } from 'react';
import './scss/App.scss';
import { en } from './data/en.js';
import { hi } from './data/hi.js';
import Header from './components/Header';
import Hero from './components/Hero';
import Education from './components/Education';
import Comparison from './components/Comparison';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import ChatPage from './components/ChatPage';
import EligibilityChecker from './components/EligibilityChecker';
import GamifiedQuiz from './components/GamifiedQuiz';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [language, setLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState('home');
  const t = language === 'en' ? en : hi;

  return (
    <ErrorBoundary>
      <div className="app" dir={language === 'hi' ? 'rtl' : 'ltr'}>
        <Header language={language} setLanguage={setLanguage} translations={t} setCurrentPage={setCurrentPage} />
        <main>
          {currentPage === 'home' ? (
            <>
              <Hero translations={t} />
              <Education translations={t} />
              <Comparison translations={t} />
              <FAQ translations={t} />
              <ContactSection translations={t} />
            </>
          ) : currentPage === 'chat' ? (
            <ChatPage language={language} setCurrentPage={setCurrentPage} />
          ) : currentPage === 'eligibility' ? (
            <EligibilityChecker language={language} />
          ) : currentPage === 'quiz' ? (
            <GamifiedQuiz language={language} />
          ) : currentPage === 'analytics' ? (
            <AnalyticsDashboard language={language} />
          ) : null}
        </main>
        <Footer translations={t} />
        {currentPage === 'home' && <ChatWidget language={language} translations={t} />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
