import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { URL } from 'url';
import multer from 'multer';
import Logger from './Logger';

const FIREBASE_STORAGE_BUCKET_ENV_VAR = "FIREBASE_STORAGE_BUCKET";
const GOOGLE_STORAGE_BASE_URL = "https://storage.googleapis.com/";
const URL_PATH_SEPARATOR = "/";

const storage = new Storage();
const bucketName = process.env[FIREBASE_STORAGE_BUCKET_ENV_VAR];

if (!bucketName) {
  Logger.error(`${FIREBASE_STORAGE_BUCKET_ENV_VAR} environment variable is not set.`);
}
const bucket = bucketName ? storage.bucket(bucketName) : null;

const generatePublicUrl = (bucketName: string, filePath: string): string => {
  return `${GOOGLE_STORAGE_BASE_URL}${bucketName}${URL_PATH_SEPARATOR}${filePath}`;
};

const getFilePathFromUrl = (fileUrl: string, bucketName: string): string | null => {
  try {
    const url = new URL(fileUrl);
    if (url.hostname !== 'storage.googleapis.com' || !url.pathname.startsWith(`/${bucketName}/`)) {
      Logger.error(`Invalid Storage URL format or bucket name mismatch: ${fileUrl}`);
      return null;
    }
    const objectName = url.pathname.substring(`/${bucketName}/`.length);
    return objectName;
  } catch (error) {
    Logger.error(`Error parsing Storage URL ${fileUrl}:`, error);
    return null;
  }
};

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
      contentType: contentType,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      Logger.error('Error uploading file to Firebase Storage:', err);
      reject(err);
    });

    blobStream.on('finish', async () => {
      try {
        await fileUpload.makePublic();
        const publicUrl = generatePublicUrl(bucketName as string, fileUpload.name);
        Logger.info(`File uploaded to: ${publicUrl}`);
        resolve(publicUrl);
      } catch (makePublicError) {
        Logger.error('Error making file public:', makePublicError);
        reject(makePublicError);
      }
    });

    blobStream.end(fileBuffer);
  });
};

export const deleteFileByUrl = async (fileUrl: string): Promise<boolean> => {
  if (!bucketName) {
    Logger.error(`${FIREBASE_STORAGE_BUCKET_ENV_VAR} environment variable is not set.`);
    throw new Error("Firebase Storage bucket is not configured.");
  }
  if (!fileUrl) {
    Logger.warn("No file URL provided for deletion.");
    return false;
  }

  try {
    const objectName = getFilePathFromUrl(fileUrl, bucketName);

    if (!objectName) {
      Logger.warn(`Could not extract object name from URL: ${fileUrl}. Skipping deletion.`);
      return false;
    }

    const file = storage.bucket(bucketName).file(objectName);

    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
      Logger.info(`File deleted from Firebase Storage: ${fileUrl} (Object: ${objectName})`);
      return true;
    } else {
      Logger.warn(`File not found in Firebase Storage, skipping deletion: ${fileUrl} (Object: ${objectName})`);
      return false;
    }
  } catch (error) {
    Logger.error(`Error deleting file from Firebase Storage: ${fileUrl}`, error);
    throw error;
  }
};

const storageConfig = multer.memoryStorage();
export const upload = multer({ storage: storageConfig });

export const generateShowBackgroundImagePath = (showId: string, originalName: string): string => {
  const destinationDir = `show_backgrounds/${showId}`;
  return generateFileName(destinationDir, originalName)
};

export const generateQuizReferenceImagePath = (quizId: string, originalName: string): string => {
  const destinationDir = `quiz_references/${quizId}`;
  return generateFileName(destinationDir, originalName)
};

const generateFileName = (destinationDir: string, originalName: string) => {
  const timestamp = Date.now();
  const fileExtension = path.extname(originalName).toLowerCase();
  const fileName = `${timestamp}${fileExtension}`;
  return `${destinationDir}/${fileName}`;
};
