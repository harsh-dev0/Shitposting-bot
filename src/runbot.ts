import { fetchCommits } from './fetchCommits';
import { generateShitpost } from './generateShitpost';
import { postTweet } from './postTweet';

export async function runBot(owner: string, repo: string) {
  try {
    // Fetch commits
    const commitMessages = await fetchCommits(owner, repo) || [];
    console.log('Fetched commits:', commitMessages);
   
    // Check for new commits today
    const today = new Date().toISOString().split('T')[0];
    const newCommits = commitMessages.slice(0, 5);
    // const newCommits = commitMessages.filter(commit => commit.includes(today));
    if (!commitMessages) {
      console.log('No commits fetched.');
      return;
    }
    if (newCommits.length === 0) {
      console.log('No new commits today. Skipping tweet.');
      return;
    }

    // Generate shitpost
    const shitpost = await generateShitpost(newCommits);
    console.log('Generated shitpost:', shitpost);

    // Post tweet
    await postTweet(shitpost);
    console.log('Tweet posted successfully!');
  } catch (error) {
    console.error('Error running bot:', error);
  }
}
