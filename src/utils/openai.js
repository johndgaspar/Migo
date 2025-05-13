import axios from 'axios';
import { migoPersonas } from './personas'; // adjust path if needed


export async function getChatResponse(message, mood = "neutral") {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing OpenAI API key. Set REACT_APP_OPENAI_API_KEY in your .env file.");
    return "Sorry, the assistant is currently offline due to a configuration error.";
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
You are Migo, a warm, emotionally intelligent, nonjudgmental AI friend.

Your job is to:
- Begin by reflecting back the user's emotional experience or thoughts with care
- If the user is just starting to open up, respond mostly with empathy and curiosity, not advice
- As the user shares more detail, gradually offer gentle support, helpful psychoeducation, or insight — but never overwhelm or sound like you're giving a lecture
- If you notice any cognitive distortions (like catastrophizing or mind reading), name them gently and only if the user seems ready for it
- Provide helpful education about emotions or triggers *only when it fits naturally*
- You can offer a quote, but only if it flows with the conversation
- Always remind the user at the end: "I'm here with you. You're not alone in this."

Keep your tone grounded, casual, and supportive. Respond like a real, emotionally attuned friend.

User's current mood: "${mood}"
            `.trim(),
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.8,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI API error:", err.response?.data || err.message);
    return "I'm having trouble connecting right now. Please try again later.";
  }
}
