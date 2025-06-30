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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAccounts = exports.deleteUser = exports.loginUser = exports.registerUser = void 0;
const firebase_1 = require("@/firebase");
const uuid_1 = require("uuid");
const Logger_1 = __importDefault(require("@/utils/Logger"));
const bcrypt_1 = __importDefault(require("bcrypt")); // bcrypt는 npm 패키지이므로 상대 경로가 아닌 모듈 이름으로 임포트
const joi_1 = __importDefault(require("joi"));
// 임시 사용자 데이터 저장 (메모리) - 실제 서비스에서는 데이터베이스 사용
const accountsCollection = firebase_1.db.collection('accounts');
// 사용자 로그인 데이터 유효성 검사 스키마
const loginSchema = joi_1.default.object({
    userId: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const value = userData;
    const { userId, username, password } = value;
    // userId 중복 확인
    const accountSnapshot = yield accountsCollection.where('userId', '==', userId).get();
    if (!accountSnapshot.empty) {
        throw new Error('User ID already exists');
    }
    // 비밀번호 해싱
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // 10은 솔트 라운드 수
    // 새 계정 생성
    const newAccount = {
        id: (0, uuid_1.v4)(), // 고유 ID 생성
        userId: userId,
        username: username,
        password: hashedPassword, // 해싱된 비밀번호 저장
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Firestore에 계정 추가
    yield accountsCollection.doc(newAccount.id).set(newAccount);
    Logger_1.default.info(`New account created: ${newAccount.userId}`);
    // 민감한 정보 제외하고 반환
    const { password: _ } = newAccount, accountWithoutPassword = __rest(newAccount, ["password"]);
    return accountWithoutPassword;
});
exports.registerUser = registerUser;
const loginUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    // 입력 값 유효성 검사
    const { error, value } = loginSchema.validate(loginData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const { userId, password } = value;
    // 사용자 찾기
    const accountSnapshot = yield accountsCollection.where('userId', '==', userId).limit(1).get();
    if (accountSnapshot.empty) {
        throw new Error('User not found');
    }
    const accountDoc = accountSnapshot.docs[0];
    const account = accountDoc.data();
    // 입력된 비밀번호와 저장된 해시된 비밀번호 비교
    const passwordMatch = yield bcrypt_1.default.compare(password, account.password);
    if (!passwordMatch) {
        throw new Error('Invalid password');
    }
    // 로그인 성공 시 토큰 생성 등 처리 (예시)
    const token = (0, uuid_1.v4)(); // 임시 토큰 생성
    Logger_1.default.info(`Generated token: "${token}"`);
    Logger_1.default.info(`User logged in: ${userId}`);
    // 토큰 및 사용자 정보 반환
    return { token, userId: account.userId, username: account.username };
});
exports.loginUser = loginUser;
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // 사용자 찾기
    const accountSnapshot = yield accountsCollection.where('userId', '==', userId).limit(1).get();
    if (accountSnapshot.empty) {
        throw new Error('User not found');
    }
    const accountDoc = accountSnapshot.docs[0];
    const accountIdToDelete = accountDoc.id;
    // Firestore에서 계정 삭제
    yield accountsCollection.doc(accountIdToDelete).delete();
    Logger_1.default.info(`Account deleted: ${userId}`);
    return true; // 삭제 성공 시 true 반환
});
exports.deleteUser = deleteUser;
const getAllAccounts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountsSnapshot = yield accountsCollection.get();
        const accounts = [];
        accountsSnapshot.forEach(doc => {
            const accountData = doc.data();
            // 민감한 정보 (비밀번호) 제외하고 추가
            const { password: _ } = accountData, accountWithoutPassword = __rest(accountData, ["password"]);
            accounts.push(accountWithoutPassword);
        });
        Logger_1.default.info(`Fetched ${accounts.length} accounts.`);
        return accounts;
    }
    catch (error) {
        throw new Error(`Error fetching accounts: ${error.message}`);
    }
});
exports.getAllAccounts = getAllAccounts;
//# sourceMappingURL=accountService.js.map