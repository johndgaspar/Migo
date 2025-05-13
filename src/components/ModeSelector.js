// src/components/ModeSelector.js

import React from 'react';

const ModeSelector = ({ mode, setMode }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label>Mode: </label>
    <select value={mode} onChange={(e) => setMode(e.target.value)}>
      <option value="chat">Chat</option>
      <option value="journal">Journal</option>
    </select>
  </div>
);

export default ModeSelector;
