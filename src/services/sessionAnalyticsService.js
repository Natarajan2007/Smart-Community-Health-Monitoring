/**
 * Analytics and Session Tracking Service
 * Tracks user interactions, sessions, and usage metrics
 * Stores data in localStorage for persistence
 */

const STORAGE_KEYS = {
  SESSION: 'app_session',
  PAGE_VIEWS: 'app_page_views',
  USER_EVENTS: 'app_user_events',
  PREFERENCES: 'app_user_preferences',
  ANALYTICS: 'app_analytics',
};

const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  ELIGIBILITY_CHECK: 'eligibility_check',
  CHAT_MESSAGE: 'chat_message',
  LANGUAGE_CHANGE: 'language_change',
};

/**
 * Initialize or retrieve current session
 */
const getOrCreateSession = () => {
  let session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION));

  if (!session || isSessionExpired(session)) {
    session = {
      id: generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      language: 'en',
      pages: [],
      events: [],
      duration: 0,
    };
  } else {
    session.lastActivity = Date.now();
  }

  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  return session;
};

/**
 * Check if session is expired (24 hours)
 */
const isSessionExpired = (session) => {
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  return Date.now() - session.startTime > SESSION_DURATION;
};

/**
 * Generate unique session ID
 */
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Track page view
 */
export const trackPageView = (pageName) => {
  const session = getOrCreateSession();
  const pageView = {
    page: pageName,
    timestamp: Date.now(),
    viewDuration: 0,
  };

  if (!session.pages) session.pages = [];
  session.pages.push(pageView);

  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  recordAnalyticsEvent(ANALYTICS_EVENTS.PAGE_VIEW, { page: pageName });
};

/**
 * Track custom user events
 */
export const trackEvent = (eventName, eventData = {}) => {
  const session = getOrCreateSession();
  const event = {
    name: eventName,
    data: eventData,
    timestamp: Date.now(),
  };

  if (!session.events) session.events = [];
  session.events.push(event);

  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  recordAnalyticsEvent(eventName, eventData);
};

/**
 * Record analytics events with aggregated metrics
 */
const recordAnalyticsEvent = (eventType, eventData = {}) => {
  let analytics = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS)) || {
    totalPageViews: 0,
    totalEvents: 0,
    eventCounts: {},
    lastUpdated: Date.now(),
  };

  if (eventType === ANALYTICS_EVENTS.PAGE_VIEW) {
    analytics.totalPageViews += 1;
  }

  analytics.totalEvents += 1;
  analytics.eventCounts[eventType] = (analytics.eventCounts[eventType] || 0) + 1;
  analytics.lastUpdated = Date.now();

  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
};

/**
 * Track quiz completion
 */
export const trackQuizCompletion = (quizId, score, totalQuestions) => {
  trackEvent(ANALYTICS_EVENTS.QUIZ_COMPLETED, {
    quizId,
    score,
    totalQuestions,
    percentage: (score / totalQuestions) * 100,
  });
};

/**
 * Track eligibility check
 */
export const trackEligibilityCheck = (accountType, isEligible, checkTime) => {
  trackEvent(ANALYTICS_EVENTS.ELIGIBILITY_CHECK, {
    accountType,
    isEligible,
    checkDuration: checkTime,
  });
};

/**
 * Track chat messages
 */
export const trackChatMessage = (messageLength, isUserMessage) => {
  trackEvent(ANALYTICS_EVENTS.CHAT_MESSAGE, {
    messageLength,
    isUserMessage,
    timestamp: Date.now(),
  });
};

/**
 * Track language change
 */
export const trackLanguageChange = (newLanguage, previousLanguage) => {
  const session = getOrCreateSession();
  session.language = newLanguage;
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

  trackEvent(ANALYTICS_EVENTS.LANGUAGE_CHANGE, {
    from: previousLanguage,
    to: newLanguage,
  });
};

/**
 * Get current session data
 */
export const getCurrentSession = () => {
  return getOrCreateSession();
};

/**
 * Get analytics summary
 */
export const getAnalyticsSummary = () => {
  const session = getCurrentSession();
  const analytics = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS)) || {};

  return {
    sessionId: session.id,
    sessionDuration: Date.now() - session.startTime,
    pageViews: session.pages?.length || 0,
    events: session.events?.length || 0,
    language: session.language,
    totalPageViewsAllTime: analytics.totalPageViews || 0,
    totalEventsAllTime: analytics.totalEvents || 0,
    eventBreakdown: analytics.eventCounts || {},
  };
};

/**
 * Get user preferences from session
 */
export const getUserPreferences = () => {
  const session = getCurrentSession();
  return {
    language: session.language,
  };
};

/**
 * Update user preference
 */
export const updateUserPreference = (preferenceKey, value) => {
  const session = getOrCreateSession();

  if (!session.preferences) {
    session.preferences = {};
  }

  session.preferences[preferenceKey] = value;
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
};

/**
 * Export session data (for debugging or data export)
 */
export const exportSessionData = () => {
  const session = getCurrentSession();
  const analytics = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS)) || {};

  return {
    session,
    analytics,
    exportDate: new Date().toISOString(),
  };
};

/**
 * Clear session data (for new user or session reset)
 */
export const clearSessionData = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  localStorage.removeItem(STORAGE_KEYS.PAGE_VIEWS);
  localStorage.removeItem(STORAGE_KEYS.USER_EVENTS);
};

/**
 * Get time spent on current session
 */
export const getSessionDuration = () => {
  const session = getCurrentSession();
  return Date.now() - session.startTime;
};

/**
 * Get page view history
 */
export const getPageViewHistory = () => {
  const session = getCurrentSession();
  return session.pages || [];
};

/**
 * Get event history
 */
export const getEventHistory = () => {
  const session = getCurrentSession();
  return session.events || [];
};

export const ANALYTICS_EVENTS_ENUM = ANALYTICS_EVENTS;

// Initialize session on module load
getOrCreateSession();
