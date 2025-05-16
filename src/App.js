// src/App.js
import React, { useRef, useState, useEffect } from 'react';
import Chat from './components/Chat';
import JournalEntry from './components/JournalEntry';
import MigoSelector from './components/MigoSelector';
import ChatList from './components/ChatList';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  const chatRef = useRef();
  const [mode, setMode] = useState('chat'); // chat | reflect | migos | settings
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
    <div style={{ fontFamily: 'Segoe UI, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '3.5rem' }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
        <h1 style={{
          fontSize: '1.75rem',
          marginBottom: '0.5rem',
          letterSpacing: '2px',
          fontWeight: 'bold'
        }}>
          🧠 MIGO
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
      </div>

      {/* Main Content Area */}
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

        {mode === 'migos' && (
          <div style={{ flexGrow: 1, padding: '1rem' }}>
            <MigoSelector selected={selectedMigo} onChange={setSelectedMigo} />
          </div>
        )}

        {mode === 'settings' && (
          <div style={{ flexGrow: 1, padding: '1rem', textAlign: 'center' }}>
            <h2>Settings (coming soon)</h2>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav mode={mode} setMode={setMode} />
    </div>
  );
}

export default App;
