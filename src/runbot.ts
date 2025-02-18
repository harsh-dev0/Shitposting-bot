import { fetchCommits } from './fetchCommits';
import { generateShitpost } from './generateShitpost';
import { postTweet } from './postTweet';
import { generateFallbackTweet } from './fallbackTweet';

export async function runBot() {
  try {
    const commitMessages = await fetchCommits();
    
    if (!commitMessages.length) {
      console.log('No commits found. Generating fallback tweet.');
      const tweetContent = await generateFallbackTweet();
      console.log('Tweet Content:', tweetContent);
      return await postTweet(tweetContent);
    }

    const tweetContent = await generateShitpost(commitMessages.map(commit => commit.message));
    console.log('Tweet Content:', tweetContent);
    await postTweet(tweetContent);
  } catch (error) {
    console.error('Error running bot:', error);
  }
}
