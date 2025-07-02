import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  uploadQuizReferenceImage,
  deleteQuizReferenceImage
} from '../controllers/quizController';
import { upload } from '@/utils/storage';

const router = express.Router();

router.post('/', authenticateToken, createQuiz);

router.get('/:id', authenticateToken, getQuiz);

router.put('/:id', authenticateToken, updateQuiz);

router.delete('/:id', authenticateToken, deleteQuiz);

router.post('/:quizId/reference-image', authenticateToken, upload.single('referenceImage'), uploadQuizReferenceImage);

router.delete('/:quizId/reference-image', authenticateToken, deleteQuizReferenceImage);

export default router;