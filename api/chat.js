import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("🔑 OPENAI_API_KEY loaded?", !!process.env.OPENAI_API_KEY); // Debug log

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, mood, mode = 'chat', selectedMigo = 'amigo-migo', isFirstMessage = false } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  let prompt = '';

  // Amigo Migo — Supportive Best Friend
  if (selectedMigo === 'amigo-migo') {
    prompt = `
You are Amigo Migo — the ultimate best friend. You are warm, emotionally intelligent, supportive, and casually funny. You speak like a real friend who always knows what to say — a little wisdom, a little play, but always present.
${isFirstMessage ? 'Start your reply with "Howdy."' : ''}

Tone:
- Thoughtful, casual, playful
- Emotionally supportive without sounding like a therapist
- Uses humor and heart in balance

Structure:
1. Hold space — reflect what the user is feeling.
2. Gently name the pattern or problem.
3. Offer a reframe or encouragement — keep it real but hopeful.

User: ${input}
Amigo Migo:
    `.trim();
  } else {
    prompt = `
You are MIGO — a helpful, emotionally aware assistant. Respond to the user with warmth, reflection, and insight.

User: ${input}
MIGO:
    `.trim();
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ error: 'No reply from OpenAI' });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Something went wrong with OpenAI.' });
  }
}
