import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import { getChatResponse } from '../utils/openai';

const Chat = forwardRef((props, ref) => {
  const [messagesByMigo, setMessagesByMigo] = useState({});
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const currentPersona = props.selectedPersona || 'migo';
  const messages = messagesByMigo[currentPersona] || [];

  // Load chat history on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('chatMessagesByMigo') || '{}');
    setMessagesByMigo(saved);
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessagesByMigo', JSON.stringify(messagesByMigo));
  }, [messagesByMigo]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useImperativeHandle(ref, () => ({
    receiveJournalPrompt({ mood, message }) {
      handleUserMessage(message, mood);
    }
  }));

  const handleUserMessage = async (text, mood = null) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { from: 'user', text }];
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

  return (
    <div style={{
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderLeft: '1px solid #ccc',
      backgroundColor: '#fff'
    }}>
      {/* Chat Messages */}
      <div style={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                backgroundColor: msg.from === 'user' ? '#0084ff' : '#e4e6eb',
                color: msg.from === 'user' ? 'white' : 'black',
                padding: '0.75rem 1rem',
                borderRadius: '20px',
                maxWidth: '70%',
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.4',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ fontStyle: 'italic', color: '#666' }}>Migo is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        borderTop: '1px solid #ccc',
        padding: '1rem',
      }}>
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flexGrow: 1,
            padding: '0.75rem 1rem',
            borderRadius: '20px',
            border: '1px solid #ccc',
            marginRight: '0.5rem',
          }}
        />
        <button type="submit" className="send-button" style={{
          padding: '0.75rem 1rem',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: '#0084ff',
          color: 'white',
          cursor: 'pointer',
        }}>
          Send
        </button>
      </form>

      {/* Clear Chat Button */}
      <button onClick={clearChat} className="clear-button" style={{
        margin: '0.5rem auto 1rem auto',
        background: 'none',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        fontSize: '0.85rem'
      }}>
        Clear Chat
      </button>
    </div>
  );
});

export default Chat;
