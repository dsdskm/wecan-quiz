import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { URL } from 'url';

const FIREBASE_STORAGE_BUCKET_ENV_VAR = "FIREBASE_STORAGE_BUCKET";
const GOOGLE_STORAGE_BASE_URL = "https://storage.googleapis.com/";
const URL_PATH_SEPARATOR = "/";

const storage = new Storage();
const bucketName = process.env[FIREBASE_STORAGE_BUCKET_ENV_VAR]; // Firebase Storage bucket name from environment variable

if (!bucketName) {
  console.error(`${FIREBASE_STORAGE_BUCKET_ENV_VAR} environment variable is not set.`);
  // Handle the case where the environment variable is not set, e.g., throw an error or exit
  // process.exit(1); // Consider exiting or throwing an error in a real application
}
// Initialize bucket after checking if bucketName is set
const bucket = bucketName ? storage.bucket(bucketName) : null; // Handle case where bucketName is not set

/**
 * Generates the public URL for a file in Firebase Storage.
 * @param bucketName The name of the storage bucket.
 * @param filePath The path to the file within the bucket.
 * @returns The complete public URL for the file.
 */
const generatePublicUrl = (bucketName: string, filePath: string): string => {
  return `${GOOGLE_STORAGE_BASE_URL}${bucketName}${URL_PATH_SEPARATOR}${filePath}`;
};

/**
 * Uploads a file buffer to Firebase Storage.
 * @param fileBuffer The file buffer to upload.
 * @param originalname The original name of the file (to get the extension).
 * @param destinationPath The destination path within the storage bucket (e.g., 'show_backgrounds/').
 * @returns A promise that resolves with the public URL of the uploaded file.
 */
export const uploadFileToStorage = async (fileBuffer: Buffer, originalname: string, destinationPath: string): Promise<string> => {
  if (!bucket) {
    throw new Error("Firebase Storage bucket name is not configured.");
  }

  // Generate a unique file name using timestamp and original extension
  const fileName = `${Date.now()}${path.extname(originalname).toLowerCase()}`;
  const destination = `${destinationPath}${fileName}`; // Full path in storage bucket

  const fileUpload = bucket.file(destination);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: `image/${path.extname(originalname).toLowerCase().substring(1)}`, // Dynamically set content type based on original extension
    },
  });

 return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      console.error('Error uploading file to Firebase Storage:', err);
      reject(err);
    });

    blobStream.on('finish', async () => {
      try {
        // Make the file public (adjust permissions based on your security needs)
        await fileUpload.makePublic();
        const publicUrl = generatePublicUrl(bucketName, fileUpload.name);
        console.log(`File uploaded to: ${publicUrl}`);
        resolve(publicUrl);
      } catch (makePublicError) {
        console.error('Error making file public:', makePublicError);
        reject(makePublicError);
      }
    });

    blobStream.end(fileBuffer);
  });
};

/**
 * Deletes a file from Firebase Storage using its public URL.
 * @param fileUrl The public URL of the file to delete.
 * @returns A promise that resolves when the file is deleted.
 */
export const deleteFileFromStorageByUrl = async (fileUrl: string): Promise<void> => {
  if (!bucketName) {
    console.error(`${FIREBASE_STORAGE_BUCKET_ENV_VAR} environment variable is not set.`);
    throw new Error("Firebase Storage bucket name is not configured.");
  }

  try {
    // Extract the file path (object name) from the public URL
    // Public URL format: https://storage.googleapis.com/[BUCKET_NAME]/[OBJECT_NAME]
    const url = new URL(fileUrl);
    const objectName = url.pathname.substring(1).replace(`${bucketName}/`, ''); // Remove leading '/' and bucket name

    const file = storage.bucket(bucketName).file(objectName);

    // Check if the file exists before attempting to delete
    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
      console.log(`File deleted from Firebase Storage: ${fileUrl}`);
    } else {
      console.warn(`File not found in Firebase Storage, skipping deletion: ${fileUrl}`);
    }
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
    throw error; // Re-throw the error
  }
};