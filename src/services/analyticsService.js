// Analytics Service for tracking user engagement and performance

export const analyticsService = {
  // Initialize analytics data in localStorage
  initializeAnalytics: () => {
    const existing = localStorage.getItem('dbtAnalytics');
    if (!existing) {
      const initialData = {
        totalUsers: 0,
        totalSessions: 0,
        totalQuizzesAttempted: 0,
        totalQuizzesCompleted: 0,
        averageQuizScore: 0,
        totalChatInteractions: 0,
        totalEligibilityChecks: 0,
        averageReadinessScore: 0,
        topicEngagement: {
          aadhaarLinking: 0,
          aadhaarSeeding: 0,
          dbtOverview: 0,
          npciMapping: 0,
          troubleshooting: 0
        },
        knowledgeGaps: {
          veryCommon: [],
          common: [],
          rare: []
        },
        userSessions: [],
        quizPerformance: [],
        eligibilityTrends: []
      };
      localStorage.setItem('dbtAnalytics', JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(existing);
  },

  // Track user session
  createSession: (userId = null) => {
    const analytics = analyticsService.initializeAnalytics();
    const session = {
      id: Date.now(),
      userId: userId || `user_${analytics.totalUsers + 1}`,
      startTime: new Date().toISOString(),
      endTime: null,
      activities: [],
      quizzes: [],
      eligibilityChecks: [],
      chatInteractions: 0
    };

    analytics.userSessions.push(session);
    analytics.totalSessions++;
    analytics.totalUsers = new Set(analytics.userSessions.map(s => s.userId)).size;

    localStorage.setItem('dbtAnalytics', JSON.stringify(analytics));
    return session.id;
  },

  // Track quiz attempt
  trackQuizAttempt: (sessionId, score, percentage, questionsCorrect, timeTaken, badges) => {
    const analytics = analyticsService.initializeAnalytics();
    const session = analytics.userSessions.find(s => s.id === sessionId);

    if (session) {
      const quizAttempt = {
        timestamp: new Date().toISOString(),
        score,
        percentage,
        questionsCorrect,
        timeTaken,
        badges
      };

      session.quizzes.push(quizAttempt);
      analytics.totalQuizzesAttempted++;
      if (percentage >= 50) {
        analytics.totalQuizzesCompleted++;
      }

      // Calculate average
      const allScores = [];
      analytics.userSessions.forEach(s => {
        s.quizzes.forEach(q => allScores.push(q.score));
      });
      analytics.averageQuizScore = allScores.length 
        ? Math.round(allScores.reduce((a, b) => a + b) / allScores.length)
        : 0;

      analytics.quizPerformance.push({
        date: new Date().toISOString(),
        score: percentage,
        category: 'quiz'
      });

      localStorage.setItem('dbtAnalytics', JSON.stringify(analytics));
    }
  },

  // Track eligibility check
  trackEligibilityCheck: (sessionId, readinessScore, inputs) => {
    const analytics = analyticsService.initializeAnalytics();
    const session = analytics.userSessions.find(s => s.id === sessionId);

    if (session) {
      const check = {
        timestamp: new Date().toISOString(),
        readinessScore,
        inputs
      };

      session.eligibilityChecks.push(check);
      analytics.totalEligibilityChecks++;

      // Calculate average readiness
      const allReadiness = [];
      analytics.userSessions.forEach(s => {
        s.eligibilityChecks.forEach(e => allReadiness.push(e.readinessScore));
      });
      analytics.averageReadinessScore = allReadiness.length
        ? Math.round(allReadiness.reduce((a, b) => a + b) / allReadiness.length)
        : 0;

      analytics.eligibilityTrends.push({
        date: new Date().toISOString(),
        readiness: readinessScore
      });

      localStorage.setItem('dbtAnalytics', JSON.stringify(analytics));
    }
  },

  // Track chat interaction
  trackChatInteraction: (sessionId, topic = 'general') => {
    const analytics = analyticsService.initializeAnalytics();
    const session = analytics.userSessions.find(s => s.id === sessionId);

    if (session) {
      session.chatInteractions++;
      analytics.totalChatInteractions++;

      // Track topic engagement
      const topicMap = {
        'linking': 'aadhaarLinking',
        'seeding': 'aadhaarSeeding',
        'dbt': 'dbtOverview',
        'npci': 'npciMapping',
        'problem': 'troubleshooting'
      };

      const mappedTopic = Object.keys(topicMap).find(key => topic.toLowerCase().includes(key));
      if (mappedTopic && analytics.topicEngagement[topicMap[mappedTopic]]) {
        analytics.topicEngagement[topicMap[mappedTopic]]++;
      }

      localStorage.setItem('dbtAnalytics', JSON.stringify(analytics));
    }
  },

  // Analyze knowledge gaps
  analyzeKnowledgeGaps: () => {
    const analytics = analyticsService.initializeAnalytics();
    
    // Determine knowledge gaps based on quiz performance
    const gaps = {
      veryCommon: [], // <30% getting it right
      common: [], // 30-60%
      rare: [] // >60%
    };

    // Placeholder logic - would be more sophisticated in production
    if (analytics.totalQuizzesCompleted > 0) {
      const successRate = Math.round((analytics.averageQuizScore / 100) * 100);
      
      if (successRate < 30) {
        gaps.veryCommon.push('Aadhaar Linking', 'NPCI Mapping');
        gaps.common.push('Aadhaar Seeding', 'DBT Overview');
      } else if (successRate < 60) {
        gaps.common.push('Advanced Concepts', 'Troubleshooting');
        gaps.rare.push('Basic Concepts');
      } else {
        gaps.rare.push('All Topics');
      }
    }

    return gaps;
  },

  // Get analytics summary
  getAnalyticsSummary: () => {
    const analytics = analyticsService.initializeAnalytics();
    const gaps = analyticsService.analyzeKnowledgeGaps();

    return {
      summary: {
        totalUsers: analytics.totalUsers,
        totalSessions: analytics.totalSessions,
        totalQuizzesAttempted: analytics.totalQuizzesAttempted,
        totalQuizzesCompleted: analytics.totalQuizzesCompleted,
        averageQuizScore: analytics.averageQuizScore,
        totalChatInteractions: analytics.totalChatInteractions,
        totalEligibilityChecks: analytics.totalEligibilityChecks,
        averageReadinessScore: analytics.averageReadinessScore
      },
      topicEngagement: analytics.topicEngagement,
      knowledgeGaps: gaps,
      performanceTrend: analytics.quizPerformance.slice(-10), // Last 10
      readinessTrend: analytics.eligibilityTrends.slice(-10) // Last 10
    };
  },

  // Get user-specific stats
  getUserStats: (userId) => {
    const analytics = analyticsService.initializeAnalytics();
    const userSessions = analytics.userSessions.filter(s => s.userId === userId);
    
    let totalQuizzes = 0;
    let totalScore = 0;
    let highestScore = 0;
    let totalReadiness = 0;
    let readinessChecks = 0;
    let averageReadiness = 0;

    userSessions.forEach(session => {
      session.quizzes.forEach(quiz => {
        totalQuizzes++;
        totalScore += quiz.score;
        highestScore = Math.max(highestScore, quiz.score);
      });

      session.eligibilityChecks.forEach(check => {
        totalReadiness += check.readinessScore;
        readinessChecks++;
      });
    });

    if (readinessChecks > 0) {
      averageReadiness = Math.round(totalReadiness / readinessChecks);
    }

    return {
      userId,
      sessionsCount: userSessions.length,
      quizzesAttempted: totalQuizzes,
      averageQuizScore: totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0,
      highestQuizScore: highestScore,
      averageReadinessScore: averageReadiness,
      readinessChecks
    };
  },

  // Export analytics data
  exportAnalytics: () => {
    return analyticsService.initializeAnalytics();
  },

  // Reset analytics (admin only)
  resetAnalytics: () => {
    localStorage.removeItem('dbtAnalytics');
    return analyticsService.initializeAnalytics();
  }
};

export default analyticsService;
