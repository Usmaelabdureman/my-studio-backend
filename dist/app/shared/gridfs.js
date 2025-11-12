"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
exports.getFileStream = getFileStream;
exports.deleteFile = deleteFile;
exports.closeConnection = closeConnection;
const mongodb_1 = require("mongodb");
const url = process.env.DATABASE_URL;
if (!url) {
    // do not throw here to avoid crashes during static analysis; runtime will fail if not set
    console.warn('Warning: DATABASE_URL is not set. GridFS helper requires a MongoDB connection string in DATABASE_URL.');
}
let client = null;
let bucket = null;
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        if (client && bucket)
            return { client, bucket };
        if (!url)
            throw new Error('DATABASE_URL is not defined');
        client = new mongodb_1.MongoClient(url);
        yield client.connect();
        // Use the default DB from the connection string
        const db = client.db();
        bucket = new mongodb_1.GridFSBucket(db);
        return { client, bucket };
    });
}
function uploadFile(buffer, filename, mimetype) {
    return __awaiter(this, void 0, void 0, function* () {
        // Uploads a file buffer to GridFS and returns the inserted file id as a string.
        const { bucket } = yield connect();
        return new Promise((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(filename, {
                metadata: { contentType: mimetype || 'application/octet-stream' },
            });
            uploadStream.end(buffer, (err) => {
                if (err)
                    return reject(err);
                // @ts-ignore - fileId is exposed on the stream after finish
                const fileId = uploadStream.id.toString();
                resolve(fileId);
            });
        });
    });
}
function getFileStream(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        // Returns a readable stream for the file stored under `filename`.
        const { bucket } = yield connect();
        const downloadStream = bucket.openDownloadStreamByName(filename);
        return downloadStream;
    });
}
function deleteFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        // Deletes the first file found with the given filename.
        const { client } = yield connect();
        const db = client.db();
        const files = db.collection('fs.files');
        const doc = yield files.findOne({ filename });
        if (!doc)
            return false;
        const fileId = doc._id;
        // GridFS delete requires the file id
        const { bucket } = yield connect();
        yield bucket.delete(fileId);
        return true;
    });
}
function closeConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (client) {
            yield client.close();
            client = null;
            bucket = null;
        }
    });
}
exports.default = { uploadFile, getFileStream, deleteFile, closeConnection };
