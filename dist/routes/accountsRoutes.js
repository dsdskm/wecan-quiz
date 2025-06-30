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
exports.authenticate = exports.apiKeyAuth = exports.validApiKeys = void 0;
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const Logger_1 = __importDefault(require("@/utils/Logger"));
const accountService = __importStar(require("@/services/accountService")); // accountService 전체를 임포트
const router = (0, express_1.Router)();
// TODO: Implement proper token management, perhaps move to an auth service.
const validTokens = []; // In-memory token storage (for simplicity)
// 사용자 로그인 데이터 유효성 검사 스키마
const loginSchema = joi_1.default.object({
    userId: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
// 유효성 검사 미들웨어 생성 함수
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};
// ==== API Key 인증 미들웨어 예시 ====
exports.validApiKeys = [process.env.API_KEY || 'default_api_key']; // API_KEY 환경 변수에서 읽어오거나 기본값 사용
// API Key 인증 미들웨어
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // 요청 헤더의 'x-api-key' 필드에서 API 키 추출
    if (apiKey && exports.validApiKeys.includes(apiKey)) {
        next(); // 유효한 API 키인 경우 다음 미들웨어 또는 라우트 핸들러로 이동
    }
    else {
        res.status(401).send('Invalid API Key'); // 유효하지 않거나 누락된 API 키인 경우 401 Unauthorized 응답
    }
};
exports.apiKeyAuth = apiKeyAuth;
// 사용자 계정 생성 - accountService 사용
router.post('/register', exports.apiKeyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.get('/', exports.apiKeyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.post('/login', exports.apiKeyAuth, validate(loginSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, password } = req.body;
    try {
        // accountService의 loginUser 함수 호출
        const loginResult = yield accountService.loginUser({ userId, password });
        validTokens.push(loginResult.token); // 로그인 성공 시 임시 토큰 저장
        res.status(200).json(loginResult);
    }
    catch (error) {
        Logger_1.default.error(`Account login failed: ${error.message}`);
        res.status(401).send('Invalid credentials'); // 로그인 실패 시 401 응답
    }
}));
// 사용자 로그아웃 (간단한 예시 - 클라이언트에서 토큰 삭제를 안내)
router.post('/logout', exports.apiKeyAuth, (req, res) => {
    const authHeader = req.headers.authorization; // Authorization 헤더에서 토큰 추출
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // "Bearer " 부분을 제외한 토큰
        // 유효 토큰 목록에서 해당 토큰 제거
        const index = validTokens.indexOf(token);
        if (index > -1) {
            validTokens.splice(index, 1);
            Logger_1.default.info(`Token removed for logout`);
        }
    }
    // 클라이언트에게 토큰 삭제를 알림 (실제 구현에서는 더 복잡한 토큰 무효화 로직 필요)
    res.status(200).send('Logout successful');
});
// 간단한 인증 미들웨어 (로그인 여부 확인) - 토큰 유효성 검사
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // "Bearer " 부분을 제외한 토큰 추출
        // TODO: Replace with proper token validation (e.g., database check, JWT verification)
        if (validTokens.includes(token)) { // In-memory token check
            next(); // 인증된 경우 다음 미들웨어 또는 라우트 핸들러로 이동
            return;
        }
    }
    // 토큰이 없거나 유효하지 않은 경우
    res.status(401).send('Unauthorized');
};
exports.authenticate = authenticate;
// TODO: Implement routes for fetching account details using the service layer.
// For example, router.get('/:userId', authenticate, async (req, res) => { ... });
// 사용자 삭제 - accountService 사용
router.delete('/:userId', exports.apiKeyAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        yield accountService.deleteUser(userId);
        res.status(200).send('Account deleted successfully.');
    }
    catch (error) {
        Logger_1.default.error(`Error deleting account: ${error.message}`);
        // Consider more specific error handling here based on error types from accountService
        res.status(500).send('Error deleting account.');
    }
}));
exports.default = router;
//# sourceMappingURL=accountsRoutes.js.map