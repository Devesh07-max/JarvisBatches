import { MongoClient, Db, Collection, Document } from 'mongodb';

const globalForMongo = globalThis as unknown as { mongoClientPromise?: Promise<MongoClient> };

export async function db(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI environment variable');
  const clientPromise = globalForMongo.mongoClientPromise ?? new MongoClient(uri).connect();
  if (process.env.NODE_ENV !== 'production') globalForMongo.mongoClientPromise = clientPromise;
  const client = await clientPromise;
  const database = client.db(process.env.MONGODB_DB || 'course_sales');
  await ensureIndexes(database);
  return database;
}
let indexesReady: Promise<void> | null = null;
async function ensureIndexes(database: Db) {
  if (!indexesReady) indexesReady = (async () => {
    await Promise.all([
      database.collection('courses').createIndex({ slug: 1 }, { unique: true }),
      database.collection('orders').createIndex({ razorpayOrderId: 1 }, { unique: true, sparse: true }),
      database.collection('payments').createIndex({ razorpayPaymentId: 1 }, { unique: true }),
      database.collection('entitlements').createIndex({ orderId: 1 }, { unique: true }),
      database.collection('webhookEvents').createIndex({ eventId: 1 }, { unique: true }),
      database.collection('orders').createIndex({ createdAt: -1 }),
    ]);
  })();
  await indexesReady;
}
export type AnyDoc = Document & Record<string, any>;
