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
exports.deleteQuizFromDb = exports.updateQuizInDb = exports.getQuizFromDb = exports.getAllQuizzesFromDb = exports.createQuizInDb = exports.deleteShowFromDb = exports.updateShowInDb = exports.getShowFromDb = exports.getAllShowsFromDb = exports.createShowInDb = exports.getUserByIdFromDb = exports.registerUserInDb = void 0;
const firebase_1 = require("./firebase");
const Logger_1 = __importDefault(require("./utils/Logger"));
const storage_1 = require("./utils/storage");
const showsCollection = firebase_1.db.collection('shows');
const quizzesCollection = firebase_1.db.collection('quizzes');
const accountsCollection = firebase_1.db.collection('accounts');
const registerUserInDb = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!userData.userId) {
            throw new Error("User ID is required for registration.");
        }
        const docRef = accountsCollection.doc(userData.userId);
        yield docRef.set(userData);
        const createdAccount = Object.assign({ id: userData.userId }, userData);
        Logger_1.default.info(`User registered in Firestore with ID: ${userData.userId}`);
        return createdAccount;
    }
    catch (error) {
        Logger_1.default.error('Error registering user in Firebase:', error);
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
exports.registerUserInDb = registerUserInDb;
const getUserByIdFromDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield accountsCollection.doc(userId).get();
        if (doc.exists) {
            return Object.assign({ id: doc.id }, doc.data());
        }
        else {
            Logger_1.default.warn(`User not found in Firestore with ID: ${userId}`);
            return null;
        }
    }
    catch (error) {
        Logger_1.default.error(`Error fetching user ${userId} from Firebase:`, error);
        throw new Error(`Failed to fetch user ${userId} from Firebase`);
    }
});
exports.getUserByIdFromDb = getUserByIdFromDb;
const createShowInDb = (showData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRef = yield showsCollection.add(showData);
        const createdShowData = Object.assign(Object.assign({ id: docRef.id }, showData), { quizzes: showData.quizzes || [], createdAt: new Date(), updatedAt: new Date() });
        yield docRef.set(createdShowData);
        Logger_1.default.info(`Show created in Firestore with ID: ${docRef.id}`);
        return createdShowData;
    }
    catch (error) {
        Logger_1.default.error('Error creating show:', error);
        throw new Error('Failed to create show in Firestore');
    }
});
exports.createShowInDb = createShowInDb;
const getAllShowsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getAllShowsFromDb = getAllShowsFromDb;
const getShowFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Logger_1.default.info(`getShow id=${id}`, id);
        const doc = yield showsCollection.doc(id).get();
        if (doc.exists) {
            Logger_1.default.info(`Fetched show with ID: ${id} from Firestore.`);
            return Object.assign({ id: doc.id }, doc.data());
        }
        else {
            Logger_1.default.warn(`Show with ID: ${id} not found in Firestore.`);
            return null;
        }
    }
    catch (error) {
        Logger_1.default.error(`Error fetching show ${id}:`, error);
        throw new Error(`Failed to fetch show ${id} from Firestore`);
    }
});
exports.getShowFromDb = getShowFromDb;
const updateShowInDb = (id, showData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const showRef = showsCollection.doc(id);
        const updateDataWithTimestamp = Object.assign(Object.assign({}, showData), { updatedAt: new Date() });
        yield showRef.update(updateDataWithTimestamp);
        const updatedDoc = yield showRef.get();
        if (updatedDoc.exists) {
            Logger_1.default.info(`Show with ID: ${id} updated in Firestore.`);
            return Object.assign({ id: updatedDoc.id }, updatedDoc.data());
        }
        else {
            Logger_1.default.warn(`Show with ID: ${id} not found in Firestore for update.`);
            return null;
        }
    }
    catch (error) {
        Logger_1.default.error(`Error updating show ${id}:`, error);
        throw new Error(`Failed to update show ${id} in Firestore`);
    }
});
exports.updateShowInDb = updateShowInDb;
const deleteShowFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const showRef = showsCollection.doc(id);
        const showDoc = yield showRef.get();
        if (!showDoc.exists) {
            Logger_1.default.warn(`Show document with ID ${id} not found for deletion.`);
            return false;
        }
        const showData = showDoc.data();
        if (showData.backgroundImageUrl) {
            yield (0, storage_1.deleteFileByUrl)(showData.backgroundImageUrl);
        }
        yield showRef.delete();
        Logger_1.default.info(`Show with ID: ${id} deleted from Firestore.`);
        return true;
    }
    catch (error) {
        Logger_1.default.error(`Error deleting show ${id}:`, error);
        throw new Error(`Failed to delete show ${id} from Firestore`);
    }
});
exports.deleteShowFromDb = deleteShowFromDb;
const createQuizInDb = (quizData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRef = yield quizzesCollection.add(quizData);
        const createdQuizData = Object.assign(Object.assign({ id: docRef.id }, quizData), { createdAt: new Date(), updatedAt: new Date() });
        yield docRef.set(createdQuizData);
        Logger_1.default.info(`Quiz created in Firestore with ID: ${docRef.id}`);
        return createdQuizData;
    }
    catch (error) {
        Logger_1.default.error('Error creating quiz:', error);
        throw new Error('Failed to create quiz in Firestore');
    }
});
exports.createQuizInDb = createQuizInDb;
const getAllQuizzesFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getAllQuizzesFromDb = getAllQuizzesFromDb;
const getQuizFromDb = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getQuizFromDb = getQuizFromDb;
const updateQuizInDb = (quizId, quizData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizRef = quizzesCollection.doc(quizId);
        const updateDataWithTimestamp = Object.assign(Object.assign({}, quizData), { updatedAt: new Date() });
        yield quizRef.update(updateDataWithTimestamp);
        const updatedDoc = yield quizRef.get();
        if (updatedDoc.exists) {
            Logger_1.default.info(`Quiz with ID: ${quizId} updated in Firestore.`);
            return Object.assign({ id: updatedDoc.id }, updatedDoc.data());
        }
        else {
            Logger_1.default.warn(`Quiz with ID: ${quizId} not found in Firestore for update.`);
            return null;
        }
    }
    catch (error) {
        Logger_1.default.error(`Error updating quiz ${quizId}:`, error);
        throw new Error(`Failed to update quiz ${quizId} in Firestore`);
    }
});
exports.updateQuizInDb = updateQuizInDb;
const deleteQuizFromDb = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRef = quizzesCollection.doc(quizId);
        const doc = yield docRef.get();
        if (!doc.exists) {
            Logger_1.default.warn(`Quiz document with ID ${quizId} not found for deletion.`);
            return false;
        }
        const quizData = doc.data();
        if (quizData.referenceImageUrl) {
            yield (0, storage_1.deleteFileByUrl)(quizData.referenceImageUrl);
        }
        yield docRef.delete();
        Logger_1.default.info(`Quiz with ID: ${quizId} deleted from Firestore.`);
        return true;
    }
    catch (error) {
        Logger_1.default.error(`Error deleting quiz ${quizId}:`, error);
        throw new Error(`Failed to delete quiz ${quizId} from Firestore`);
    }
});
exports.deleteQuizFromDb = deleteQuizFromDb;
//# sourceMappingURL=firebaseApi.js.map