// src/components/JournalEntry.js
import React, { useState, useEffect } from 'react';

// 🧠 Mood options with emojis
const moodOptions = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  anxious: "😰",
  grateful: "🙏",
  lonely: "😔",
  excited: "😄",
  neutral: "😐"
};

function JournalEntry() {
  const [mood, setMood] = useState('');
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  // ✅ Load reflect entries on mount
  useEffect(() => {
    const saved = localStorage.getItem("reflectMessages");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // ✅ Save entries to localStorage on update
  useEffect(() => {
    localStorage.setItem("reflectMessages", JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = () => {
    if (!entry.trim() || !mood) return;

    const newEntry = {
      mood,
      emoji: moodOptions[mood],
      text: entry,
      timestamp: new Date().toLocaleString()
    };

    const updated = [...entries, newEntry];
    setEntries(updated);
    setMood('');
    setEntry('');
  };

  return (
    <div style={{ padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Journal & Mood Tracker</h2>

      {/* Emoji mood picker */}
      <div style={{ marginBottom: 10 }}>
        {Object.entries(moodOptions).map(([key, emoji]) => (
          <button
            key={key}
            onClick={() => setMood(key)}
            style={{
              marginRight: 6,
              padding: '6px 10px',
              fontSize: '1.5rem',
              border: mood === key ? '2px solid #4f46e5' : '1px solid #ccc',
              borderRadius: 8,
              background: mood === key ? '#eef2ff' : '#fff',
              cursor: 'pointer'
            }}
          >
            {emoji}
          </button>
        ))}
      </div>

      <textarea
        placeholder="Reflect on your thoughts and emotions..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        style={{
          width: '100%',
          height: 100,
          marginBottom: 10,
          padding: 10,
          borderRadius: 6,
          border: '1px solid #ccc'
        }}
      />

      <button onClick={handleSubmit}>Save Reflection</button>

      {/* Reflection history */}
      <h3 style={{ marginTop: '2rem' }}>Your Reflections</h3>
      {entries.map((e, i) => (
        <div
          key={i}
          style={{
            background: '#f3f4f6',
            padding: '10px 12px',
            borderRadius: 6,
            marginBottom: 10
          }}
        >
          <div style={{ fontSize: '1.2rem' }}>{e.emoji} <strong>{e.mood}</strong></div>
          <div style={{ marginTop: 4 }}>{e.text}</div>
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 4 }}>{e.timestamp}</div>
        </div>
      ))}
    </div>
  );
}

export default JournalEntry;
