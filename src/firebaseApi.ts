import { db } from './firebase';
import { Show } from './types/Show';
import { Quiz } from './types/Quiz';
import { Account } from './types/Account';
import Logger from './utils/Logger';
import { deleteFileByUrl } from './utils/storage';
const showsCollection = db.collection('shows');
const quizzesCollection = db.collection('quizzes');
const accountsCollection = db.collection('accounts');

export const registerUserInDb = async (userData: Partial<Account>): Promise<Account> => {
  try {
    if (!userData.userId) {
      throw new Error("User ID is required for registration.");
    }
    const docRef = accountsCollection.doc(userData.userId);
    await docRef.set(userData);

    const createdAccount: Account = { id: userData.userId, ...userData as Account };

    Logger.info(`User registered in Firestore with ID: ${userData.userId}`);
    return createdAccount;
  } catch (error) {
    Logger.error('Error registering user in Firebase:', error);
    if ((error as any).code === 'auth/email-already-in-use') {
      throw new Error("Email already exists.");
    } else if ((error as any).code === 'auth/invalid-email') {
      throw new Error("Invalid email format.");
    } else if ((error as any).code === 'auth/weak-password') {
      throw new Error("Password is too weak.");
    }
    throw new Error('Failed to register user in Firebase');
  }
};

export const getUserByIdFromDb = async (userId: string): Promise<Account | null> => {
  try {
    const doc = await accountsCollection.doc(userId).get();

    if (doc.exists) {
      return { id: doc.id, ...(doc.data() as Account) };
    } else {
      Logger.warn(`User not found in Firestore with ID: ${userId}`);
      return null;
    }
  } catch (error) {
    Logger.error(`Error fetching user ${userId} from Firebase:`, error);
    throw new Error(`Failed to fetch user ${userId} from Firebase`);
  }
};

export const createShowInDb = async (showData: Partial<Show>): Promise<Show> => {
  try {
    const docRef = await showsCollection.add(showData);
    const date = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    const createdShowData: Show = {
      id: docRef.id,
      ...showData as Show,
      quizzes: showData.quizzes || [],
      createdAt: date,
      updatedAt: date
    };

    await docRef.set(createdShowData);

    Logger.info(`Show created in Firestore with ID: ${docRef.id}`);
    return createdShowData;
  } catch (error) {
    Logger.error('Error creating show:', error);
    throw new Error('Failed to create show in Firestore');
  }
};

export const getAllShowsFromDb = async (): Promise<Show[]> => {
  try {
    const snapshot = await showsCollection.get();
    const shows: Show[] = [];
    snapshot.forEach(doc => {
      shows.push({ id: doc.id, ...(doc.data() as Show) });
    });
    Logger.info(`Fetched ${shows.length} shows from Firestore.`);
    return shows;
  } catch (error) {
    Logger.error('Error fetching all shows:', error);
    throw new Error('Failed to fetch all shows from Firestore');
  }
};

export const getShowFromDb = async (id: string): Promise<Show | null> => {
  try {
    Logger.info(`getShow id=${id}`, id)
    const doc = await showsCollection.doc(id).get();
    if (doc.exists) {
      Logger.info(`Fetched show with ID: ${id} from Firestore.`);
      return { id: doc.id, ...(doc.data() as Show) };
    } else {
      Logger.warn(`Show with ID: ${id} not found in Firestore.`);
      return null;
    }
  } catch (error) {
    Logger.error(`Error fetching show ${id}:`, error);
    throw new Error(`Failed to fetch show ${id} from Firestore`);
  }
};

export const updateShowInDb = async (id: string, showData: Partial<Show>): Promise<Show | null> => {
  try {
    const showRef = showsCollection.doc(id);
    const updateDataWithTimestamp = {
      ...showData,
      updatedAt: new Date(),
    };
    await showRef.update(updateDataWithTimestamp);
    const updatedDoc = await showRef.get();
    if (updatedDoc.exists) {
      Logger.info(`Show with ID: ${id} updated in Firestore.`);
      return { id: updatedDoc.id, ...(updatedDoc.data() as Show) };
    } else {
      Logger.warn(`Show with ID: ${id} not found in Firestore for update.`);
      return null;
    }
  } catch (error) {
    Logger.error(`Error updating show ${id}:`, error);
    throw new Error(`Failed to update show ${id} in Firestore`);
  }
};

