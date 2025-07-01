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
const Logger_1 = __importDefault(require("../utils/Logger")); // Logger import
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // JWT 라이브러리 import
const bcrypt_1 = __importDefault(require("bcrypt")); // 비밀번호 해싱 라이브러리 import
const firebaseApi_1 = require("@/firebaseApi");
// JWT Secret Key (환경 변수에서 가져오거나 안전하게 관리)
// TODO: 실제 환경에서는 .env 파일 등을 사용하여 관리해야 합니다.
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // 기본값은 안전하지 않으니 변경 필수
const accountService = {
    /**
     * Register a new user account.
     * @param userData The user data for registration.
     * @returns A promise that resolves with the created Account object.
     */
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add any business logic or validation here before saving to Firebase
            // For example, check if user ID or email already exists
            // Hash the password before saving
            // 예시: 비밀번호 해싱
            if (userData.password) {
                const salt = yield bcrypt_1.default.genSalt(10);
                userData.password = yield bcrypt_1.default.hash(userData.password, salt);
            }
            const newAccount = yield (0, firebaseApi_1.registerUserInFirebase)(userData);
            return newAccount;
        });
    },
    /**
     * Get a user account by user ID.
     * @param userId The ID of the user.
     * @returns A promise that resolves with the Account object or null if not found.
     */
    getUserByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, firebaseApi_1.getUserByIdFromFirebase)(userId);
        });
    },
    /**
     * Log in a user account.
     * @param userId The ID of the user.
     * @param password The user's password.
     * @returns A promise that resolves with an object containing user info and JWT token, or null if login fails.
     */
    loginUser(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. 사용자 ID로 계정 정보 가져오기
                const user = yield (0, firebaseApi_1.getUserByIdFromFirebase)(userId); // Firebase API에서 사용자 정보 가져오는 함수 필요
                if (!user) {
                    Logger_1.default.warn(`Login failed: User not found with ID ${userId}`);
                    return null; // 사용자 없음
                }
                // 2. 제공된 비밀번호와 저장된 해싱된 비밀번호 비교
                // TODO: Firebase API (getUserByIdFromFirebase)가 비밀번호도 가져오는지 확인 필요
                // 만약 Firebase API가 해싱된 비밀번호를 가져오지 않는다면, 비밀번호 확인 로직을 별도로 구현해야 합니다.
                // 예: 별도의 Firebase API 함수 호출 또는 서비스 내부에서 처리
                // 현재는 user 객체에 password 필드가 있다고 가정합니다.
                if (!user.password) {
                    Logger_1.default.error(`Login failed for user ${userId}: Password not stored or retrieved.`);
                    return null; // 비밀번호 정보가 없는 경우
                }
                const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!passwordMatch) {
                    Logger_1.default.warn(`Login failed: Invalid password for user ID ${userId}`);
                    return null; // 비밀번호 불일치
                }
                // 3. 로그인 성공 시 JWT 토큰 생성
                // 토큰에 포함할 정보 (사용자 ID 등)
                const payload = { userId: user.userId };
                // JWT 토큰 생성 (만료 시간 설정 등)
                const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // 1시간 유효한 토큰 예시
                // 비밀번호는 응답에 포함하지 않도록 제외
                const userWithoutPassword = Object.assign({}, user);
                delete userWithoutPassword.password; // 비밀번호 필드 제거
                // 4. 사용자 정보와 토큰 반환
                return { user: userWithoutPassword, token };
            }
            catch (error) {
                Logger_1.default.error(`Error during login for user ${userId}:`, error);
                throw new Error('Failed to log in'); // 로그인 처리 중 오류 발생
            }
        });
    }
    // 필요한 다른 계정 관련 서비스 함수들 추가
    // 예: 프로필 업데이트, 비밀번호 변경 등
};
exports.default = accountService;
//# sourceMappingURL=accountService.js.map