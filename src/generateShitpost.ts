import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateShitpost(commitMessages: string[]) {
  // Filter out any command-like messages
  const filteredMessages = commitMessages.filter(msg => typeof msg === 'string' && !msg.toLowerCase().includes('revert'));

  
  const prompt = `You're a witty dev who's seen it all. Create an absolutely hilarious and relatable dev shitpost based on these commit messages. Make it sarcastic memorable and something that would get tons of engagement. Focus on common dev pain points and frustrations. Keep it under 280 chars..
Restric the use of hashtagse
Commit messages to work with:
${filteredMessages.join("\n")}

Make it sound natural and conversational - like something a real developer would tweet. Don't be afraid to be dramatic or exaggerated for effect. Also make it insightful if possible add learnings`

  try {
    console.log("Generating tweet with prompt:", prompt);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
    });

    let response = completion.choices?.[0]?.message?.content || "No response";
    
    // Remove commas and quotation marks from the response
    response = response.replace(/["]/g, '');
    
    console.log("Generated response:", response);

    // Ensure the response is within Twitter's character limit
    if (response.length > 280) {
      console.warn("Response exceeds 280 characters - truncating...");
      return response.substring(0, 277) + "...";
    }

    return response;
  } catch (error) {
    console.error("Error generating tweet:", error);
    throw error;
  }
}