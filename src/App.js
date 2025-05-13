// src/App.js
import React, { useRef, useState, useEffect } from 'react';
import Chat from './components/Chat';
import JournalEntry from './components/JournalEntry';
import MigoSelector from './components/MigoSelector';

function App() {
  const chatRef = useRef();
  const [mode, setMode] = useState('reflect'); // "reflect" or "chat"
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMigo, setSelectedMigo] = useState("migo"); // default persona

  // Handle dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Migo Journal</h1>

      {/* Dark Mode Toggle */}
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          style={{ marginRight: '0.5rem' }}
        />
        Dark Mode
      </label>

      {/* Migo Selector */}
      <MigoSelector selected={selectedMigo} onChange={setSelectedMigo} />

      {/* Mode Toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setMode('reflect')} style={{ marginRight: '0.5rem' }}>
          Reflect Mode
        </button>
        <button onClick={() => setMode('chat')}>Chat Mode</button>
      </div>

      {/* Conditional Components */}
      {mode === 'reflect' ? (
        <JournalEntry onSubmit={(data) => chatRef.current?.receiveJournalPrompt(data)} />
      ) : (
        <Chat ref={chatRef} selectedPersona={selectedMigo} />
      )}
    </div>
  );
}

export default App;
