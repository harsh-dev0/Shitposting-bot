import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { twitterClient, callbackURL, getValidAccessToken } from './auth';
import { connectToMongo, tokenCollection } from './db/mongodb';
import { runBot } from './runbot';

dotenv.config();

const app = express();
app.use(express.json());
const port = 5000;


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

    await tokenCollection.insertOne({ codeVerifier, state });

    res.redirect(url);
  } catch (error) {
    console.error('Error starting auth:', error);
    res.status(500).send('Auth initialization failed');
  }
});

app.get('/callback', async (req: Request, res: Response): Promise<any> => {
  try {
    const { state, code } = req.query as { state?: string; code?: string };

    if (!state || !code) {
      return res.status(400).send('Missing state or code parameters.');
    }

    const storedAuth = await tokenCollection.findOne({ state });

    if (!storedAuth || state !== storedAuth.state) {
      return res.status(400).send('Invalid authentication callback');
    }

    const { client, accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier: storedAuth.codeVerifier,
      redirectUri: callbackURL,
    });

    const expiresIn = 7200 * 1000; // 2 hours
    const expiresAt = Date.now() + expiresIn;

    await tokenCollection.updateOne(
      { state },
      { $set: { accessToken, refreshToken, expiresAt } },
      { upsert: true }
    );

    console.log('✅ Authentication successful!');

    await runBot();

    res.send('Authentication successful! You can close this window.');
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).send('Authentication failed.');
  }
});

const startServer = async () => {
  try {
    await connectToMongo();
    console.log('✅ MongoDB connection established.');

    app.listen(port, async () => {
      console.log(`\n🚀 Server running at http://127.0.0.1:${port}`);

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
    process.exit(1);
  }
};

// Start the server
startServer();
