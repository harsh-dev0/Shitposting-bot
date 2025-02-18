import { TwitterApi } from 'twitter-api-v2';
import { getValidAccessToken } from './auth';

export async function postTweet(text: string) {
  try {
    const accessToken = await getValidAccessToken();
    const client = new TwitterApi(accessToken);

    await client.v2.tweet(text);
    console.log('Tweet posted successfully!');
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
}
