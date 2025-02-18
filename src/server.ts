import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { twitterClient, callbackURL } from './auth';
import { connectToMongo, tokenCollection } from './db/mongodb';
import { runBot } from './runbot';

dotenv.config();

const app = express();
app.use(express.json());
const port = 5000;

// Function to check if a valid access token exists
const getValidAccessToken = async () => {
  if (!tokenCollection) {
    console.error('MongoDB is not initialized yet!');
    return null;
  }
  
  const storedToken = await tokenCollection.findOne({});
  if (storedToken && storedToken.accessToken && storedToken.expiresAt > Date.now()) {
    return storedToken.accessToken;
  }
  return null;
};

// Route to start Twitter OAuth
app.get('/auth/twitter', async (req: Request, res: Response): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();
    if (accessToken) {
      console.log('✅ Valid token found, running the bot...');
      await runBot();
      return res.send('Bot is running with an existing valid token.');
    }

    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(callbackURL, {
      scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
    });

    // Store OAuth state & verifier in MongoDB
    await tokenCollection.insertOne({ codeVerifier, state });

    res.redirect(url);
  } catch (error) {
    console.error('Error starting auth:', error);
    res.status(500).send('Auth initialization failed');
  }
});

// OAuth callback route
app.get('/callback', async (req: Request, res: Response): Promise<any> => {
  try {
    const { state, code } = req.query as { state?: string; code?: string };

    if (!state || !code) {
      return res.status(400).send('Missing state or code parameters.');
    }

    // Retrieve stored state and verifier from MongoDB
    const storedAuth = await tokenCollection.findOne({ state });

    if (!storedAuth || state !== storedAuth.state) {
      return res.status(400).send('Invalid authentication callback');
    }

    // Exchange code for access token
    const { client, accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier: storedAuth.codeVerifier,
      redirectUri: callbackURL,
    });

    const expiresIn = 7200 * 1000; // 2 hours
    const expiresAt = Date.now() + expiresIn;

    // Store new tokens
    await tokenCollection.updateOne(
      { state },
      { $set: { accessToken, refreshToken, expiresAt } },
      { upsert: true }
    );

    console.log('✅ Authentication successful!');

    // Run bot after successful authentication
    await runBot();

    res.send('Authentication successful! You can close this window.');
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).send('Authentication failed.');
  }
});

// Start the server **only after MongoDB is connected**
const startServer = async () => {
  try {
    await connectToMongo();
    console.log('✅ MongoDB connection established.');

    app.listen(port, async () => {
      console.log(`\n🚀 Server running at http://127.0.0.1:${port}`);

      // Check for an existing token **after MongoDB is ready**
      const accessToken = await getValidAccessToken();

      if (accessToken) {
        console.log('✅ Valid token found, running the bot...');
        await runBot();
      } else {
        console.log(`🔗 Visit http://127.0.0.1:${port}/auth/twitter to authenticate`);
      }
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1); // Stop the server if MongoDB fails to connect
  }
};

// Start the server
startServer();
