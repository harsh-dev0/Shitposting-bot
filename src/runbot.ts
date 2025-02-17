import { fetchCommits } from './fetchCommits';
import { generateShitpost } from './generateShitpost';
import { postTweet } from './postTweet';
import { generateFallbackTweet } from './fallbackTweet';

export async function runBot() {
  try {
    const commitMessages = await fetchCommits();
    if (!commitMessages.length) return console.log('No commits found.');

    console.log('Fetched commits:', commitMessages);

    const today = new Date().toISOString().split('T')[0];
    const hasTodayCommit = commitMessages.some(commit => commit.includes(today));

    const tweetContent = hasTodayCommit
      ? await generateShitpost(commitMessages)
      : await generateFallbackTweet();

    await postTweet(tweetContent);
  } catch (error) {
    console.error('Error running bot:', error);
  }
}
