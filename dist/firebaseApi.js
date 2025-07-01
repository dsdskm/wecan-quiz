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
exports.deleteQuiz = exports.updateQuiz = exports.createQuiz = exports.getQuizById = exports.getQuizzesByShowId = exports.deleteShow = exports.updateShow = exports.createShow = exports.getShowById = exports.getShows = void 0;
const firebase_1 = require("./firebase");
const Logger_1 = __importDefault(require("./utils/Logger")); // Import Logger
const storage_1 = require("./utils/storage"); // Import file deletion function
// Firestore 컬렉션 참조
const showsCollection = firebase_1.db.collection('shows');
// ==== Show 관련 함수 ====
function getShows() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snapshot = yield showsCollection.get();
            return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            Logger_1.default.error('Error getting shows:', error);
            // 실제 서비스에서는 더 구체적인 오류 처리 필요
            throw new Error('Failed to get shows from Firestore');
        }
    });
}
exports.getShows = getShows;
function getShowById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const doc = yield showsCollection.doc(id).get();
            if (doc.exists) {
                return Object.assign({ id: doc.id }, doc.data());
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            Logger_1.default.error(`Error getting show by ID ${id}:`, error);
            throw new Error(`Failed to get show ${id} from Firestore`);
        }
    });
}
exports.getShowById = getShowById;
function createShow(showData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Firestore에 새로운 문서를 추가하고 자동 생성된 ID를 가진 DocumentReference를 얻습니다.
            const docRef = yield showsCollection.add(showData);
            // 생성된 문서의 자동 생성된 ID를 Show 데이터에 추가합니다.
            // NOTE: showData가 Partial<Show> 타입이므로, 모든 필수 필드가 존재하지 않을 수 있습니다.
            // Show 타입을 반환하려면 모든 필수 필드가 채워져야 합니다.
            // 여기서는 Show 타입으로 캐스팅하지만, 실제 애플리케이션에서는 필수 필드 누락 시 유효성 검사 또는 오류 처리가 필요합니다.
            const createdShowData = Object.assign(Object.assign({ id: docRef.id }, showData), { quizzes: showData.quizzes || [] // Ensure quizzes is an array if not provided
             });
            // Firestore 문서를 새로 생성된 ID와 함께 다시 업데이트하여 ID 필드를 저장합니다.
            yield docRef.set(createdShowData); // Set the document with the ID included
            return createdShowData; // Return the created Show object with ID
        }
        catch (error) {
            Logger_1.default.error('Error creating show:', error);
            throw new Error('Failed to create show in Firestore');
        }
    });
}
exports.createShow = createShow;
function updateShow(id, showData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const docRef = showsCollection.doc(id);
            const doc = yield docRef.get();
            if (!doc.exists) {
                return undefined; // Show not found
            }
            // Firestore 문서 업데이트 (merge: true로 특정 필드만 업데이트)
            yield docRef.set(showData, { merge: true });
            // 업데이트된 문서 다시 조회하여 반환
            const updatedDoc = yield docRef.get();
            if (!updatedDoc.exists) {
                // 업데이트 후에 문서가 사라지는 경우는 드물지만, 안전을 위해 체크
                throw new Error('Updated show document not found after update');
            }
            return Object.assign({ id: updatedDoc.id }, updatedDoc.data());
        }
        catch (error) {
            Logger_1.default.error(`Error updating show ${id}:`, error);
            throw new Error(`Failed to update show ${id} in Firestore`);
        }
    });
}
exports.updateShow = updateShow;
function deleteShow(id) {
    return __awaiter(this, void 0, void 0, function* () {
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
                    yield (0, storage_1.deleteFileFromStorageByUrl)(showData.backgroundImageUrl);
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
            return true; // Show deleted successfully
        }
        catch (error) {
            Logger_1.default.error(`Error deleting show ${id}:`, error);
            throw new Error(`Failed to delete show ${id} from Firestore`);
        }
    });
}
exports.deleteShow = deleteShow;
// ==== Quiz 관련 함수 (Show 서브컬렉션 내) ====
function getQuizzesByShowId(showId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const quizzesCollection = showsCollection.doc(showId).collection('quizzes');
            const snapshot = yield quizzesCollection.get();
            return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            Logger_1.default.error(`Error getting quizzes for show ${showId}:`, error);
            throw new Error(`Failed to get quizzes for show ${showId} from Firestore`);
        }
    });
}
exports.getQuizzesByShowId = getQuizzesByShowId;
function getQuizById(showId, quizId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const quizDoc = yield showsCollection.doc(showId).collection('quizzes').doc(quizId).get();
            if (quizDoc.exists) {
                return Object.assign({ id: quizDoc.id }, quizDoc.data());
            }
            else {
                return undefined; // Quiz not found
            }
        }
        catch (error) {
            Logger_1.default.error(`Error getting quiz ${quizId} for show ${showId}:`, error);
            throw new Error(`Failed to get quiz ${quizId} for show ${showId} from Firestore`);
        }
    });
}
exports.getQuizById = getQuizById;
function createQuiz(showId, quizData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const quizzesCollection = showsCollection.doc(showId).collection('quizzes');
            // Firestore에서 문서 ID를 자동 생성하거나 quizData에 제공된 ID 사용
            const docRef = quizData.id ? quizzesCollection.doc(quizData.id) : quizzesCollection.doc();
            const dataToSet = Object.assign(Object.assign({}, quizData), { id: docRef.id }); // 데이터에 ID 포함
            // Firestore에 데이터 설정 (merge: true)
            yield docRef.set(dataToSet, { merge: true });
            // 생성된 문서 다시 조회하여 반환
            const createdQuiz = yield docRef.get();
            if (!createdQuiz.exists) {
                throw new Error('Created quiz document not found');
            }
            return Object.assign({ id: createdQuiz.id }, createdQuiz.data());
        }
        catch (error) {
            Logger_1.default.error(`Error creating quiz for show ${showId}:`, error);
            throw new Error(`Failed to create quiz for show ${showId} in Firestore`);
        }
    });
}
exports.createQuiz = createQuiz;
function updateQuiz(showId, quizId, quizData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const quizRef = showsCollection.doc(showId).collection('quizzes').doc(quizId);
            const quizDoc = yield quizRef.get();
            if (!quizDoc.exists) {
                return undefined; // Quiz not found
            }
            // Firestore 문서 업데이트 (merge: true)
            yield quizRef.set(quizData, { merge: true });
            // 업데이트된 문서 다시 조회하여 반환
            const updatedDoc = yield quizRef.get();
            if (!updatedDoc.exists) {
                // 업데이트 후에 문서가 사라지는 경우는 드물지만, 안전을 위해 체크
                throw new Error('Updated quiz document not found after update');
            }
            return Object.assign({ id: updatedDoc.id }, updatedDoc.data());
        }
        catch (error) {
            Logger_1.default.error(`Error updating quiz ${quizId} for show ${showId}:`, error);
            throw new Error(`Failed to update quiz ${quizId} for show ${showId} in Firestore`);
        }
    });
}
exports.updateQuiz = updateQuiz;
function deleteQuiz(showId, quizId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const quizRef = showsCollection.doc(showId).collection('quizzes').doc(quizId);
            const quizDoc = yield quizRef.get();
            if (!quizDoc.exists) {
                return false; // Quiz not found
            }
            // Firestore 문서 삭제
            yield quizRef.delete();
            return true; // Quiz deleted successfully
        }
        catch (error) {
            Logger_1.default.error(`Error deleting quiz ${quizId} for show ${showId}:`, error);
            throw new Error(`Failed to delete quiz ${quizId} for show ${showId} from Firestore`);
        }
    });
}
exports.deleteQuiz = deleteQuiz;
//# sourceMappingURL=firebaseApi.js.map