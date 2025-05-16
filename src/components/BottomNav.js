// src/components/BottomNav.js
import React from 'react';

const BottomNav = ({ mode, setMode }) => {
  const tabs = [
    { id: 'chat', icon: '🏠', label: 'Home' },
    { id: 'reflect', icon: '📓', label: 'Journal' },
    { id: 'migos', icon: '🧑‍⚕️', label: 'Migos' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #ccc',
      padding: '0.5rem 0',
      zIndex: 1000,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setMode(tab.id)}
          style={{
            background: 'none',
            border: 'none',
            color: mode === tab.id ? '#0084ff' : '#555',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          {tab.icon}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
