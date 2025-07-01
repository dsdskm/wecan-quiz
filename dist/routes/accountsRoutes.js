"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountController_1 = require("@/controllers/accountController"); // 컨트롤러 함수 import
const router = express_1.default.Router();
// 계정 등록 라우트
router.post('/register', accountController_1.registerAccount); // 라우트 핸들러를 컨트롤러 함수로 교체
// 계정 로그인 라우트
router.post('/login', accountController_1.loginAccount); // <-- 로그인 라우트 정의 활성화 및 loginAccount 핸들러 연결
// 프로필 조회 라우트 (예시, 실제 구현 필요 - authenticateToken 미들웨어 필요)
// router.get('/profile', authenticateToken, getAccountProfile); // getAccountProfile 컨트롤러 함수 필요
exports.default = router;
//# sourceMappingURL=accountsRoutes.js.map