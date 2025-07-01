import { db } from './firebase'; // Firebase db 인스턴스 import (Firestore)
import { Show } from './types/Show'; // Show 타입 import
import { Quiz } from './types/Quiz'; // Quiz 타입 import
import { Account } from './types/Account'; // Account 타입 import // Account 타입 import 추가
import Logger from './utils/Logger'; // Logger 유틸리티 import
import { deleteFileByUrl } from './utils/storage'; // <-- deleteFileByUrl 함수 import
const showsCollection = db.collection('shows'); // 'shows' 컬렉션 참조 (Firestore)
const quizzesCollection = db.collection('quizzes'); // 'quizzes' 컬렉션 참조 (Firestore)
const accountsCollection = db.collection('accounts'); // 'accounts' 컬렉션 참조 (Firestore) // accounts 컬렉션 참조 추가


// 계정 관련 Firebase API 함수들
// -----------------------------------------------------------------------------

/**
 * Register a new user account in Firebase Authentication and/or Firestore.
 * @param userData The user data for registration.
 * @returns A promise that resolves with the created Account object.
 */
export const registerUserInFirebase = async (userData: Partial<Account>): Promise<Account> => {
  try {
    // Firebase Authentication에 사용자 생성 (이메일/비밀번호 기반 예시)
    // TODO: 실제 등록 로직에 따라 Firebase Auth 또는 다른 방식 사용
    // 현재는 Firestore에만 저장하는 것으로 가정하고 Authentication 로직은 생략합니다.
    // 만약 Firebase Auth를 사용한다면 auth.createUserWithEmailAndPassword 등을 사용합니다.

    // Firestore에 계정 데이터 저장
    // 사용자 정의 userId를 문서 ID로 사용하는 경우
    if (!userData.userId) {
        throw new Error("User ID is required for registration.");
    }
    const docRef = accountsCollection.doc(userData.userId);
    await docRef.set(userData);

    const createdAccount: Account = { id: userData.userId, ...userData as Account }; // ID를 userId로 설정

    Logger.info(`User registered in Firestore with ID: ${userData.userId}`);
    return createdAccount;

  } catch (error) {
    Logger.error('Error registering user in Firebase:', error);
    // TODO: 특정 Firebase 오류 코드에 따라 더 상세한 에러 처리
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

/**
 * Get a user account from Firestore by user ID.
 * @param userId The ID of the user.
 * @returns A promise that resolves with the Account object or null if not found.
 */
export const getUserByIdFromFirebase = async (userId: string): Promise<Account | null> => {
  try {
    // Firestore에서 사용자 정의 userId를 문서 ID로 사용하여 계정 정보 조회
    const doc = await accountsCollection.doc(userId).get();

    if (doc.exists) {
      return { id: doc.id, ...(doc.data() as Account) };
    } else {
      Logger.warn(`User not found in Firestore with ID: ${userId}`);
      return null; // 사용자 없음
    }
  } catch (error) {
    Logger.error(`Error fetching user ${userId} from Firebase:`, error);
    throw new Error(`Failed to fetch user ${userId} from Firebase`);
  }
};


// Show 관련 Firebase API 함수들
// -----------------------------------------------------------------------------

// 새 Show 생성 (ID 자동 생성)
export const createShow = async (showData: Partial<Show>): Promise<Show> => {
  try {
    // 새 문서를 추가하고 자동 생성된 ID를 가져옵니다.
    const docRef = await showsCollection.add(showData);

    // 생성된 문서의 자동 생성된 ID를 Show 데이터에 추가합니다.
    const createdShowData: Show = {
      id: docRef.id,
      ...showData as Show, // Partial<Show>를 Show로 캐스팅 (필수 필드 누락 시 런타임 오류 가능성 있음)
      quizzes: showData.quizzes || [] // Ensure quizzes is an array if not provided
    };

    // Firestore 문서를 새로 생성된 ID와 함께 다시 업데이트하여 ID 필드를 저장합니다.
    await docRef.set(createdShowData); // Set the document with the ID included

    Logger.info(`Show created in Firestore with ID: ${docRef.id}`);
    return createdShowData; // Return the created Show object with ID
  } catch (error) {
    Logger.error('Error creating show:', error);
    throw new Error('Failed to create show in Firestore');
  }
};


// 모든 Show 조회
export const getAllShows = async (): Promise<Show[]> => {
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

// 특정 Show ID로 조회
export const getShow = async (id: string): Promise<Show | null> => {
  try {
    Logger.info(`getShow id=${id}`,id)
    const doc = await showsCollection.doc(id).get();
    if (doc.exists) {
      Logger.info(`Fetched show with ID: ${id} from Firestore.`);
      return { id: doc.id, ...(doc.data() as Show) };
    } else {
      Logger.warn(`Show with ID: ${id} not found in Firestore.`);
      return null; // Show not found
    }
  } catch (error) {
    Logger.error(`Error fetching show ${id}:`, error);
    throw new Error(`Failed to fetch show ${id} from Firestore`);
  }
};

// Show 업데이트
export const updateShow = async (id: string, showData: Partial<Show>): Promise<Show | null> => {
  try {
    const showRef = showsCollection.doc(id);
    await showRef.update(showData);
    const updatedDoc = await showRef.get();
    if (updatedDoc.exists) {
      Logger.info(`Show with ID: ${id} updated in Firestore.`);
      return { id: updatedDoc.id, ...(updatedDoc.data() as Show) };
    } else {
      Logger.warn(`Show with ID: ${id} not found in Firestore for update.`);
      return null; // Show not found after update
    }
  } catch (error) {
    Logger.error(`Error updating show ${id}:`, error);
    throw new Error(`Failed to update show ${id} in Firestore`);
  }
};


// Show 삭제
export const deleteShow = async (id: string): Promise<boolean> => {
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
        await deleteFileByUrl(showData.backgroundImageUrl);
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
    Logger.info(`Show with ID: ${id} deleted from Firestore.`);
    return true; // Show deleted successfully
  } catch (error) {
    Logger.error(`Error deleting show ${id}:`, error);
    throw new Error(`Failed to delete show ${id} from Firestore`);
  }
};


// Quiz 관련 Firebase API 함수들
// -----------------------------------------------------------------------------

// 새 Quiz 생성
export const createQuiz = async (quizData: Partial<Quiz>): Promise<Quiz> => { // Partial<Quiz>로 타입 변경
  try {
    const docRef = await quizzesCollection.add(quizData);
    const doc = await docRef.get();
    const createdQuiz: Quiz = { id: doc.id, ...(doc.data() as Quiz) }; // ID 추가

    Logger.info(`Quiz created in Firestore with ID: ${docRef.id}`);
    return createdQuiz; // 생성된 Quiz 객체 반환
  } catch (error) {
    Logger.error('Error creating quiz:', error);
    throw new Error('Failed to create quiz in Firestore');
  }
};


// 특정 Quiz ID로 조회
export const getQuiz = async (quizId: string): Promise<Quiz | null> => {
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

// 모든 Quiz 조회
export const getAllQuizzes = async (): Promise<Quiz[]> => {
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


// Quiz 업데이트
export const updateQuiz = async (quizId: string, quizData: Partial<Quiz>): Promise<Quiz | null> => {
  try {
    const quizRef = quizzesCollection.doc(quizId);
    await quizRef.update(quizData);
    const updatedDoc = await quizRef.get();
    if (updatedDoc.exists) {
      Logger.info(`Quiz with ID: ${quizId} updated in Firestore.`);
      return { id: updatedDoc.id, ...(updatedDoc.data() as Quiz) };
    } else {
      Logger.warn(`Quiz with ID: ${quizId} not found in Firestore for update.`);
      return null; // 업데이트하려는 문서가 없는 경우
    }
  } catch (error) {
    Logger.error(`Error updating quiz ${quizId}:`, error);
    throw new Error(`Failed to update quiz ${quizId} in Firestore`);
  }
};

// Quiz 삭제
export const deleteQuiz = async (quizId: string): Promise<boolean> => {
  try {
    const docRef = quizzesCollection.doc(quizId);
     const doc = await docRef.get();

     if (!doc.exists) {
       Logger.warn(`Quiz document with ID ${quizId} not found for deletion.`);
       return false; // 삭제하려는 문서가 없는 경우
     }

    await docRef.delete();
    Logger.info(`Quiz with ID: ${quizId} deleted from Firestore.`);
    return true; // 삭제 성공
  } catch (error) {
    Logger.error(`Error deleting quiz ${quizId}:`, error);
    throw new Error(`Failed to delete quiz ${quizId} from Firestore`);
  }
};

// Quiz 일괄 삭제 (Firebase Batch Delete 사용)
export const deleteQuizzes = async (quizIds: string[]): Promise<boolean> => {
  if (!quizIds || quizIds.length === 0) {
    return false; // 삭제할 ID가 없는 경우
  }

  const batch = db.batch(); // Firestore Batch 객체 생성

  quizIds.forEach(quizId => {
    const docRef = quizzesCollection.doc(quizId);
    batch.delete(docRef); // Batch에 삭제 작업 추가
  });

  try {
    await batch.commit(); // Batch 작업 실행
    Logger.info(`Successfully deleted ${quizIds.length} quizzes in batch.`);
    return true; // 일괄 삭제 성공
  } catch (error) {
    Logger.error('Error deleting quizzes in batch:', error);
    throw new Error('Failed to delete quizzes in batch from Firestore');
  }
};
