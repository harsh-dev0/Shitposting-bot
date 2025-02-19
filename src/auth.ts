import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { tokenCollection } from './db/mongodb';

dotenv.config();

const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

const callbackURL = 'http://127.0.0.1:5000/callback';

// Function to check token expiration
export async function getValidAccessToken() {
  const storedToken = await tokenCollection.findOne({});

  if (!storedToken) {
    throw new Error('No stored authentication tokens found.');
  }
  
  if (Date.now() >= storedToken.expiresAt) {
    console.log('Access token expired, attempting refresh...');
    return await refreshAccessToken(storedToken.refreshToken);
  }

  return storedToken.accessToken;
}

// Function to refresh the token
export async function refreshAccessToken(refreshToken: string) {
  try {
    const { client, accessToken, refreshToken: newRefreshToken } = await twitterClient.refreshOAuth2Token(refreshToken);

    const expiresIn = 7200 * 1000; // 2 hours
    const expiresAt = Date.now() + expiresIn;

    await tokenCollection.updateOne(
      {},
      { $set: { accessToken, refreshToken: newRefreshToken, expiresAt } },
      { upsert: true }
    );

    console.log('Token refreshed successfully.');
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token. Manual re-authentication required.', error);
    throw error;
  }
}

export { twitterClient, callbackURL };
