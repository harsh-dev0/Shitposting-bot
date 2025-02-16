import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.OPENAI_API_KEY, // Still using OPENAI_API_KEY for compatibility
});

export async function generateShitpost(commitMessages) {
  const prompt = `Combine these commit messages into a funny shitpost:\n${commitMessages.join("\n")}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices?.[0]?.message?.content || "No response";
  } catch (error) {
    console.error("Error generating shitpost:", error);
    throw error;
  }
}
