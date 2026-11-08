
import { MongoClient, Db, Document } from 'mongodb';

type MongoCache = {
  clientPromise?: Promise<MongoClient>;
  indexesPromise?: Promise<void>;
};

const globalForMongo = globalThis as typeof globalThis & {
  mongoCache?: MongoCache;
};

const cache: MongoCache =
  globalForMongo.mongoCache ?? (globalForMongo.mongoCache = {});

export async function db(): Promise<Db> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  if (!cache.clientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 10000,
    });

    cache.clientPromise = client.connect().catch((error) => {
      cache.clientPromise = undefined;
      throw error;
    });
  }

  const client = await cache.clientPromise;
  const database = client.db(
    process.env.MONGODB_DB || 'course_sales'
  );

  await ensureIndexes(database);

  return database;
}

async function ensureIndexes(database: Db): Promise<void> {
  if (!cache.indexesPromise) {
    cache.indexesPromise = Promise.all([
      database.collection('courses').createIndex(
        { slug: 1 },
        { unique: true }
      ),
      database.collection('orders').createIndex(
        { razorpayOrderId: 1 },
        { unique: true, sparse: true }
      ),
      database.collection('payments').createIndex(
        { razorpayPaymentId: 1 },
        { unique: true }
      ),
      database.collection('entitlements').createIndex(
        { orderId: 1 },
        { unique: true }
      ),
      database.collection('webhookEvents').createIndex(
        { eventId: 1 },
        { unique: true }
      ),
      database.collection('orders').createIndex(
        { createdAt: -1 }
      ),
    ])
      .then(() => undefined)
      .catch((error) => {
        cache.indexesPromise = undefined;
        throw error;
      });
  }

  await cache.indexesPromise;
}

export type AnyDoc = Document & Record<string, any>;
