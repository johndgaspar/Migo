import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Map emojis to mood scores
const moodScores = {
  "😭": 1,
  "😔": 2,
  "😐": 3,
  "😊": 4,
  "😁": 5
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MoodChart = () => {
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('moodLog')) || [];

    const byDay = {};

    // Aggregate mood scores by day of week
    raw.forEach(entry => {
      if (!entry.mood || !entry.timestamp) return;

      const day = new Date(entry.timestamp).getDay(); // 0 (Sun) to 6 (Sat)
      const score = moodScores[entry.mood] || 0;

      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(score);
    });

    const data = daysOfWeek.map((dayLabel, i) => {
      const scores = byDay[i] || [];
      const average = scores.length
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
        : null;

      return {
        day: dayLabel,
        mood: average ? parseFloat(average) : null
      };
    });

    setWeeklyData(data);
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3 style={{ textAlign: 'center' }}>Weekly Mood Overview</h3>
      <ResponsiveContainer>
        <LineChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[1, 5]} tickCount={5} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#0084ff"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
