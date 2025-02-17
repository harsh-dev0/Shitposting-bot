// index.ts
import { Command } from 'commander';
import express, { Request, Response } from 'express';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { runBot } from './runbot';

dotenv.config();

// Token storage with client
interface TokenStorage {
  accessToken?: string;
  refreshToken?: string;
  codeVerifier?: string;
  state?: string;
  client?: TwitterApi;
}

// Global token storage - in production use a database
const tokenStorage: TokenStorage = {};

const app = express();
app.use(express.json());
const port = 5000;

// Initialize base Twitter client
const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

const callbackURL = 'http://127.0.0.1:5000/callback';

// Clear all tokens and start fresh auth
app.get('/auth/twitter', async (req: Request, res: Response) => {
  try {
    // Reset all stored data
    Object.keys(tokenStorage).forEach(key => {
      delete tokenStorage[key as keyof TokenStorage];
    });

    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
      callbackURL,
      { 
        scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
      }
    );

    tokenStorage.codeVerifier = codeVerifier;
    tokenStorage.state = state;

    res.redirect(url);
  } catch (error) {
    console.error('Error starting auth:', error);
    res.status(500).send('Auth initialization failed');
  }
});

app.get('/callback', async (req: Request, res: Response) => {
  const { state, code } = req.query;

  if (!code || !state || !tokenStorage.state || state !== tokenStorage.state) {
    return res.status(400).send('Invalid auth callback');
  }

  try {
    const { client, accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
      code: code as string,
      codeVerifier: tokenStorage.codeVerifier!,
      redirectUri: callbackURL
    });

    // Store new tokens and client
    tokenStorage.client = client;
    tokenStorage.accessToken = accessToken;
    tokenStorage.refreshToken = refreshToken;

    // Clean up auth data
    delete tokenStorage.codeVerifier;
    delete tokenStorage.state;

    // Verify credentials
    const user = await client.v2.me();
    console.log('Authenticated as:', user.data);

    // Debug log
    console.log('Client set in tokenStorage:', tokenStorage.client);

    await runBot();

    res.send('Authentication successful! You can close this window.');
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).send('Authentication failed');
  }
});


// Export for use in other files
export { tokenStorage };

app.listen(port, () => {
  console.log(`\nServer running at http://127.0.0.1:${port}`);
  console.log(`\nVisit http://127.0.0.1:${port}/auth/twitter to authenticate`);
});

// postTweet.ts
