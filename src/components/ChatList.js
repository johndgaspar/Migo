import React from 'react';

const personas = [
  { id: 'migo', name: 'Migo', avatar: '🧠' },
  { id: 'mrC', name: 'Mr. C', avatar: '✝️' },
  { id: 'bubbles', name: 'Bubbles', avatar: '🫧' },
  // Add more Migos here
];

const ChatList = ({ selected, onSelectPersona }) => {
  return (
    <div style={{
      width: '200px',
      borderRight: '1px solid #ccc',
      padding: '1rem',
      backgroundColor: '#f9f9f9',
      overflowY: 'auto'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>Migos</h3>
      {personas.map(p => (
        <div
          key={p.id}
          onClick={() => onSelectPersona(p.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: selected === p.id ? '#d0ebff' : 'transparent'
          }}
        >
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{p.avatar}</span>
          <span>{p.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
