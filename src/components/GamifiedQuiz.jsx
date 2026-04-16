import React, { useState, useEffect } from 'react';
import { quizData, scoringRules, badges } from '../data/quizData';
import { generateUniqueId } from '../utils/idGenerator';
import '../scss/GamifiedQuiz.scss';

const GamifiedQuiz = ({ language = 'en' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [answers, setAnswers] = useState([]);

  const questions = quizData[language] || quizData.en;
  const badgeList = badges[language] || badges.en;

  const labels = {
    en: {
      question: 'Question',
      of: 'of',
      score: 'Score',
      selectAnswer: 'Select an answer to continue',
      correct: 'Correct! ✓',
      incorrect: 'Incorrect! Try again or move next',
      next: 'Next Question',
      finish: 'Finish Quiz',
      quizComplete: 'Quiz Complete!',
      yourScore: 'Your Score',
      percentage: 'Percentage',
      earnedBadges: 'Badges Earned',
      noBadges: 'Keep learning to earn badges!',
      streakBonus: 'Streak Bonus',
      timeBonus: 'Speed Bonus',
      retakeQuiz: 'Retake Quiz',
      difficulty: 'Difficulty',
      category: 'Category'
    },
    hi: {
      question: 'प्रश्न',
      of: 'का',
      score: 'स्कोर',
      selectAnswer: 'जारी रखने के लिए एक उत्तर चुनें',
      correct: 'सही है! ✓',
      incorrect: 'गलत! फिर से प्रयास करें या आगे बढ़ें',
      next: 'अगला प्रश्न',
      finish: 'क्विज समाप्त करें',
      quizComplete: 'क्विज पूर्ण!',
      yourScore: 'आपका स्कोर',
      percentage: 'प्रतिशत',
      earnedBadges: 'अर्जित बैज',
      noBadges: 'बैज अर्जित करने के लिए सीखते रहें!',
      streakBonus: 'स्ट्रीक बोनस',
      timeBonus: 'स्पीड बोनस',
      retakeQuiz: 'क्विज दोबारा लें',
      difficulty: 'कठिनाई',
      category: 'श्रेणी'
    }
  };

  const t = labels[language];
  const currentQ = questions[currentQuestion];

  const checkBadges = (finalScore, correctCount, timeTaken) => {
    const newBadges = [];
    const percentage = (correctCount / questions.length) * 100;

    // Check each badge requirement
    Object.entries(badgeList).forEach(([key, badge]) => {
      const req = badge.requirement;
      
      if (req.correctAnswers && correctCount >= req.correctAnswers) {
        newBadges.push(key);
      }
      if (req.percentage && percentage >= req.percentage) {
        newBadges.push(key);
      }
      if (req.timeSeconds && timeTaken <= req.timeSeconds) {
        newBadges.push(key);
      }
    });

    return [...new Set(newBadges)]; // Remove duplicates
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQ.correct;
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    let pointsEarned = 0;

    if (isCorrect) {
      pointsEarned = scoringRules.pointsPerCorrectAnswer;
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectAnswersCount(correctAnswersCount + 1);

      // Add streak bonus
      if (newStreak > 1) {
        pointsEarned += (newStreak - 1) * scoringRules.streakBonus;
      }

      // Add time bonus
      if (timeTaken < 15) {
        pointsEarned += scoringRules.timeBonus.veryFast;
      } else if (timeTaken < 30) {
        pointsEarned += scoringRules.timeBonus.fast;
      } else if (timeTaken < 60) {
        pointsEarned += scoringRules.timeBonus.medium;
      }
    } else {
      setStreak(0);
    }

    setScore(score + pointsEarned);
    setAnswers([...answers, { question: currentQuestion, selected: selectedAnswer, correct: isCorrect, points: pointsEarned }]);
    setAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setQuestionStartTime(Date.now());
    } else {
      // Quiz finished
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      const earnedBadgesList = checkBadges(score + questionBonus, correctAnswersCount + (selectedAnswer === currentQ.correct ? 1 : 0), timeTaken);
      setEarnedBadges(earnedBadgesList);
      setQuizCompleted(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setQuizCompleted(false);
    setCorrectAnswersCount(0);
    setStreak(0);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setEarnedBadges([]);
    setAnswers([]);
  };

  const questionBonus = correctAnswersCount === questions.length ? scoringRules.bonusForAllCorrect : 0;
  const finalPercentage = Math.round(((correctAnswersCount) / questions.length) * 100);

  if (quizCompleted) {
    return (
      <div className="gamified-quiz" dir={language === 'hi' ? 'rtl' : 'ltr'}>
        <div className="quiz-container">
          <div className="results-container">
            <div className="results-header">
              <h2>{t.quizComplete}</h2>
              <div className="celebration">🎉</div>
            </div>

            <div className="score-display">
              <div className="final-score">
                <div className="score-number">{score}</div>
                <div className="score-label">{t.yourScore}</div>
              </div>

              <div className="score-breakdown">
                <div className="breakdown-item">
                  <span>{t.percentage}</span>
                  <strong>{finalPercentage}%</strong>
                </div>
                <div className="breakdown-item">
                  <span>{language === 'en' ? 'Correct Answers' : 'सही उत्तर'}</span>
                  <strong>{correctAnswersCount}/{questions.length}</strong>
                </div>
                <div className="breakdown-item">
                  <span>{language === 'en' ? 'Time Taken' : 'लगा समय'}</span>
                  <strong>{Math.round((Date.now() - startTime) / 1000)}s</strong>
                </div>
              </div>
            </div>

            {earnedBadges.length > 0 && (
              <div className="badges-section">
                <h3>{t.earnedBadges}</h3>
                <div className="badges-grid">
                  {earnedBadges.map(badgeKey => (
                    <div key={badgeKey} className="badge-item">
                      <div className="badge-icon">{badgeList[badgeKey].icon}</div>
                      <div className="badge-name">{badgeList[badgeKey].name}</div>
                      <div className="badge-description">{badgeList[badgeKey].description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {earnedBadges.length === 0 && (
              <div className="no-badges">{t.noBadges}</div>
            )}

            <button onClick={handleRetakeQuiz} className="btn btn-retake">
              {t.retakeQuiz}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gamified-quiz" dir={language === 'hi' ? 'rtl' : 'ltr'}>
      <div className="quiz-container">
        {/* Header Stats */}
        <div className="quiz-header">
          <div className="progress-info">
            <span className="question-counter">
              {t.question} {currentQuestion + 1} {t.of} {questions.length}
            </span>
            <span className="score-display">{t.score}: {score}</span>
            {streak > 1 && <span className="streak-badge">🔥 {streak}</span>}
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-meta">
            <span className="category-badge">{currentQ.category}</span>
            <span className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(currentQ.difficulty) }}>
              {currentQ.difficulty}
            </span>
          </div>

          <h3 className="question-text">{currentQ.question}</h3>

          {/* Options */}
          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <button
                key={`q${currentQuestion}_opt${index}`}
                className={`option-button ${selectedAnswer === index ? 'selected' : ''} ${
                  answered && index === currentQ.correct
                    ? 'correct'
                    : answered && selectedAnswer === index && index !== currentQ.correct
                    ? 'incorrect'
                    : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={answered}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {answered && index === currentQ.correct && <span className="correct-icon">✓</span>}
                {answered && selectedAnswer === index && index !== currentQ.correct && <span className="incorrect-icon">✗</span>}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {answered && (
            <div className={`feedback-box ${selectedAnswer === currentQ.correct ? 'correct-feedback' : 'incorrect-feedback'}`}>
              <strong>{selectedAnswer === currentQ.correct ? t.correct : t.incorrect}</strong>
              <p className="explanation">{currentQ.explanation}</p>
            </div>
          )}

          {!answered && selectedAnswer === null && (
            <div className="info-box">
              {t.selectAnswer}
            </div>
          )}

          {/* Action Button */}
          <div className="action-button">
            {!answered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="btn btn-submit"
              >
                {language === 'en' ? 'Submit Answer' : 'उत्तर सबमिट करें'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="btn btn-next"
              >
                {currentQuestion === questions.length - 1 ? t.finish : t.next}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    'Easy': '#10b981',
    'आसान': '#10b981',
    'Medium': '#f59e0b',
    'माध्यम': '#f59e0b',
    'Hard': '#ef4444',
    'कठिन': '#ef4444'
  };
  return colors[difficulty] || '#94a3b8';
};

export default GamifiedQuiz;
