import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFallbackTweet() {
  const prompt = `You're a **sharp-witted** software engineer who crafts **engaging, humorous, and insightful** tweets about the tech world.  
Write a **highly shareable, witty tweet** on **ANY** of the following topics:  

🚀 **Tech Observations & Trends**  
- The lifecycle of a hyped JavaScript framework (Hype → Adoption → Regret → Legacy)  
- AI taking over dev jobs… or just making our debugging nightmares worse  
- The rise of **low-code** platforms and how devs secretly feel about them  
- The inevitable "We are moving to Rust" announcement every company makes  
- That moment when people realize **GPT-generated code still needs debugging**  
- Every new **iOS or Android update** breaking existing apps in fun ways  

💡 **Dev Struggles (But Make It Witty, Not Frustrating)**  
- Debugging is 90% "Why isn't this working?" and 10% "Why is this working?"  
- Code comments that aged like milk (TODO: Fix this later… 2017)  
- The famous "works on my machine" and its devastating consequences  
- Trying to explain recursion without getting stuck in an infinite loop  
- Writing documentation vs. writing "self-explanatory code"  

📚 **Learning & Teaching (Farm Engagement with Insights)**  
- The fastest way to learn a new framework? Apply for a job that requires it.  
- If you're not embarrassed by your old code, have you really grown as a dev?  
- **Beginners should stop doing X** (Insert controversial but useful advice)  
- "Explain X like I’m 5"—Make a complex concept hilariously simple  
- The best **CS fundamentals that actually help in real life**  

🎭 **If Tech Had Sitcom Moments**  
- A standup meeting that turned into a **sit-down meeting… for an hour**  
- A dev fixes a bug, the QA finds five more—**laugh track plays**  
- Explaining Big O to a non-dev: "Imagine a line at Starbucks… but infinite"  
- A frontend dev, a backend dev, and a PM walk into a bar… chaos ensues  

🧠 **Big Brain Developer Thoughts**  
- Your code isn't just a series of if-else statements… or is it?  
- Every new project starts with **"We will follow best practices this time"**  
- "This should be easy" — a phrase that has destroyed millions of hours  
- A function named "doSomething()" that does **everything**  
- The real reason for tech debt: deadlines and vibes  

📈 **High-Engagement Tweets That Farm Likes & Retweets**  
- "What’s one piece of advice you wish you knew earlier as a dev?"  
- "If you could remove one thing from programming forever, what would it be?"  
- "You get 10 seconds to make a junior dev's day. What do you tell them?"  
- "Drop a tech hot take that will get you banned from Stack Overflow"  
- "What’s the most useless coding fact you know?"  

Make the tweet **short, punchy, and effortlessly funny or insightful**—something that makes devs **laugh, think, or both**. **No hashtags, keep it under 280 characters.**`;  


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
