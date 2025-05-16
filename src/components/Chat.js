import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { getChatResponse } from '../utils/openai';

const Chat = forwardRef((props, ref) => {
  const [messagesByMigo, setMessagesByMigo] = useState({});
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const currentPersona = props.selectedPersona || 'migo';

  // Load saved chat history from localStorage on first load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('chatMessagesByMigo') || '{}');
    setMessagesByMigo(saved);
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatMessagesByMigo', JSON.stringify(messagesByMigo));
  }, [messagesByMigo]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesByMigo[currentPersona]]);

  useImperativeHandle(ref, () => ({
    receiveJournalPrompt({ mood, message }) {
      handleUserMessage(message, mood);
    }
  }));

  const handleUserMessage = async (text, mood = null) => {
    if (!text.trim()) return;

    const newMessages = [...(messagesByMigo[currentPersona] || []), { from: 'user', text }];
    setMessagesByMigo(prev => ({
      ...prev,
      [currentPersona]: newMessages
    }));

    setInput('');
    setIsTyping(true);

    const reply = await getChatResponse(text, mood, currentPersona);

    setMessagesByMigo(prev => ({
      ...prev,
      [currentPersona]: [...newMessages, { from: 'bot', text: reply }]
    }));

    setIsTyping(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUserMessage(input);
  };

  const clearChat = () => {
    setMessagesByMigo(prev => ({
      ...prev,
      [currentPersona]: []
    }));
    localStorage.setItem('chatMessagesByMigo', JSON.stringify({
      ...messagesByMigo,
      [currentPersona]: []
    }));
  };

  const messages = messagesByMigo[currentPersona] || [];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 2rem)',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '1rem'
    }}>
      <div style={{
        flexGrow: 1,
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflowY: 'auto',
        marginBottom: '1rem'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '0.5rem 0' }}>
            <span className={`chat-bubble ${msg.from === 'user' ? 'user' : 'bot'}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {isTyping && <div><em>Migo is typing...</em></div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexShrink: 0 }}>
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="send-button">Send</button>
      </form>

      <button onClick={clearChat} className="clear-button" style={{ flexShrink: 0, marginTop: '1rem' }}>
        Clear Chat
      </button>
    </div>
  );
});

export default Chat;
