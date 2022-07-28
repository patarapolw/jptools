import dotenv from 'dotenv';
import { IpadicFeatures } from 'kuromoji';
import { Collection, MongoClient } from 'mongodb';

dotenv.config();

export type DbTokenType = IpadicFeatures & {
  filename: string;
  // count?: number;
};

export let dbToken: Collection<DbTokenType>;

export async function initDB() {
  const client = await MongoClient.connect(
    process.env['MONGO_URI'] || 'mongodb://localhost:27017',
  );
  dbToken = client.db('vocab').collection('token');

  const idxName = 'idx_dict';
  const idxSpec: Partial<Record<keyof DbTokenType, 1>> = {
    filename: 1,
    word_id: 1,
    word_position: 1,
  };
  if (!(await dbToken.indexExists(idxName))) {
    await dbToken.createIndex(idxSpec, { name: idxName, unique: true });
  }

  return client;
}
