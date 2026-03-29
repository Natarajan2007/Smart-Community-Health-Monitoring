import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/openaiService';
import '../scss/ChatWidget.scss';

const ChatWidget = ({ language, translations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const chatLabels = {
    en: {
      title: 'Chat Assistant',
      placeholder: 'Type your question...',
      send: 'Send',
      minimize: 'Close',
      welcome: 'Hello! I\'m here to help with questions about Aadhaar and DBT. What would you like to know?'
    },
    hi: {
      title: 'चैट सहायक',
      placeholder: 'अपना प्रश्न टाइप करें...',
      send: 'भेजें',
      minimize: 'बंद करें',
      welcome: 'हैलो! मैं आधार और डीबीटी के बारे में प्रश्नों में मदद करने के लिए यहाँ हूँ। आप क्या जानना चाहते हैं?'
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
    <div className={`chat-widget ${isOpen ? 'open' : 'closed'}`} dir={language === 'hi' ? 'rtl' : 'ltr'}>
      {!isOpen && (
        <button 
          className="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <span className="chat-icon">💬</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>{labels.title}</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-content loading">
                  <span className="loader"></span>
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
      )}
    </div>
  );
};

export default ChatWidget;
