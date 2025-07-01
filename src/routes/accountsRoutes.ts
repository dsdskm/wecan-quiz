import express from 'express';
import { Request, Response } from 'express'; // Request, Response import 유지
import { authenticateToken } from '@/middleware/auth'; // 인증 미들웨어 import (필요하다면 import)

import {
    registerAccount,
    loginAccount, // <-- loginAccount 컨트롤러 함수 import 추가
    // 다른 계정 관련 컨트롤러 함수들 import
} from '@/controllers/accountController'; // 컨트롤러 함수 import


const router = express.Router();

// 계정 등록 라우트
router.post('/register', registerAccount); // 라우트 핸들러를 컨트롤러 함수로 교체

// 계정 로그인 라우트
router.post('/login', loginAccount); // <-- 로그인 라우트 정의 활성화 및 loginAccount 핸들러 연결

// 프로필 조회 라우트 (예시, 실제 구현 필요 - authenticateToken 미들웨어 필요)
// router.get('/profile', authenticateToken, getAccountProfile); // getAccountProfile 컨트롤러 함수 필요


export default router;
