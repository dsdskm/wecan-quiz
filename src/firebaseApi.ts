import { db } from './firebase';
import { Show } from './types/Show';
import { Quiz } from './types/Quiz';
import { v4 as uuidv4 } from 'uuid';
import Logger from './utils/Logger'; // Import Logger
import { deleteFileFromStorageByUrl } from './utils/storage'; // Import file deletion function

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
    // Firestore에 새로운 문서를 추가하고 자동 생성된 ID를 가진 DocumentReference를 얻습니다.
    const docRef = await showsCollection.add(showData);

    // 생성된 문서의 자동 생성된 ID를 Show 데이터에 추가합니다.
    // NOTE: showData가 Partial<Show> 타입이므로, 모든 필수 필드가 존재하지 않을 수 있습니다.
    // Show 타입을 반환하려면 모든 필수 필드가 채워져야 합니다.
    // 여기서는 Show 타입으로 캐스팅하지만, 실제 애플리케이션에서는 필수 필드 누락 시 유효성 검사 또는 오류 처리가 필요합니다.
    const createdShowData: Show = {
        id: docRef.id,
        ...showData as Show, // Partial<Show>를 Show로 캐스팅 (필수 필드 누락 시 런타임 오류 가능성 있음)
        quizzes: showData.quizzes || [] // Ensure quizzes is an array if not provided
    };

    // Firestore 문서를 새로 생성된 ID와 함께 다시 업데이트하여 ID 필드를 저장합니다.
    await docRef.set(createdShowData); // Set the document with the ID included

    return createdShowData; // Return the created Show object with ID
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
    const showRef = showsCollection.doc(id);
    const showDoc = await showRef.get();

    if (!showDoc.exists) {
      Logger.warn(`Show document with ID ${id} not found for deletion.`);
      return false; // Show not found
    }

    const showData = showDoc.data() as Show;

    // 배경 이미지 URL이 존재하는 경우 Storage에서 파일 삭제
    if (showData.backgroundImageUrl) {
      try {
        await deleteFileFromStorageByUrl(showData.backgroundImageUrl);
        Logger.info(`Deleted background image for show ID ${id}`);
      } catch (storageError) {
        // 파일 삭제 중 오류 발생 시 로그를 남기지만, Show 문서 삭제는 계속 진행
        Logger.error(`Failed to delete background image for show ID ${id}:`, storageError);
        // 여기서 오류를 다시 던질지, 아니면 무시하고 문서 삭제를 진행할지 결정해야 합니다.
        // 일반적으로는 문서 삭제는 계속 진행하는 것이 좋습니다.
      }
    }
    // Firestore 문서 삭제
    await showRef.delete();
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