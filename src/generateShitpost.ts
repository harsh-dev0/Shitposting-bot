import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateShitpost(commitMessages: string[]) {
  // Filter out any command-like messages
  const filteredMessages = commitMessages.filter(msg => typeof msg === 'string' && !msg.toLowerCase().includes('revert'));

  
  const prompt = `You're a **seasoned developer with a dangerously sharp wit.**  
  Your goal? **Take a list of commit messages and turn them into a hilarious, engaging, and highly shareable dev tweet.**  
  
  ### **Make it:**  
  ✔ **Witty & Unexpected** – Avoid typical "dev pain" jokes. Go for **absurdity, dry humor, irony, or surprising twists.**  
  ✔ **Engaging & Shareable** – Something devs **want** to retweet, not just like. Make them nod, chuckle, or scream "same."  
  ✔ **Expressive & Affirming** – Make devs feel like **"yes, this is exactly how my day went."** No frustration, just **pure comedic truth.**  
  ✔ **Conversational** – Write it like a real dev would, **chaotic, sarcastic, or weirdly poetic.** **No hashtags.**  
  ✔ **Diverse** – Each response should feel different. **Experiment with different joke formats**: storytelling, fake quotes, dev wisdom, or bizarre analogies.  
  
  ### **Commit messages to work with:**  
  \`\`\`
  ${filteredMessages.join("\n")}
  \`\`\`
  
  ### **Examples of styles to explore:**  
  - **Exaggeration:** "Commit: 'Fixed minor bug.' Translation: I just rewrote half the codebase and discovered three existential crises."  
  - **Irony:** "Commit: 'Refactored for clarity.' Reality: I will NEVER understand this code again."  
  - **Unexpected Absurdity:** "Commit: 'Updated README.' You ever tweak a single sentence and feel like a published author?"  
  - **Sarcastic Honesty:** "Commit: 'Added comments.' AKA, I translated my nonsense into *legible* nonsense."  
  - **Unhinged Chaos:** "Commit: 'Final final v2 fix.' If you know, you know."  
  
  Each tweet should be **snappy, unpredictable, and entertaining.** Surprise me. 🚀`  
  
  

  try {
    console.log("Generating ShitPost.");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
    });

    let response = completion.choices?.[0]?.message?.content || "No response";
    
    response = response.replace(/["]/g, '');
    
    console.log("Generated response:", response);

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