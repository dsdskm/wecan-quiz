import quizService from '@/services/quizService';
import Logger from '@/utils/Logger';
import { Request, Response } from 'express';


// 퀴즈 생성 핸들러
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const quizData = req.body;
    const newQuiz = await quizService.createQuiz(quizData); // quizService 호출
    res.status(201).json(newQuiz);
  } catch (error) {
    Logger.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
};

// 특정 퀴즈 조회 핸들러
export const getQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    const quiz = await quizService.getQuizById(quizId); // quizService 호출
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    Logger.error('Error getting quiz:', error);
    res.status(500).json({ message: 'Failed to get quiz' });
  }
};

// 특정 퀴즈 업데이트 핸들러
export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    const updatedQuizData = req.body;
    const updatedQuiz = await quizService.updateQuiz(quizId, updatedQuizData); // quizService 호출
    if (updatedQuiz) {
      res.json(updatedQuiz);
    } else {
      res.status(404).json({ message: 'Quiz not found or update fail' });
    }
  } catch (error) {
    Logger.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Failed to update quiz' });
  }
};

// 특정 퀴즈 삭제 핸들러
export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    const success = await quizService.deleteQuiz(quizId); // quizService 호출
    if (success) {
      res.json({ message: 'Quiz deleted successfully' });
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    Logger.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
};

// 특정 Quiz의 참고 이미지 업로드 및 URL 업데이트 핸들러
export const uploadQuizReferenceImage = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId;
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const updatedQuiz = await quizService.updateQuizReferenceImageUrl(quizId, file); // quizId와 파일 객체 전달
    if (updatedQuiz) {
      // 업데이트된 Show 정보를 포함하여 응답
      res.json({ message: 'Reference image uploaded and quiz updated successfully', quiz: updatedQuiz });
    } else {
      // Show가 없거나 업데이트 실패 시 404 응답
      res.status(404).json({ message: 'quiz not found or reference image upload failed' });
    }

  } catch (error) {
    Logger.error('Error uploading quiz reference image:', error);
    res.status(500).json({ message: 'Failed to upload quiz reference image' });
  }
};

export const deleteQuizReferenceImage = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId;
    const success = await quizService.deleteQuizReferenceImage(quizId);

    if (success) {
      res.json({ message: 'Background image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Show not found or background image not found/failed to delete' });
    }
  } catch (error: any) {
    Logger.error(`Error deleting background image for show ${req.params.showId}:`, error);
    res.status(500).json({ message: error.message });
  }
};
