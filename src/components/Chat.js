import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';
import { getChatResponse } from '../utils/openai';

const migoFreeResponses = [
  {
    trigger: "i feel anxious all the time",
    steps: [
      "That sounds exhausting. Anxiety can feel like your body’s stuck in high alert all the time. Let it out — I’m here.",
      "It kind of sounds like your mind’s trying to keep you safe — but it’s keeping you tense instead. Maybe it’s playing out ‘what ifs’ over and over, yeah?",
      "Sometimes the goal isn’t to make anxiety vanish — just to learn it doesn’t control everything. Want to try naming the top 1–2 worries your mind is cycling through?"
    ]
  },
  {
    trigger: "i hate myself",
    steps: [
      "That’s such a heavy thing to carry. I’m really glad you said it out loud here. No judgment — just space.",
      "Sounds like your inner critic is screaming right now. I don’t think that voice is the full truth. I wonder when that voice got so loud.",
      "You’re not your worst thought. You’re the one who survived it. Want to try looking at what triggered that spiral — and if it’s really about you, or something deeper?"
    ]
  },
  {
    trigger: "i’m scared of failing",
    steps: [
      "That fear makes a lot of sense. Failing can feel like losing a piece of yourself. I’m here for whatever that fear wants to say.",
      "Maybe your mind is telling you that failure = you’re not good enough. But is that really fair? That sounds like a lot of pressure to carry alone.",
      "What if we made space for the idea that failure just means learning in public? Want to zoom out and look at how this fear might be trying to protect you — even if it’s clumsy?"
    ]
  },
  {
    trigger: "i feel numb",
    steps: [
      "That’s a lonely place to be. Numbness can feel like being locked outside your own life. If it helps, I’m still here with you in the quiet.",
      "Sometimes numbness is the body’s way of saying: ‘this is too much.’ Could this be your system trying to shut down some of the overload?",
      "Feeling nothing is still a sign of something. Want to try gently tracing what might be underneath it? Even naming one small thing — a flicker of tiredness, loneliness, anything — can be a start."
    ]
  },
  {
    trigger: "i don’t know what i want anymore",
    steps: [
      "That’s a really disorienting place to be. Like walking through fog without a map. You don’t have to figure it all out right now. I’m here.",
      "Sounds like your sense of direction got buried under stress, burnout, or just too many expectations. Maybe this isn’t about being lost — but about outgrowing what used to feel right.",
      "Want to try naming what you’re sure you don’t want? Sometimes that’s where clarity begins. You don’t need a final answer — just a starting point."
    ]
  }
];

const Chat = forwardRef((props, ref) => {
  const [messagesByMigo, setMessagesByMigo] = useState({});
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const currentPersona = props.selectedPersona || 'migo';
  const messages = messagesByMigo[currentPersona] || [];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('chatMessagesByMigo') || '{}');
    setMessagesByMigo(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessagesByMigo', JSON.stringify(messagesByMigo));
  }, [messagesByMigo]);

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

    const lowerText = text.toLowerCase();
    const matched = migoFreeResponses.find(entry =>
      lowerText.includes(entry.trigger.toLowerCase())
    );

    if (matched) {
      matched.steps.forEach((msg, i) => {
        setTimeout(() => {
          setMessagesByMigo(prev => ({
            ...prev,
            [currentPersona]: [
              ...(prev[currentPersona] || []),
              { from: 'bot', text: msg }
            ]
          }));
          if (i === matched.steps.length - 1) setIsTyping(false);
        }, i * 2000);
      });
      return;
    }

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
