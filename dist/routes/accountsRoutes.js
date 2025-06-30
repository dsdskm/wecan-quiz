"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.authenticate = void 0;
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const Logger_1 = __importDefault(require("@/utils/Logger"));
const accountService = __importStar(require("@/services/accountService")); // accountService 전체를 임포트
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Import jsonwebtoken
const router = (0, express_1.Router)();
const jwtSecret = process.env.JWT_SECRET || 'wecan-show-secret'; // Use a strong, random key and manage it securely!
// 사용자 로그인 데이터 유효성 검사 스키마
const loginSchema = joi_1.default.object({
    userId: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
const passwordSchema = joi_1.default.object({
    password: joi_1.default.string().required(),
});
// 유효성 검사 미들웨어 생성 함수
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    Logger_1.default.error(`validate error`, error);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
// JWT 인증 미들웨어
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Extract the token part
        jsonwebtoken_1.default.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                // Token is invalid or expired
                res.status(401).send('Invalid or expired token');
            }
            else {
                // Token is valid, attach user info and proceed
                req.user = decoded; // decoded should contain the payload, e.g., { userId: '...' }
                next();
            }
        });
    }
    else {
        // No token provided or not in "Bearer " format
        res.status(401).send('Unauthorized');
    }
};
exports.authenticate = authenticate;
// 사용자 계정 생성 - accountService 사용, API Key 인증 제거
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, username, password, email } = req.body;
    try {
        // accountService의 registerUser 함수 호출
        const newAccount = yield accountService.registerUser({ userId, username, password, email });
        res.status(201).json(newAccount);
    }
    catch (error) {
        Logger_1.default.error(`Account registration failed: ${error.message}`);
        if (error.message === 'User ID already exists' || error.message === 'Invalid email format.' || error.message.startsWith('Password')) {
            return res.status(400).send(error.message);
        }
        res.status(500).send('Error registering account');
    }
}));
// 사용자 계정 목록 조회 - accountService 사용
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accountService의 getAllAccounts 함수 호출 (아직 없으면 추가 필요)
        const accounts = yield accountService.getAllAccounts();
        res.status(200).json(accounts);
    }
    catch (error) {
        Logger_1.default.error(`Error fetching accounts: ${error.message}`);
        res.status(500).send('Error fetching accounts.');
    }
}));
// 사용자 로그인 - accountService 사용
router.post('/login', validate(loginSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, password } = req.body;
    Logger_1.default.info("login");
    try {
        // accountService의 loginUser 함수 호출
        const loginResult = yield accountService.loginUser({ userId, password });
        const token = jsonwebtoken_1.default.sign({ userId: loginResult.userId }, jwtSecret, { expiresIn: '1h' }); // Assuming loginResult has userId
        const result = Object.assign(Object.assign({}, loginResult), { token });
        Logger_1.default.info(`loginResult`, loginResult);
        Logger_1.default.info(`result`, result);
        res.status(200).json(result);
    }
    catch (error) {
        Logger_1.default.error(`Account login failed: ${error.message}`);
        res.status(401).send('Invalid credentials'); // 로그인 실패 시 401 응답
    }
}));
// 사용자 로그아웃 (간단한 예시 - 클라이언트에서 토큰 삭제를 안내)
router.post('/logout', /*authenticate*/ (req, res) => {
    const userId = req.body.userId; // req.user 객체에 userId 속성이 있다고 가정
    if (userId) {
        Logger_1.default.info(`User ${userId} logged out.`); // 로그아웃 로그 기록
    }
    else {
        Logger_1.default.warn('Logout request received, but user ID not found in token.');
    }
    res.status(200).send('Log out successful. Please remove the token from your client.');
});
exports.default = router;
//# sourceMappingURL=accountsRoutes.js.map