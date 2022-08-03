import { Logger } from '../../utils';
import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Setting up the MongoDB connection URI
const MONGODB_CONNECTION_URI = `mongodb+srv://alt-gate:${process.env.MONGODB_PASSWORD}@cluster-alt-gate.0hfsxse.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

let cachedDb;

export async function connectDB(): Promise<void> {
  if (cachedDb) {
    return;
  }

  const dbConfig = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  };
  try {
    cachedDb = await connect(MONGODB_CONNECTION_URI, dbConfig);
    // eslint-disable-next-line no-console
    console.log('\n🗂️  Connected to the DB');
  } catch (err) {
    // Sending the error to the logger
    Logger.error(err);
  }
}
