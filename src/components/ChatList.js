import React from 'react';

const personas = [
  { id: 'migo', name: 'Migo', avatar: '🧠' },
  { id: 'coach', name: 'Coach', avatar: '💪' },
  { id: 'sol', name: 'Sol', avatar: '🕊️' },
  { id: 'may', name: 'May', avatar: '🍃' },
  { id: 'sig', name: 'Sig', avatar: '🛋️' },
  { id: 'rex', name: 'Rex', avatar: '⚖️' },
  { id: 'blaze', name: 'Blaze', avatar: '🔥' },
  { id: 'sage', name: 'Sage', avatar: '🌿' },
  { id: 'mrC', name: 'Mr. C', avatar: '✝️' },
  { id: 'drMigo', name: 'Dr. Migo', avatar: '🧑‍⚕️' },
];

const ChatList = ({ selected, onSelectPersona }) => {
  return (
    <div style={{ padding: '1rem' }}>
      <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Migos</h3>
      {personas.map(p => (
        <div
          key={p.id}
          onClick={() => onSelectPersona(p.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '0.5rem',
            backgroundColor: selected === p.id ? '#d0ebff' : 'transparent',
            fontWeight: selected === p.id ? 'bold' : 'normal',
            transition: 'background 0.2s',
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
