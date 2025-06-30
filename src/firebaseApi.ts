import { db } from './firebase';
import { Show } from './types/Show';
import { Quiz } from './types/Quiz';
import { v4 as uuidv4 } from 'uuid';
import Logger from './utils/Logger'; // Import Logger

// Firestore 컬렉션 참조
const showsCollection = db.collection('shows');

// ==== Show 관련 함수 ====

export async function getShows(): Promise<Show[]> {
  try {
    const snapshot = await showsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Show }));
  } catch (error) {
    Logger.error('Error getting shows:', error);
    // 실제 서비스에서는 더 구체적인 오류 처리 필요
    throw new Error('Failed to get shows from Firestore');
  }
}

export async function getShowById(id: string): Promise<Show | undefined> {
  try {
    const doc = await showsCollection.doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() as Show };
    } else {
      return undefined;
    }
  } catch (error) {
    Logger.error(`Error getting show by ID ${id}:`, error);
    throw new Error(`Failed to get show ${id} from Firestore`);
  }
}

export async function createShow(showData: Partial<Show>): Promise<Show> {
  try {
    // Firestore에서 문서 ID를 자동 생성하거나 showData에 제공된 ID 사용
    const docRef = showData.id ? showsCollection.doc(showData.id) : showsCollection.doc();
    const dataToSet = { ...showData, quizzes: showData.quizzes || [] }; // quizzes 배열 초기화 보장

    // Firestore에 데이터 설정 (merge: true로 기존 필드를 덮어쓰지 않고 업데이트)
    await docRef.set(dataToSet, { merge: true });

    // 생성된 문서 다시 조회하여 반환 (자동 생성된 ID 포함)
    const createdShow = await docRef.get();
    if (!createdShow.exists) {
        throw new Error('Created show document not found');
    }
    return { id: createdShow.id, ...createdShow.data() as Show };

  } catch (error) {
    Logger.error('Error creating show:', error);
    throw new Error('Failed to create show in Firestore');
  }
}

export async function updateShow(id: string, showData: Partial<Show>): Promise<Show | undefined> {
  try {
    const docRef = showsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return undefined; // Show not found
    }

    // Firestore 문서 업데이트 (merge: true로 특정 필드만 업데이트)
    await docRef.set(showData, { merge: true });

    // 업데이트된 문서 다시 조회하여 반환
    const updatedDoc = await docRef.get();
     if (!updatedDoc.exists) {
        // 업데이트 후에 문서가 사라지는 경우는 드물지만, 안전을 위해 체크
        throw new Error('Updated show document not found after update');
    }
    return { id: updatedDoc.id, ...updatedDoc.data() as Show };

  } catch (error) {
    Logger.error(`Error updating show ${id}:`, error);
    throw new Error(`Failed to update show ${id} in Firestore`);
  }
}

export async function deleteShow(id: string): Promise<boolean> {
  try {
    const docRef = showsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return false; // Show not found
    }

    // Firestore 문서 삭제
    await docRef.delete();
    return true; // Show deleted successfully
  } catch (error) {
    Logger.error(`Error deleting show ${id}:`, error);
    throw new Error(`Failed to delete show ${id} from Firestore`);
  }
}

// ==== Quiz 관련 함수 (Show 서브컬렉션 내) ====

export async function getQuizzesByShowId(showId: string): Promise<Quiz[]> {
    try {
        const quizzesCollection = showsCollection.doc(showId).collection('quizzes');
        const snapshot = await quizzesCollection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Quiz }));
    } catch (error) {
        Logger.error(`Error getting quizzes for show ${showId}:`, error);
        throw new Error(`Failed to get quizzes for show ${showId} from Firestore`);
    }
}

export async function getQuizById(showId: string, quizId: string): Promise<Quiz | undefined> {
    try {
        const quizDoc = await showsCollection.doc(showId).collection('quizzes').doc(quizId).get();
        if (quizDoc.exists) {
            return { id: quizDoc.id, ...quizDoc.data() as Quiz };
        } else {
            return undefined; // Quiz not found
        }
    } catch (error) {
        Logger.error(`Error getting quiz ${quizId} for show ${showId}:`, error);
        throw new Error(`Failed to get quiz ${quizId} for show ${showId} from Firestore`);
    }
}

export async function createQuiz(showId: string, quizData: Partial<Quiz>): Promise<Quiz> {
    try {
        const quizzesCollection = showsCollection.doc(showId).collection('quizzes');
         // Firestore에서 문서 ID를 자동 생성하거나 quizData에 제공된 ID 사용
        const docRef = quizData.id ? quizzesCollection.doc(quizData.id) : quizzesCollection.doc();
        const dataToSet = { ...quizData, id: docRef.id }; // 데이터에 ID 포함

        // Firestore에 데이터 설정 (merge: true)
        await docRef.set(dataToSet, { merge: true });

        // 생성된 문서 다시 조회하여 반환
        const createdQuiz = await docRef.get();
         if (!createdQuiz.exists) {
            throw new Error('Created quiz document not found');
        }
        return { id: createdQuiz.id, ...createdQuiz.data() as Quiz };

    } catch (error) {
        Logger.error(`Error creating quiz for show ${showId}:`, error);
        throw new Error(`Failed to create quiz for show ${showId} in Firestore`);
    }
}

export async function updateQuiz(showId: string, quizId: string, quizData: Partial<Quiz>): Promise<Quiz | undefined> {
    try {
        const quizRef = showsCollection.doc(showId).collection('quizzes').doc(quizId);
        const quizDoc = await quizRef.get();

        if (!quizDoc.exists) {
            return undefined; // Quiz not found
        }

        // Firestore 문서 업데이트 (merge: true)
        await quizRef.set(quizData, { merge: true });

        // 업데이트된 문서 다시 조회하여 반환
        const updatedDoc = await quizRef.get();
         if (!updatedDoc.exists) {
             // 업데이트 후에 문서가 사라지는 경우는 드물지만, 안전을 위해 체크
            throw new Error('Updated quiz document not found after update');
        }
        return { id: updatedDoc.id, ...updatedDoc.data() as Quiz };

    } catch (error) {
        Logger.error(`Error updating quiz ${quizId} for show ${showId}:`, error);
        throw new Error(`Failed to update quiz ${quizId} for show ${showId} in Firestore`);
    }
}

export async function deleteQuiz(showId: string, quizId: string): Promise<boolean> {
    try {
        const quizRef = showsCollection.doc(showId).collection('quizzes').doc(quizId);
        const quizDoc = await quizRef.get();

        if (!quizDoc.exists) {
            return false; // Quiz not found
        }

        // Firestore 문서 삭제
        await quizRef.delete();
        return true; // Quiz deleted successfully
    } catch (error) {
        Logger.error(`Error deleting quiz ${quizId} for show ${showId}:`, error);
        throw new Error(`Failed to delete quiz ${quizId} for show ${showId} from Firestore`);
    }
}