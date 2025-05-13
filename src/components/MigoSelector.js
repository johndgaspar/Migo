// MigoSelector.js
import React from 'react';
import { migoPersonas } from '../utils/personas';

const MigoSelector = ({ selected, onChange }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="migo-select" style={{ marginRight: '0.5rem' }}>Choose your Migo:</label>
      <select
        id="migo-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: '6px' }}
      >
        {Object.entries(migoPersonas).map(([key, persona]) => (
          <option key={key} value={key}>
            {persona.name} — {persona.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MigoSelector;
