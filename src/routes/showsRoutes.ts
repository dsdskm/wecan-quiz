import express from 'express';
// import { authenticate } from './accountsRoutes'; // 이 줄은 더 이상 필요 없음

import { authenticateToken } from '@/middleware/auth'; // 인증 미들웨어 import
import multer from 'multer'; // multer 미들웨어 import

// Show 컨트롤러 함수 import
import {
  createShow,
  getAllShows,
  getShow,
  updateShow,
  deleteShow,
  uploadShowBackgroundImage,
  deleteShowBackgroundImage,
} from '@/controllers/showsController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // 메모리 스토리지 사용

// Show 생성 라우트 (배경 이미지 없이 Show 데이터만 생성)
router.post('/', authenticateToken, createShow); // upload.single('backgroundImage') 미들웨어 제거

// 모든 Show 조회 라우트
router.get('/', authenticateToken, getAllShows); // 핸들러를 컨트롤러 함수로 교체

// 특정 Show 조회 라우트
router.get('/:id', authenticateToken, getShow); // 핸들러를 컨트롤러 함수로 교체

// Show 업데이트 라우트 (배경 이미지 파일 처리 로직 제외)
router.put('/:id', authenticateToken, updateShow); // upload.single('backgroundImage') 미들웨어 제거

// Show 삭제 라우트 (단일 삭제)
router.delete('/:id', authenticateToken, deleteShow); // 핸들러를 컨트롤러 함수로 교체

// Show 배경 이미지 업로드 라우트
router.post('/:showId/background-image', authenticateToken, upload.single('backgroundImage'), uploadShowBackgroundImage); // uploadShowBackgroundImage 컨트롤러 함수 사용

// Show 배경 이미지 삭제 라우트
router.delete('/:showId/background-image', authenticateToken, deleteShowBackgroundImage); // deleteShowBackgroundImage 컨트롤러 함수 사용

export default router;
