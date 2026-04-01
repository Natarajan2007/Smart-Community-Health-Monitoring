import { useEffect, useCallback } from 'react';
import { trackPageView, trackEvent, trackLanguageChange } from '../services/sessionAnalyticsService';

/**
 * Custom hook for tracking page views
 * @param {string} pageName - Name of the page to track
 */
export const usePageTracking = (pageName) => {
  useEffect(() => {
    trackPageView(pageName);
  }, [pageName]);
};

/**
 * Custom hook for tracking events with cleanup
 */
export const useEventTracking = () => {
  const track = useCallback((eventName, eventData) => {
    trackEvent(eventName, eventData);
  }, []);

  return { trackEvent: track };
};

/**
 * Custom hook for tracking language changes
 */
export const useLanguageTracking = (currentLanguage, previousLanguage) => {
  useEffect(() => {
    if (currentLanguage !== previousLanguage) {
      trackLanguageChange(currentLanguage, previousLanguage);
    }
  }, [currentLanguage, previousLanguage]);
};

/**
 * Combined hook for tracking multiple analytics
 */
export const useAnalytics = () => {
  const trackPage = useCallback((pageName) => {
    trackPageView(pageName);
  }, []);

  const trackCustom = useCallback((eventName, eventData) => {
    trackEvent(eventName, eventData);
  }, []);

  const trackLanguage = useCallback((newLang, prevLang) => {
    trackLanguageChange(newLang, prevLang);
  }, []);

  return {
    trackPage,
    trackEvent: trackCustom,
    trackLanguage,
  };
};
