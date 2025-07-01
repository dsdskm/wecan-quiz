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
 * @param filePath The path to the file within the bucket (object name).
 * @returns The complete public URL for the file.
 */
const generatePublicUrl = (bucketName: string, filePath: string): string => {
  return `${GOOGLE_STORAGE_BASE_URL}${bucketName}${URL_PATH_SEPARATOR}${filePath}`;
};

/**
 * Extracts the file path (object name) from a Firebase Storage public URL.
 * @param fileUrl The public URL of the file.
 * @param bucketName The name of the storage bucket.
 * @returns The file path (object name) within the bucket, or null if the URL is invalid.
 */
const getFilePathFromUrl = (fileUrl: string, bucketName: string): string | null => {
  try {
    const url = new URL(fileUrl);
    // Ensure the URL is a Google Storage URL and matches the bucket
    if (url.hostname !== 'storage.googleapis.com' || !url.pathname.startsWith(`/${bucketName}/`)) {
        console.error(`Invalid Storage URL format or bucket name mismatch: ${fileUrl}`);
        return null;
    }
    // Extract the object name (file path) from the pathname
    const objectName = url.pathname.substring(`/${bucketName}/`.length);
    return objectName;
  } catch (error) {
    console.error(`Error parsing Storage URL ${fileUrl}:`, error);
    return null;
  }
};


/**
 * Uploads a file buffer to a specified path in Firebase Storage.
 * @param fileBuffer The file buffer to upload.
 * @param destinationPath The complete destination path within the storage bucket (including file name, e.g., 'images/users/user1/profile.jpg').
 * @param contentType Optional. The content type of the file (e.g., 'image/jpeg').
 * @returns A promise that resolves with the public URL of the uploaded file.
 */
export const uploadFile = async (fileBuffer: Buffer, destinationPath: string, contentType?: string): Promise<string> => {
  if (!bucket) {
    throw new Error("Firebase Storage bucket is not configured.");
  }
  if (!destinationPath) {
      throw new Error("Destination path for file upload cannot be empty.");
  }

  const fileUpload = bucket.file(destinationPath);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: contentType, // Use provided content type or let Storage guess
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
 * Deletes a file from Firebase Storage given its public URL.
 * @param fileUrl The public URL of the file to delete.
 * @returns A promise that resolves when the file is deleted. Returns false if the file was not found.
 */
export const deleteFileByUrl = async (fileUrl: string): Promise<boolean> => {
  if (!bucketName) {
    console.error(`${FIREBASE_STORAGE_BUCKET_ENV_VAR} environment variable is not set.`);
    throw new Error("Firebase Storage bucket is not configured.");
  }
  if (!fileUrl) {
      console.warn("No file URL provided for deletion.");
      return false; // No URL means nothing to delete
  }


  try {
    // Extract the file path (object name) from the public URL
    const objectName = getFilePathFromUrl(fileUrl, bucketName);

    if (!objectName) {
        console.warn(`Could not extract object name from URL: ${fileUrl}. Skipping deletion.`);
        return false; // Invalid URL or failed to extract path
    }


    const file = storage.bucket(bucketName).file(objectName);

    // Check if the file exists before attempting to delete
    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
      console.log(`File deleted from Firebase Storage: ${fileUrl} (Object: ${objectName})`);
      return true; // Deletion successful
    } else {
      console.warn(`File not found in Firebase Storage, skipping deletion: ${fileUrl} (Object: ${objectName})`);
      return false; // File not found
    }
  } catch (error) {
    console.error(`Error deleting file from Firebase Storage: ${fileUrl}`, error);
    throw error; // Re-throw the error
  }
};

/**
 * Deletes a file from Firebase Storage given its file path (object name).
 * @param filePath The path to the file within the bucket (object name).
 * @returns A promise that resolves when the file is deleted. Returns false if the file was not found.
 */
export const deleteFileByPath = async (filePath: string): Promise<boolean> => {
    if (!bucket) {
        throw new Error("Firebase Storage bucket is not configured.");
    }
     if (!filePath) {
         console.warn("No file path provided for deletion.");
         return false; // No path means nothing to delete
     }

    try {
        const file = bucket.file(filePath);

        // Check if the file exists before attempting to delete
        const [exists] = await file.exists();
        if (exists) {
            await file.delete();
            console.log(`File deleted from Firebase Storage by path: ${filePath}`);
            return true; // Deletion successful
        } else {
            console.warn(`File not found in Firebase Storage by path, skipping deletion: ${filePath}`);
            return false; // File not found
        }
    } catch (error) {
        console.error(`Error deleting file from Firebase Storage by path: ${filePath}`, error);
        throw error; // Re-throw the error
    }
};


// TODO: 필요한 경우 다른 Storage 유틸리티 함수 추가 (예: 파일 메타데이터 조회 등)
