import { OpenAI } from "openai";
import personas from "../personas.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input, mode = "amigo" } = req.body;

  if (!input || typeof input !== "string") {
    return res.status(400).json({ error: "Invalid input" });
  }

  const persona = personas[mode] || personas.amigo;

  const prompt = `
${persona.prompt}

User: ${input}
AI:
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
}
