import React, { useState, useRef, useEffect, useCallback } from 'react';
import { chatWithAI } from '../services/openaiService';
import '../scss/ChatWidget.scss';

/**
 * ChatWidget Component
 * Provides AI-powered chat interface with error handling and accessibility features
 * @component
 */
const ChatWidget = ({ language, translations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef(null);

  const chatLabels = {
    en: {
      title: 'Chat Assistant',
      placeholder: 'Type your question...',
      send: 'Send',
      minimize: 'Close',
      welcome: 'Hello! I\'m here to help with questions about Aadhaar and DBT. What would you like to know?',
      error: 'Failed to send message'
    },
    hi: {
      title: 'चैट सहायक',
      placeholder: 'अपना प्रश्न टाइप करें...',
      send: 'भेजें',
      minimize: 'बंद करें',
      welcome: 'हैलो! मैं आधार और डीबीटी के बारे में प्रश्नों में मदद करने के लिए यहाँ हूँ। आप क्या जानना चाहते हैं?',
      error: 'संदेश भेजने में विफल'
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
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: labels.welcome,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setError(null); // Clear previous errors
    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
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
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to get response. Please try again.');
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'en' 
          ? `I encountered an error: ${err.message}. Please try again or contact support.`
          : `मुझे एक त्रुटि का सामना करना पड़ा: ${err.message}। कृपया पुनः प्रयास करें या समर्थन से संपर्क करें।`,
        timestamp: new Date(),
        isError: true
      }]);
      
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-widget ${isOpen ? 'open' : 'closed'}`} dir={language === 'hi' ? 'rtl' : 'ltr'}>
      {!isOpen && (
        <button 
          className="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label={language === 'en' ? 'Open chat assistant' : 'चैट सहायक खोलें'}
          aria-expanded="false"
        >
          <span className="chat-icon" aria-hidden="true">💬</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-container" role="dialog" aria-labelledby="chat-title">
          <div className="chat-header">
            <h3 id="chat-title">{labels.title}</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label={language === 'en' ? 'Close chat' : 'चैट बंद करें'}
              aria-expanded="true"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="chat-error" role="alert" aria-live="polite">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
              {retryCount < 3 && (
                <button 
                  className="error-close"
                  onClick={() => setError(null)}
                  aria-label={language === 'en' ? 'Dismiss error' : 'त्रुटि को खारिज करें'}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div className="chat-messages" role="log" aria-live="polite" aria-label={language === 'en' ? 'Chat messages' : 'चैट संदेश'}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`message ${msg.role} ${msg.isError ? 'error' : ''}`}
                role="article"
                aria-label={`${msg.role === 'user' ? (language === 'en' ? 'Your message' : 'आपका संदेश') : (language === 'en' ? 'Assistant message' : 'सहायक संदेश')}`}
              >
                <div className="message-content">
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant" role="status" aria-live="polite">
                <div className="message-content loading">
                  <span className="loader" aria-label={language === 'en' ? 'Loading' : 'लोड हो रहा है'}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={labels.placeholder}
              rows={2}
              disabled={isLoading}
              aria-label={language === 'en' ? 'Message input' : 'संदेश इनपुट'}
              className="chat-textarea"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="send-btn"
              aria-label={language === 'en' ? 'Send message' : 'संदेश भेजें'}
            >
              {labels.send}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