export const deleteShowFromDb = async (id: string): Promise<boolean> => {
  try {
    const showRef = showsCollection.doc(id);
    const showDoc = await showRef.get();

    if (!showDoc.exists) {
      Logger.warn(`Show document with ID ${id} not found for deletion.`);
      return false;
    }

    const showData = showDoc.data() as Show;

    if (showData.backgroundImageUrl) {
      await deleteFileByUrl(showData.backgroundImageUrl);
    }

    await showRef.delete();
    Logger.info(`Show with ID: ${id} deleted from Firestore.`);
    return true;
  } catch (error) {
    Logger.error(`Error deleting show ${id}:`, error);
    throw new Error(`Failed to delete show ${id} from Firestore`);
  }
};

export const createQuizInDb = async (quizData: Partial<Quiz>): Promise<Quiz> => {
  try {
    const docRef = await quizzesCollection.add(quizData);
    const date = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    const createdQuizData: Quiz = {
      id: docRef.id,
      ...quizData as Quiz,
      createdAt: date,
      updatedAt: date
    };

    await docRef.set(createdQuizData)

    Logger.info(`Quiz created in Firestore with ID: ${docRef.id}`);
    return createdQuizData;
  } catch (error) {
    Logger.error('Error creating quiz:', error);
    throw new Error('Failed to create quiz in Firestore');
  }
};

export const getAllQuizzesFromDb = async (): Promise<Quiz[]> => {
  try {
    const snapshot = await quizzesCollection.get();
    const quizzes: Quiz[] = [];
    snapshot.forEach(doc => {
      quizzes.push({ id: doc.id, ...(doc.data() as Quiz) });
    });
    Logger.info(`Fetched ${quizzes.length} quizzes from Firestore.`);
    return quizzes;
  } catch (error) {
    Logger.error('Error fetching all quizzes:', error);
    throw new Error('Failed to fetch all quizzes from Firestore');
  }
};
export const getQuizFromDb = async (quizId: string): Promise<Quiz | null> => {
  try {
    const doc = await quizzesCollection.doc(quizId).get();
    if (doc.exists) {
      Logger.info(`Fetched quiz with ID: ${quizId} from Firestore.`);
      return { id: doc.id, ...(doc.data() as Quiz) };
    } else {
      Logger.warn(`Quiz with ID: ${quizId} not found in Firestore.`);
      return null;
    }
  } catch (error) {
    Logger.error(`Error fetching quiz ${quizId}:`, error);
    throw new Error(`Failed to fetch quiz ${quizId} from Firestore`);
  }
};

export const updateQuizInDb = async (quizId: string, quizData: Partial<Quiz>): Promise<Quiz | null> => {
  try {
    const quizRef = quizzesCollection.doc(quizId);
    const updateDataWithTimestamp = {
      ...quizData,
      updatedAt: new Date(),
    };
    await quizRef.update(updateDataWithTimestamp);
    const updatedDoc = await quizRef.get();
    if (updatedDoc.exists) {
      Logger.info(`Quiz with ID: ${quizId} updated in Firestore.`);
      return { id: updatedDoc.id, ...(updatedDoc.data() as Quiz) };
    } else {
      Logger.warn(`Quiz with ID: ${quizId} not found in Firestore for update.`);
      return null;
    }
  } catch (error) {
    Logger.error(`Error updating quiz ${quizId}:`, error);
    throw new Error(`Failed to update quiz ${quizId} in Firestore`);
  }
};

export const deleteQuizFromDb = async (quizId: string): Promise<boolean> => {
  try {
    const docRef = quizzesCollection.doc(quizId);
    const doc = await docRef.get();

    if (!doc.exists) {
      Logger.warn(`Quiz document with ID ${quizId} not found for deletion.`);
      return false;
    }

    const quizData = doc.data() as Quiz;
    if (quizData.referenceImageUrl) {
      await deleteFileByUrl(quizData.referenceImageUrl);
    }

    await docRef.delete();
    Logger.info(`Quiz with ID: ${quizId} deleted from Firestore.`);
    return true;
  } catch (error) {
    Logger.error(`Error deleting quiz ${quizId}:`, error);
    throw new Error(`Failed to delete quiz ${quizId} from Firestore`);
  }
};
