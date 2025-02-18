import { MongoClient, Collection } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let tokenCollection: Collection;

export async function connectToMongo() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const client = await MongoClient.connect(mongoUri);
    const db = client.db('twitter-bot');
    tokenCollection = db.collection('tokens');
    console.log('Connected to MongoDB');
    return tokenCollection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export { tokenCollection };
