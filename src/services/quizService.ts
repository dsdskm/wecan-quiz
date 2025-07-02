import { Quiz } from '../types/Quiz';
import { createQuizInDb, getQuizFromDb, updateQuizInDb, deleteQuizFromDb } from '../firebaseApi';
import { deleteFileByUrl, generateQuizReferenceImagePath, uploadFile } from '@/utils/storage';
import Logger from '@/utils/Logger';

const quizService = {
  createQuiz: async (quizData: Partial<Quiz>): Promise<Quiz> => {
    try {
      const newQuiz = await createQuizInDb(quizData);
      return newQuiz;
    } catch (error) {
      Logger.error('Error creating quiz:', error);
      throw error;
    }
  },

  getQuizById: async (quizId: string): Promise<Quiz | null> => {
    try {
      const quiz = await getQuizFromDb(quizId);
      return quiz;
    } catch (error) {
      Logger.error(`Error getting quiz with ID ${quizId}:`, error);
      throw error;
    }
  },

  updateQuiz: async (quizId: string, updatedQuizData: Partial<Quiz>): Promise<Quiz | null> => {
    try {
      const updatedQuiz = await updateQuizInDb(quizId, updatedQuizData);
      if (!updatedQuiz) {
        return null;
      }
      return updatedQuiz;
    } catch (error) {
      Logger.error(`Error updating quiz with ID ${quizId}:`, error);
      throw error;
    }
  },

  deleteQuiz: async (quizId: string): Promise<boolean> => {
    try {
      const quizToDelete = await getQuizFromDb(quizId);
      if (quizToDelete && quizToDelete.referenceImageUrl) {
        await deleteFileByUrl(quizToDelete.referenceImageUrl);
      }
      return await deleteQuizFromDb(quizId);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  },

  updateQuizReferenceImageUrl: async (quizId: string, file: Express.Multer.File): Promise<Quiz | null> => {
    try {
      const existingQuiz = await getQuizFromDb(quizId);
      if (!existingQuiz) {
        return null;
      }

      if (existingQuiz.referenceImageUrl) {
        await deleteFileByUrl(existingQuiz.referenceImageUrl);
      }

      const destinationPathWithFileName = generateQuizReferenceImagePath(quizId, file.originalname);
      const contentType = file.mimetype;
      const newImageUrl = await uploadFile(file.buffer, destinationPathWithFileName, contentType);

      const updateData: Partial<Quiz> = { referenceImageUrl: newImageUrl };
      const updatedQuiz = await updateQuizInDb(quizId, updateData);

      if (!updatedQuiz) {
        await deleteFileByUrl(newImageUrl);
        return null;
      }

      return updatedQuiz;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  },

  deleteQuizReferenceImage: async (quizId: string): Promise<boolean> => {
    try {
      const quizToDelete = await getQuizFromDb(quizId);

      if (!quizToDelete) {
        return true;
      }

      if (quizToDelete.referenceImageUrl) {
        await deleteFileByUrl(quizToDelete.referenceImageUrl);
      }

      await updateQuizInDb(quizId, { referenceImageUrl: "" });
      Logger.info(`Successfully cleared referenceImageUrl for quiz ${quizId}`);

      return true;
    } catch (error) {
      Logger.error(`Failed to delete reference image or update show data for quiz ${quizId}:`, error);
      throw error;
    }
  },
};

export default quizService;
