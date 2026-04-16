import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import '../scss/AnalyticsDashboard.scss';

const AnalyticsDashboard = ({ language = 'en' }) => {
  const [analytics, setAnalytics] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  const labels = {
    en: {
      title: 'Awareness Analytics Dashboard',
      subtitle: 'Track platform engagement and user learning outcomes',
      overview: 'Overview',
      users: 'Users',
      quizzes: 'Quizzes',
      knowledge: 'Knowledge Gaps',
      eligibility: 'Eligibility',
      totalUsers: 'Total Users',
      totalSessions: 'Total Sessions',
      totalInteractions: 'Total Interactions',
      avgScore: 'Average Score',
      quizzesCompleted: 'Quizzes Completed',
      avgReadiness: 'Avg Readiness',
      topicEngagement: 'Topic Engagement',
      knowledgeGaps: 'Knowledge Gaps',
      veryCommon: 'Very Common Issues',
      common: 'Common Issues',
      rare: 'Rarely Asked',
      noData: 'No data available yet',
      engaging: 'Most Engaging Topic',
      leastEngaging: 'Least Engaging Topic',
      completionRate: 'Quiz Completion Rate',
      performance: 'Performance Trend',
      readinessTrend: 'Readiness Trend'
    },
    hi: {
      title: 'जागरूकता विश्लेषण डैशबोर्ड',
      subtitle: 'प्लेटफॉर्म एनगेजमेंट और उपयोगकर्ता सीखने के परिणामों को ट्रैक करें',
      overview: 'अवलोकन',
      users: 'उपयोगकर्ता',
      quizzes: 'क्विज़',
      knowledge: 'ज्ञान अंतराल',
      eligibility: 'पात्रता',
      totalUsers: 'कुल उपयोगकर्ता',
      totalSessions: 'कुल सेशन',
      totalInteractions: 'कुल इंटरैक्शन',
      avgScore: 'औसत स्कोर',
      quizzesCompleted: 'पूर्ण किए गए क्विज',
      avgReadiness: 'औसत तैयारी',
      topicEngagement: 'विषय एनगेजमेंट',
      knowledgeGaps: 'ज्ञान अंतराल',
      veryCommon: 'बहुत सामान्य समस्याएं',
      common: 'सामान्य समस्याएं',
      rare: 'शायद ही पूछा जाता है',
      noData: 'अभी कोई डेटा उपलब्ध नहीं है',
      engaging: 'सबसे आकर्षक विषय',
      leastEngaging: 'सबसे कम आकर्षक विषय',
      completionRate: 'क्विज समापन दर',
      performance: 'प्रदर्शन प्रवृत्ति',
      readinessTrend: 'तैयारी प्रवृत्ति'
    }
  };

  const t = labels[language];

  useEffect(() => {
    const data = analyticsService.getAnalyticsSummary();
    setAnalytics(data);
  }, []);

  if (!analytics) {
    return <div className="analytics-dashboard">{t.noData}</div>;
  }

  const topicEntries = Object.entries(analytics.topicEngagement).sort((a, b) => b[1] - a[1]);
  const topTopic = topicEntries[0];
  const mostEngaging = topTopic ? topTopic[0].replace(/([A-Z])/g, ' $1').trim() : 'N/A';

  const completionRate = analytics.summary.totalQuizzesAttempted > 0
    ? Math.round((analytics.summary.totalQuizzesCompleted / analytics.summary.totalQuizzesAttempted) * 100)
    : 0;

  return (
    <div className="analytics-dashboard" dir={language === 'hi' ? 'rtl' : 'ltr'}>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {['overview', 'users', 'quizzes', 'knowledge', 'eligibility'].map(tab => (
            <button
              key={tab}
              className={`tab-button ${selectedTab === tab ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab)}
            >
              {t[tab]}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="tab-content">
            <div className="stats-grid">
              <StatCard
                icon="👥"
                label={t.totalUsers}
                value={analytics.summary.totalUsers}
              />
              <StatCard
                icon="📊"
                label={t.totalSessions}
                value={analytics.summary.totalSessions}
              />
              <StatCard
                icon="💬"
                label={t.totalInteractions}
                value={analytics.summary.totalChatInteractions}
              />
              <StatCard
                icon="📈"
                label={t.avgScore}
                value={`${analytics.summary.averageQuizScore}%`}
              />
            </div>

            <div className="insight-cards">
              <InsightCard
                title={t.engaging}
                value={mostEngaging}
                icon="⭐"
                color="green"
              />
              <InsightCard
                title={t.completionRate}
                value={`${completionRate}%`}
                icon="✓"
                color="blue"
              />
              <InsightCard
                title={t.avgReadiness}
                value={`${analytics.summary.averageReadinessScore}%`}
                icon="🎯"
                color="purple"
              />
            </div>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <div className="tab-content">
            <div className="card">
              <h3>{t.totalUsers}</h3>
              <div className="large-number">{analytics.summary.totalUsers}</div>
              <p className="description">Active users on the platform</p>
            </div>

            <div className="card">
              <h3>{t.totalSessions}</h3>
              <div className="large-number">{analytics.summary.totalSessions}</div>
              <p className="description">User sessions recorded</p>
            </div>

            {analytics.summary.totalUsers > 0 && (
              <div className="card">
                <h3>Average Engagement</h3>
                <div className="large-number">
                  {Math.round(analytics.summary.totalSessions / analytics.summary.totalUsers)}
                </div>
                <p className="description">Sessions per user</p>
              </div>
            )}
          </div>
        )}

        {/* Quizzes Tab */}
        {selectedTab === 'quizzes' && (
          <div className="tab-content">
            <div className="stats-grid">
              <StatCard
                icon="🎓"
                label={t.quizzesCompleted}
                value={`${analytics.summary.totalQuizzesCompleted}/${analytics.summary.totalQuizzesAttempted}`}
              />
              <StatCard
                icon="📊"
                label={t.avgScore}
                value={`${analytics.summary.averageQuizScore}%`}
              />
              <StatCard
                icon="✓"
                label="Completion Rate"
                value={`${completionRate}%`}
              />
            </div>

            {analytics.performanceTrend && analytics.performanceTrend.length > 0 && (
              <div className="card">
                <h3>{t.performance}</h3>
                <div className="trend-chart">
                  {analytics.performanceTrend.map((item, idx) => (
                    <div key={`perf_trend_${idx}`} className="trend-bar">
                      <div
                        className="bar-fill"
                        style={{ height: `${item.score}%`, backgroundColor: getScoreColor(item.score) }}
                      />
                      <span className="bar-label">{item.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Knowledge Gaps Tab */}
        {selectedTab === 'knowledge' && (
          <div className="tab-content">
            <div className="knowledge-gaps">
              {analytics.knowledgeGaps.veryCommon.length > 0 && (
                <div className="gap-section critical">
                  <h3>{t.veryCommon} 🔴</h3>
                  <ul>
                    {analytics.knowledgeGaps.veryCommon.map((gap, idx) => (
                      <li key={idx}>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analytics.knowledgeGaps.common.length > 0 && (
                <div className="gap-section warning">
                  <h3>{t.common} 🟡</h3>
                  <ul>
                    {analytics.knowledgeGaps.common.map((gap, idx) => (
                      <li key={idx}>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analytics.knowledgeGaps.rare.length > 0 && (
                <div className="gap-section success">
                  <h3>{t.rare} 🟢</h3>
                  <ul>
                    {analytics.knowledgeGaps.rare.map((gap, idx) => (
                      <li key={idx}>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Eligibility Tab */}
        {selectedTab === 'eligibility' && (
          <div className="tab-content">
            <div className="stats-grid">
              <StatCard
                icon="✓"
                label="Total Eligibility Checks"
                value={analytics.summary.totalEligibilityChecks}
              />
              <StatCard
                icon="📊"
                label={t.avgReadiness}
                value={`${analytics.summary.averageReadinessScore}%`}
              />
            </div>

            {analytics.readinessTrend && analytics.readinessTrend.length > 0 && (
              <div className="card">
                <h3>{t.readinessTrend}</h3>
                <div className="trend-chart">
                  {analytics.readinessTrend.map((item, idx) => (
                    <div key={`topic_trend_${idx}`} className="trend-bar">
                      <div
                        className="bar-fill"
                        style={{ height: `${item.readiness}%`, backgroundColor: getReadinessColor(item.readiness) }}
                      />
                      <span className="bar-label">{item.readiness}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Topic Engagement Section */}
        {selectedTab === 'overview' && (
          <div className="card">
            <h3>{t.topicEngagement}</h3>
            <div className="topic-bars">
              {topicEntries.map(([topic, count]) => (
                <div key={topic} className="topic-item">
                  <span className="topic-name">{topic}</span>
                  <div className="topic-bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(count / Math.max(...Object.values(analytics.topicEngagement), 1)) * 100}%`,
                        backgroundColor: getTopicColor(topic)
                      }}
                    />
                  </div>
                  <span className="topic-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

// Insight Card Component
const InsightCard = ({ title, value, icon, color }) => (
  <div className={`insight-card ${color}`}>
    <div className="insight-icon">{icon}</div>
    <div className="insight-content">
      <div className="insight-title">{title}</div>
      <div className="insight-value">{value}</div>
    </div>
  </div>
);

// Helper functions for colors
const getScoreColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

const getReadinessColor = (readiness) => {
  if (readiness >= 75) return '#10b981';
  if (readiness >= 50) return '#f59e0b';
  if (readiness >= 25) return '#f97316';
  return '#ef4444';
};

const getTopicColor = (topic) => {
  const colors = {
    aadhaarLinking: '#8b5cf6',
    aadhaarSeeding: '#06b6d4',
    dbtOverview: '#10b981',
    npciMapping: '#f59e0b',
    troubleshooting: '#ef4444'
  };
  return colors[topic] || '#64748b';
};

export default AnalyticsDashboard;
