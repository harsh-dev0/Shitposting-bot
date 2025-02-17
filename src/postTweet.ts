import { tokenStorage } from "./index";



export async function postTweet(text: string) {
  try {
    if (!tokenStorage.client) {
      throw new Error('No authenticated Twitter client found.');
    }

    await tokenStorage.client.v2.tweet(text);
    console.log('Tweet posted successfully!');
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
}
