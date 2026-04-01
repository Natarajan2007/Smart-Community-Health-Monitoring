# Analytics & Session Tracking

## Overview

This project now includes comprehensive analytics and session tracking capabilities to monitor user behavior and engagement metrics.

## Features

### 1. **Session Tracking**
- Automatic session creation with unique session ID
- Session duration tracking
- Session expiration (24 hours)
- Page view history
- Event history

### 2. **Event Tracking**
- Page views
- Quiz completion with scores
- Eligibility checks
- Chat messages
- Language changes

### 3. **Data Persistence**
- All analytics stored in browser localStorage
- Survives page refreshes
- 24-hour session retention

### 4. **Analytics Summary**
- Total page views (current session and all-time)
- Event counts by type
- Session duration metrics

## Services

### `sessionAnalyticsService.js`

Main service for analytics operations:

```javascript
// Track page views
trackPageView('home');
trackPageView('chat');

// Track custom events
trackEvent('button_click', { buttonName: 'login' });

// Track specific user actions
trackQuizCompletion('quiz_1', 85, 100);
trackEligibilityCheck('aadhaar_linked', true, 250);
trackChatMessage(150, true);
trackLanguageChange('en', 'hi');

// Get analytics data
getAnalyticsSummary();
getCurrentSession();
getPageViewHistory();
getEventHistory();

// Export and reset
exportSessionData();
clearSessionData();
```

## Custom Hooks

### `useAnalytics.js`

React hooks for analytics tracking in components:

```javascript
// Page tracking hook
usePageTracking('pageName');

// Event tracking hook
const { trackEvent } = useEventTracking();
trackEvent('custom_action', { data: 'value' });

// Language tracking
useLanguageTracking(currentLanguage, previousLanguage);

// Combined analytics hook
const { trackPage, trackEvent, trackLanguage } = useAnalytics();
```

## Integration in App

The App.jsx automatically tracks:
- Page navigation changes
- Language preference changes

```javascript
const { trackPage, trackLanguage } = useAnalytics();

// Automatically tracked when currentPage changes
useEffect(() => {
  trackPage(currentPage);
}, [currentPage, trackPage]);

// Automatically tracked when language changes
useEffect(() => {
  trackLanguage(language, previousLanguage);
}, [language, trackLanguage]);
```

## Data Storage Structure

### Session Object
```javascript
{
  id: 'session_123456_abc'
  startTime: 1640000000000
  lastActivity: 1640001000000
  language: 'en'
  pages: [
    { page: 'home', timestamp: 1640000000000, viewDuration: 0 }
  ]
  events: [
    { name: 'page_view', data: { page: 'home' }, timestamp: 1640000000000 }
  ]
}
```

### Analytics Object
```javascript
{
  totalPageViews: 45
  totalEvents: 120
  eventCounts: {
    page_view: 45,
    quiz_completed: 2,
    chat_message: 73
  }
  lastUpdated: 1640001000000
}
```

## Event Types

- `PAGE_VIEW` - User navigated to a page
- `QUIZ_STARTED` - User started a quiz
- `QUIZ_COMPLETED` - User completed a quiz with score
- `ELIGIBILITY_CHECK` - User performed eligibility check
- `CHAT_MESSAGE` - Chat message sent
- `LANGUAGE_CHANGE` - User changed language preference

## Implementation Example

### In a Component

```javascript
import { useAnalytics } from '../hooks/useAnalytics';
import { trackQuizCompletion } from '../services/sessionAnalyticsService';

export function QuizComponent() {
  const { trackEvent } = useAnalytics();

  const handleQuizComplete = (score, total) => {
    // Track using service
    trackQuizCompletion('quiz_1', score, total);
    
    // Or track custom event
    trackEvent('quiz_custom_action', { 
      score, 
      total,
      timeTaken: 500 
    });
  };

  return (
    <button onClick={() => handleQuizComplete(85, 100)}>
      Submit Quiz
    </button>
  );
}
```

## Debug Information

Get current session analytics in browser console:

```javascript
// Import the service
import { getAnalyticsSummary, exportSessionData } from './services/sessionAnalyticsService';

// View summary
console.log(getAnalyticsSummary());

// Export all data
console.log(exportSessionData());

// View page history
console.log(getPageViewHistory());

// View event history
console.log(getEventHistory());
```

## Privacy Considerations

- All analytics data stored locally in browser
- No data sent to external servers
- User can clear data anytime using `clearSessionData()`
- Sessions expire after 24 hours automatically

## Future Enhancements

- Send analytics to backend server
- Create analytics dashboard
- User behavior patterns analysis
- A/B testing capabilities
- Custom event schemas
- Performance metrics tracking

## Usage in Console

```javascript
// Check current session
localStorage.getItem('app_session')

// Check analytics
localStorage.getItem('app_analytics')

// Clear all data
localStorage.removeItem('app_session')
localStorage.removeItem('app_analytics')
```
