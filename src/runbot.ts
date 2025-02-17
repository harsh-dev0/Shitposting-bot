import { fetchCommits } from './fetchCommits';
import { generateShitpost } from './generateShitpost';
import { postTweet } from './postTweet';
import { generateFallbackTweet } from './fallbackTweet';

export async function runBot() {
  try {
    const commitMessages = await fetchCommits();
    if (!commitMessages.length) return console.log('No commits found.');

    console.log('Fetched commits:', commitMessages);

    // Get today's date at the start of the day in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Check if any commit was made today
    const hasTodayCommit = commitMessages.some(commit => {
      const commitDate = new Date(commit.date);
      commitDate.setUTCHours(0, 0, 0, 0);
      console.log(`Commit Date (UTC): ${commitDate}, Today (UTC): ${today}`);
      return commitDate.getTime() === today.getTime();
    });

    const tweetContent = hasTodayCommit
      ? await generateShitpost(commitMessages.map(commit => commit.message))
      : await generateFallbackTweet();

    console.log('Tweet Content:', tweetContent);
    await postTweet(tweetContent);
  } catch (error) {
    console.error('Error running bot:', error);
  }
}