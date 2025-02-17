import { Command } from 'commander';
import express, { Request, Response } from 'express';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { runBot } from './runbot';
import { Octokit } from 'octokit';

dotenv.config();

const app = express();
app.use(express.json());

const port = 5000;

// Validate required environment variables
const requiredEnvVars = ['TWITTER_CLIENT_ID', 'TWITTER_CLIENT_SECRET', 'GITHUB_TOKEN'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize GitHub API client
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function getOwner(): Promise<string> {
  try {
    const { data } = await octokit.rest.users.getAuthenticated();
    return data.login;
  } catch (error) {
    console.error('Error fetching GitHub owner:', error);
    throw new Error('Failed to fetch GitHub owner');
  }
}

// Initialize OAuth 2.0 client
const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

// Store tokens securely - in production, use a database
interface TokenStorage {
  accessToken?: string;
  refreshToken?: string;
  codeVerifier?: string;
  state?: string;
}

const tokenStorage: TokenStorage = {};

// Callback URL must match the one configured in your Twitter App settings
const callbackURL = 'http://127.0.0.1:5000/callback';

// Initialize OAuth2 flow
app.get('/auth/twitter', async (req: Request, res: Response) => {
  try {
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
      callbackURL,
      { 
        scope: [
          'tweet.read',
          'tweet.write',
          'users.read',
          'offline.access'
        ]
      }
    );

    // Store verifier and state
    tokenStorage.codeVerifier = codeVerifier;
    tokenStorage.state = state;

    console.log('Auth URL generated:', url);
    res.redirect(url);
  } catch (error) {
    console.error('Error generating auth link:', error);
    res.status(500).send('Failed to initialize authentication');
  }
});

// Handle OAuth2 callback
app.get('/callback', async (req: Request, res: Response) => {
  const { state, code, error } = req.query;

  if (error) {
    console.error('OAuth error:', error);
    return res.status(400).send(`Authentication error: ${error}`);
  }

  if (!code || !state) {
    return res.status(400).send('Missing code or state parameter');
  }

  if (!tokenStorage.state || state !== tokenStorage.state) {
    return res.status(400).send('Invalid state parameter');
  }

  try {
    const { 
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn
    } = await twitterClient.loginWithOAuth2({
      code: code as string,
      codeVerifier: tokenStorage.codeVerifier!,
      redirectUri: callbackURL
    });

    // Store tokens
    tokenStorage.accessToken = accessToken;
    tokenStorage.refreshToken = refreshToken;

    // Clear auth data
    delete tokenStorage.codeVerifier;
    delete tokenStorage.state;

    console.log('Authentication successful');
    console.log('Access token expires in:', expiresIn, 'seconds');

    // Verify the tokens work
    try {
      const me = await loggedClient.v2.me();
      console.log('Authenticated as:', me.data);
      
      const owner = await getOwner();
      await runBot();
      
      res.send('Authentication successful! You can close this window.');
    } catch (error) {
      console.error('Error verifying credentials:', error);
      res.status(500).send('Authentication succeeded but credential verification failed');
    }
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).send('Authentication failed');
  }
});

// Start server
app.listen(port, () => {
  console.log(`\nServer running at http://127.0.0.1:${port}`);
  console.log('\nTo authenticate:');
  console.log(`1. Visit http://127.0.0.1:${port}/auth/twitter`);
  console.log('2. Complete the Twitter authorization process');
});
