// migo-backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { input, mood, mode = 'chat' } = req.body;

  let prompt = '';

  if (mode === 'insight') {
    prompt = `
You are a kind, emotionally intelligent mental health assistant. Based on the following 7-day journal logs, write a warm, 1–2 sentence insight that reflects emotional patterns or supportive takeaways. Be encouraging and non-clinical.

Journal:
${input}

Weekly Insight:
    `;
  } else {
    prompt = `
You are Amigo Migo — a supportive, emotionally intelligent friend who listens, understands, and reflects with care. You never sound robotic or clinical. Your tone is warm, like a best friend who gets it. Use short, natural messages. Always remind the user they’re not alone.

User said:
${input}
    `;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`🚀 MIGO backend running at http://localhost:${port}`);
});
