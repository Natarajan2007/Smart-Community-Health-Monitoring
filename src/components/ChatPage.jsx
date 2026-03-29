import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/openaiService';
import '../scss/ChatPage.scss';

const ChatPage = ({ language, setCurrentPage }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const chatLabels = {
    en: {
      title: 'AI Chat Assistant',
      subtitle: 'Ask questions about Aadhaar and DBT',
      placeholder: 'Type your question...',
      send: 'Send',
      back: '← Back',
      welcome: 'Welcome to the Chat Assistant! I\'m here to answer your questions about Aadhaar, DBT (Direct Benefit Transfer), and related financial systems. Feel free to ask anything!'
    },
    hi: {
      title: 'AI चैट सहायक',
      subtitle: 'आधार और डीबीटी के बारे में प्रश्न पूछें',
      placeholder: 'अपना प्रश्न टाइप करें...',
      send: 'भेजें',
      back: '← वापस',
      welcome: 'चैट सहायक में स्वागत है! मैं आधार, डीबीटी (प्रत्यक्ष लाभ हस्तांतरण) और संबंधित वित्तीय प्रणालियों के बारे में आपके प्रश्नों का उत्तर देने के लिए यहाँ हूँ। बेझिझक कुछ भी पूछें!'
    }
  };

  const labels = chatLabels[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: labels.welcome,
      timestamp: new Date()
    }]);
  }, [language]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const response = await chatWithAI(
      inputValue,
      language,
      messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    );

    setMessages(prev => [...prev, {
      role: response.role,
      content: response.message,
      timestamp: new Date()
    }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page" dir={language === 'hi' ? 'rtl' : 'ltr'}>
      <div className="chat-page-header">
        <button 
          className="back-btn"
          onClick={() => setCurrentPage('home')}
        >
          {labels.back}
        </button>
        <div className="chat-page-title">
          <h1>{labels.title}</h1>
          <p>{labels.subtitle}</p>
        </div>
      </div>

      <div className="chat-page-container">
        <div className="chat-messages-section">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content loading">
                <span className="loader"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-section">
          <div className="chat-input-wrapper">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={labels.placeholder}
              rows={3}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="send-btn"
            >
              {labels.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
