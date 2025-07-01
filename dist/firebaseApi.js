"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuizzes = exports.deleteQuiz = exports.updateQuiz = exports.getAllQuizzes = exports.getQuiz = exports.createQuiz = exports.deleteShow = exports.updateShow = exports.getShow = exports.getAllShows = exports.createShow = exports.getUserByIdFromFirebase = exports.registerUserInFirebase = void 0;
const firebase_1 = require("./firebase"); // Firebase db 인스턴스 import (Firestore)
const Logger_1 = __importDefault(require("./utils/Logger")); // Logger 유틸리티 import
const storage_1 = require("./utils/storage"); // <-- deleteFileByUrl 함수 import
const showsCollection = firebase_1.db.collection('shows'); // 'shows' 컬렉션 참조 (Firestore)
const quizzesCollection = firebase_1.db.collection('quizzes'); // 'quizzes' 컬렉션 참조 (Firestore)
const accountsCollection = firebase_1.db.collection('accounts'); // 'accounts' 컬렉션 참조 (Firestore) // accounts 컬렉션 참조 추가
// 계정 관련 Firebase API 함수들
// -----------------------------------------------------------------------------
/**
 * Register a new user account in Firebase Authentication and/or Firestore.
 * @param userData The user data for registration.
 * @returns A promise that resolves with the created Account object.
 */
const registerUserInFirebase = (userData) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield docRef.set(userData);
        const createdAccount = Object.assign({ id: userData.userId }, userData); // ID를 userId로 설정
        Logger_1.default.info(`User registered in Firestore with ID: ${userData.userId}`);
        return createdAccount;
    }
    catch (error) {
        Logger_1.default.error('Error registering user in Firebase:', error);
        // TODO: 특정 Firebase 오류 코드에 따라 더 상세한 에러 처리
        if (error.code === 'auth/email-already-in-use') {
            throw new Error("Email already exists.");
        }
        else if (error.code === 'auth/invalid-email') {
            throw new Error("Invalid email format.");
        }
        else if (error.code === 'auth/weak-password') {
            throw new Error("Password is too weak.");
        }
        throw new Error('Failed to register user in Firebase');
    }
});
exports.registerUserInFirebase = registerUserInFirebase;
/**
 * Get a user account from Firestore by user ID.
 * @param userId The ID of the user.
 * @returns A promise that resolves with the Account object or null if not found.
 */
