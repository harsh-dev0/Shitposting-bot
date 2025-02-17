import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

// Log the environment variables to verify they are loaded correctly
console.log('API Key:', process.env.TWITTER_API_KEY);
console.log('API Secret:', process.env.TWITTER_API_SECRET);
console.log('Access Token:', process.env.TWITTER_ACCESS_TOKEN);
console.log('Access Secret:', process.env.TWITTER_ACCESS_SECRET);

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export async function postTweet(text: string) {
  try {
    await twitterClient.v2.tweet(text);
    console.log('Tweet posted successfully!');
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
}
