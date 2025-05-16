// src/App.js
import React, { useRef, useState, useEffect } from 'react';
import Chat from './components/Chat';
import JournalEntry from './components/JournalEntry';
import MigoSelector from './components/MigoSelector';
import ChatList from './components/ChatList';
import './App.css'; // ✅ Make sure this line is here

function App() {
  const chatRef = useRef();
  const [mode, setMode] = useState('reflect'); // "reflect" or "chat"
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMigo, setSelectedMigo] = useState("migo");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
        <h1 style={{
  fontSize: '1.75rem',
  marginBottom: '0.5rem',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  fontWeight: 'bold'
}}>
  MIGO
</h1>


        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            style={{ marginRight: '0.5rem' }}
          />
          Dark Mode
        </label>

        <MigoSelector selected={selectedMigo} onChange={setSelectedMigo} />

        <div style={{ marginTop: '0.5rem' }}>
          <button onClick={() => setMode('reflect')} style={{ marginRight: '0.5rem' }}>
            Reflect Mode
          </button>
          <button onClick={() => setMode('chat')}>Chat Mode</button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="chat-layout">
        {mode === 'chat' && (
          <>
            <div className="chat-sidebar">
              <ChatList selected={selectedMigo} onSelectPersona={setSelectedMigo} />
            </div>
            <div className="chat-content">
              <Chat ref={chatRef} selectedPersona={selectedMigo} />
            </div>
          </>
        )}

        {mode === 'reflect' && (
          <div style={{ flexGrow: 1, padding: '1rem' }}>
            <JournalEntry onSubmit={(data) => chatRef.current?.receiveJournalPrompt(data)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
