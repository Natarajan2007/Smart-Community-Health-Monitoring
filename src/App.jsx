import React, { useState, Suspense } from 'react';
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
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingFallback } from './utils/lazyLoading';

// Lazy load non-critical components
const ChatPage = React.lazy(() => import('./components/ChatPage'));
const EligibilityChecker = React.lazy(() => import('./components/EligibilityChecker'));
const GamifiedQuiz = React.lazy(() => import('./components/GamifiedQuiz'));
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));

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
            <Suspense fallback={<LoadingFallback />}>
              <ChatPage language={language} setCurrentPage={setCurrentPage} />
            </Suspense>
          ) : currentPage === 'eligibility' ? (
            <Suspense fallback={<LoadingFallback />}>
              <EligibilityChecker language={language} />
            </Suspense>
          ) : currentPage === 'quiz' ? (
            <Suspense fallback={<LoadingFallback />}>
              <GamifiedQuiz language={language} />
            </Suspense>
          ) : currentPage === 'analytics' ? (
            <Suspense fallback={<LoadingFallback />}>
              <AnalyticsDashboard language={language} />
            </Suspense>
          ) : null}
        </main>
        <Footer translations={t} />
        {currentPage === 'home' && <ChatWidget language={language} translations={t} />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
