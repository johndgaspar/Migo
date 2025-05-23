import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { input, mood, mode = 'chat', selectedMigo, isFirstMessage } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    let prompt = '';

    if (mode === 'insight') {
      prompt = `
You are a kind, emotionally intelligent mental health assistant trained in therapy. Based on the following 7-day journal logs, write a warm, 1–2 sentence summary that reflects emotional patterns or helpful insights. Be encouraging, non-clinical, and avoid harsh judgment.

Journal:
${input}

Weekly Insight:
      `;
    } else {
      prompt = `
You are ${selectedMigo}, an emotionally intelligent AI assistant trained in CBT, ACT, and supportive communication. 
Start by warmly responding to the user's message. Keep your tone friendly and natural. 
${isFirstMessage ? 'This is the user’s first message — greet them kindly and explain who you are.' : ''}

User: ${input}
      `;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.choices[0]?.message?.content?.trim() || '...';

    res.status(200).json({ reply });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
