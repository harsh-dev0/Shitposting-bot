import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFallbackTweet() {
  const prompt = `You're a witty dev who loves tech. Create a hilarious, engaging, and insightful tech tweet. 
  Focus on common struggles like debugging, deadlines, or tech trends. No hashtags, keep it under 280 characters.`;

  try {
    console.log("Generating fallback tweet...");
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    let response = completion.choices?.[0]?.message?.content || "No response";
    return response.replace(/["]/g, '').substring(0, 280);
  } catch (error) {
    console.error("Error generating fallback tweet:", error);
    return "Debugging is like being the detective in a crime movie where you're also the murderer.";
  }
}
