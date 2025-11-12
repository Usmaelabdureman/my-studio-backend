/**
 * GridFS helper for file upload/download/delete using native MongoDB driver.
 *
 * This file replaces Supabase storage usage and provides three helpers:
 * - uploadFile(buffer, filename, mimetype) -> returns the file id (string)
 * - getFileStream(filename) -> returns a readable stream for the file
 * - deleteFile(filename) -> deletes a file by its filename
 *
 * It uses the DATABASE_URL environment variable (MongoDB connection string).
 */

import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

const url = process.env.DATABASE_URL;
if (!url) {
  // do not throw here to avoid crashes during static analysis; runtime will fail if not set
  console.warn('Warning: DATABASE_URL is not set. GridFS helper requires a MongoDB connection string in DATABASE_URL.');
}

let client: MongoClient | null = null;
let bucket: GridFSBucket | null = null;

async function connect() {
  if (client && bucket) return { client, bucket };
  if (!url) throw new Error('DATABASE_URL is not defined');
  client = new MongoClient(url);
  await client.connect();
  // Use the default DB from the connection string
  const db = client.db();
  bucket = new GridFSBucket(db);
  return { client, bucket };
}

export async function uploadFile(buffer: Buffer, filename: string, mimetype?: string) {
  // Uploads a file buffer to GridFS and returns the inserted file id as a string.
  const { bucket } = await connect();
  return new Promise<string>((resolve, reject) => {
    const uploadStream = bucket!.openUploadStream(filename, {
      metadata: { contentType: mimetype || 'application/octet-stream' },
    });
    uploadStream.end(buffer, (err?: Error) => {
      if (err) return reject(err);
      // @ts-ignore - fileId is exposed on the stream after finish
      const fileId = (uploadStream.id as ObjectId).toString();
      resolve(fileId);
    });
  });
}

export async function getFileStream(filename: string) {
  // Returns a readable stream for the file stored under `filename`.
  const { bucket } = await connect();
  const downloadStream = bucket!.openDownloadStreamByName(filename);
  return downloadStream;
}

export async function deleteFile(filename: string) {
  // Deletes the first file found with the given filename.
  const { client } = await connect();
  const db = client!.db();
  const files = db.collection('fs.files');
  const doc = await files.findOne({ filename });
  if (!doc) return false;
  const fileId = doc._id;
  // GridFS delete requires the file id
  const { bucket } = await connect();
  await bucket!.delete(fileId);
  return true;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    bucket = null;
  }
}

export default { uploadFile, getFileStream, deleteFile, closeConnection };
