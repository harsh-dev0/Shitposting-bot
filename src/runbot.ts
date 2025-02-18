import { fetchCommits } from './fetchCommits';
import { generateShitpost } from './generateShitpost';
import { postTweet } from './postTweet';
import { generateFallbackTweet } from './fallbackTweet';

export async function runBot() {
  try {
    const commitMessages = await fetchCommits();
    let tweetContent: string;

    if (!commitMessages.length) {
      console.log('No commits found. Generating fallback tweet.');
      tweetContent = await generateFallbackTweet();
    } else {
      tweetContent = await generateShitpost(commitMessages.map(commit => commit.message));
    }

    console.log('Tweet Content:', tweetContent);
    await postTweet(tweetContent);

    console.log('🛑 Bot execution finished. Exiting process...');
    process.exit(0); // Stops the Node.js process after tweeting
  } catch (error) {
    console.error('❌ Error running bot:', error);
    process.exit(1); // Exit with an error status if something fails
  }
}