const getUserByIdFromFirebase = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Firestore에서 사용자 정의 userId를 문서 ID로 사용하여 계정 정보 조회
        const doc = yield accountsCollection.doc(userId).get();
        if (doc.exists) {
            return Object.assign({ id: doc.id }, doc.data());
        }
        else {
            Logger_1.default.warn(`User not found in Firestore with ID: ${userId}`);
            return null; // 사용자 없음
        }
    }
    catch (error) {
        Logger_1.default.error(`Error fetching user ${userId} from Firebase:`, error);
        throw new Error(`Failed to fetch user ${userId} from Firebase`);
    }
});
exports.getUserByIdFromFirebase = getUserByIdFromFirebase;
// Show 관련 Firebase API 함수들
// -----------------------------------------------------------------------------
// 새 Show 생성 (ID 자동 생성)
const createShow = (showData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 새 문서를 추가하고 자동 생성된 ID를 가져옵니다.
        const docRef = yield showsCollection.add(showData);
        // 생성된 문서의 자동 생성된 ID를 Show 데이터에 추가합니다.
        const createdShowData = Object.assign(Object.assign({ id: docRef.id }, showData), { quizzes: showData.quizzes || [] // Ensure quizzes is an array if not provided
         });
        // Firestore 문서를 새로 생성된 ID와 함께 다시 업데이트하여 ID 필드를 저장합니다.
        yield docRef.set(createdShowData); // Set the document with the ID included
        Logger_1.default.info(`Show created in Firestore with ID: ${docRef.id}`);
        return createdShowData; // Return the created Show object with ID
    }
    catch (error) {
        Logger_1.default.error('Error creating show:', error);
        throw new Error('Failed to create show in Firestore');
    }
});
exports.createShow = createShow;
// 모든 Show 조회
const getAllShows = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snapshot = yield showsCollection.get();
        const shows = [];
        snapshot.forEach(doc => {
            shows.push(Object.assign({ id: doc.id }, doc.data()));
        });
        Logger_1.default.info(`Fetched ${shows.length} shows from Firestore.`);
        return shows;
    }
    catch (error) {
        Logger_1.default.error('Error fetching all shows:', error);
        throw new Error('Failed to fetch all shows from Firestore');
    }
});
exports.getAllShows = getAllShows;
// 특정 Show ID로 조회
const getShow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Logger_1.default.info(`getShow id=${id}`, id);
        const doc = yield showsCollection.doc(id).get();
        if (doc.exists) {
            Logger_1.default.info(`Fetched show with ID: ${id} from Firestore.`);
            return Object.assign({ id: doc.id }, doc.data());
        }
        else {
            Logger_1.default.warn(`Show with ID: ${id} not found in Firestore.`);
            return null; // Show not found
        }
    }
    catch (error) {
        Logger_1.default.error(`Error fetching show ${id}:`, error);
        throw new Error(`Failed to fetch show ${id} from Firestore`);
    }
});
exports.getShow = getShow;
// Show 업데이트
const updateShow = (id, showData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const showRef = showsCollection.doc(id);
        yield showRef.update(showData);
        const updatedDoc = yield showRef.get();
        if (updatedDoc.exists) {
            Logger_1.default.info(`Show with ID: ${id} updated in Firestore.`);
            return Object.assign({ id: updatedDoc.id }, updatedDoc.data());
        }
        else {
            Logger_1.default.warn(`Show with ID: ${id} not found in Firestore for update.`);
            return null; // Show not found after update
        }
    }
    catch (error) {
        Logger_1.default.error(`Error updating show ${id}:`, error);
        throw new Error(`Failed to update show ${id} in Firestore`);
    }
});
exports.updateShow = updateShow;
// Show 삭제
const deleteShow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const showRef = showsCollection.doc(id);
        const showDoc = yield showRef.get();
        if (!showDoc.exists) {
            Logger_1.default.warn(`Show document with ID ${id} not found for deletion.`);
            return false; // Show not found
        }
        const showData = showDoc.data();
        // 배경 이미지 URL이 존재하는 경우 Storage에서 파일 삭제
        if (showData.backgroundImageUrl) {
            try {
                yield (0, storage_1.deleteFileByUrl)(showData.backgroundImageUrl);
                Logger_1.default.info(`Deleted background image for show ID ${id}`);
            }
            catch (storageError) {
                // 파일 삭제 중 오류 발생 시 로그를 남기지만, Show 문서 삭제는 계속 진행
                Logger_1.default.error(`Failed to delete background image for show ID ${id}:`, storageError);
                // 여기서 오류를 다시 던질지, 아니면 무시하고 문서 삭제를 진행할지 결정해야 합니다.
                // 일반적으로는 문서 삭제는 계속 진행하는 것이 좋습니다.
            }
        }
        // Firestore 문서 삭제
        yield showRef.delete();
        Logger_1.default.info(`Show with ID: ${id} deleted from Firestore.`);
        return true; // Show deleted successfully
    }
    catch (error) {
        Logger_1.default.error(`Error deleting show ${id}:`, error);
        throw new Error(`Failed to delete show ${id} from Firestore`);
    }
});
exports.deleteShow = deleteShow;
// Quiz 관련 Firebase API 함수들
// -----------------------------------------------------------------------------
// 새 Quiz 생성
const createQuiz = (quizData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRef = yield quizzesCollection.add(quizData);
        const doc = yield docRef.get();
        const createdQuiz = Object.assign({ id: doc.id }, doc.data()); // ID 추가
        Logger_1.default.info(`Quiz created in Firestore with ID: ${docRef.id}`);
        return createdQuiz; // 생성된 Quiz 객체 반환
    }
    catch (error) {
        Logger_1.default.error('Error creating quiz:', error);
        throw new Error('Failed to create quiz in Firestore');
    }
});
exports.createQuiz = createQuiz;
// 특정 Quiz ID로 조회
const getQuiz = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield quizzesCollection.doc(quizId).get();
        if (doc.exists) {
            Logger_1.default.info(`Fetched quiz with ID: ${quizId} from Firestore.`);
            return Object.assign({ id: doc.id }, doc.data());
        }
        else {
            Logger_1.default.warn(`Quiz with ID: ${quizId} not found in Firestore.`);
            return null;
        }
    }
    catch (error) {
        Logger_1.default.error(`Error fetching quiz ${quizId}:`, error);
        throw new Error(`Failed to fetch quiz ${quizId} from Firestore`);
    }
});
exports.getQuiz = getQuiz;
// 모든 Quiz 조회
const getAllQuizzes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snapshot = yield quizzesCollection.get();
        const quizzes = [];
        snapshot.forEach(doc => {
            quizzes.push(Object.assign({ id: doc.id }, doc.data()));
        });
        Logger_1.default.info(`Fetched ${quizzes.length} quizzes from Firestore.`);
        return quizzes;
    }
    catch (error) {
        Logger_1.default.error('Error fetching all quizzes:', error);
        throw new Error('Failed to fetch all quizzes from Firestore');
    }
});
exports.getAllQuizzes = getAllQuizzes;
// Quiz 업데이트
const updateQuiz = (quizId, quizData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizRef = quizzesCollection.doc(quizId);
        yield quizRef.update(quizData);
        const updatedDoc = yield quizRef.get();
        if (updatedDoc.exists) {
            Logger_1.default.info(`Quiz with ID: ${quizId} updated in Firestore.`);
            return Object.assign({ id: updatedDoc.id }, updatedDoc.data());
        }
        else {
            Logger_1.default.warn(`Quiz with ID: ${quizId} not found in Firestore for update.`);
            return null; // 업데이트하려는 문서가 없는 경우
        }
    }
    catch (error) {
        Logger_1.default.error(`Error updating quiz ${quizId}:`, error);
        throw new Error(`Failed to update quiz ${quizId} in Firestore`);
    }
});
exports.updateQuiz = updateQuiz;
// Quiz 삭제
const deleteQuiz = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRef = quizzesCollection.doc(quizId);
        const doc = yield docRef.get();
        if (!doc.exists) {
            Logger_1.default.warn(`Quiz document with ID ${quizId} not found for deletion.`);
            return false; // 삭제하려는 문서가 없는 경우
        }
        yield docRef.delete();
        Logger_1.default.info(`Quiz with ID: ${quizId} deleted from Firestore.`);
        return true; // 삭제 성공
    }
    catch (error) {
        Logger_1.default.error(`Error deleting quiz ${quizId}:`, error);
        throw new Error(`Failed to delete quiz ${quizId} from Firestore`);
    }
});
exports.deleteQuiz = deleteQuiz;
// Quiz 일괄 삭제 (Firebase Batch Delete 사용)
const deleteQuizzes = (quizIds) => __awaiter(void 0, void 0, void 0, function* () {
    if (!quizIds || quizIds.length === 0) {
        return false; // 삭제할 ID가 없는 경우
    }
    const batch = firebase_1.db.batch(); // Firestore Batch 객체 생성
    quizIds.forEach(quizId => {
        const docRef = quizzesCollection.doc(quizId);
        batch.delete(docRef); // Batch에 삭제 작업 추가
    });
    try {
        yield batch.commit(); // Batch 작업 실행
        Logger_1.default.info(`Successfully deleted ${quizIds.length} quizzes in batch.`);
        return true; // 일괄 삭제 성공
    }
    catch (error) {
        Logger_1.default.error('Error deleting quizzes in batch:', error);
        throw new Error('Failed to delete quizzes in batch from Firestore');
    }
});
exports.deleteQuizzes = deleteQuizzes;
//# sourceMappingURL=firebaseApi.js.map