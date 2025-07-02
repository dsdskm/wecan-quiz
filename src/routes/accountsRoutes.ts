import express from 'express';
import { authenticateToken } from '@/middleware/auth'; // 인증 미들웨어 import (필요하다면 import)
import {
    registerAccount,
    loginAccount,
    getAccount,
} from '@/controllers/accountController'; // 컨트롤러 함수 import

const router = express.Router();

// 계정 로그인 라우트
router.post('/login', loginAccount); // <-- 로그인 라우트 정의 활성화 및 loginAccount 핸들러 연결 

// 프로필 조회 라우트
router.get('/:userId', authenticateToken, getAccount); // getAccountProfile 컨트롤러 함수 필요

// 계정 등록 라우트
router.post('/register', registerAccount);

export default router;
