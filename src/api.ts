import { db } from './firebase';
import Logger from './utils/Logger';

export async function addVersionToFirestore() {
  Logger.info('addVersionToFirestore')
  try {
    const docRef = db.collection('test').doc('version');
    await docRef.set({ version: 1 });
    Logger.info('Document successfully written with ID: version');
    return { success: true, message: 'Document successfully written' };
  } catch (error) {
    Logger.error('Error adding document: ', error);
    throw new Error('Failed to add version to Firestore');
  }
}