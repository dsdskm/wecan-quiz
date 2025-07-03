// src/types/Quiz.ts

export interface Quiz {
  id: number;
  question: string;
  quizType: string;
  options?: string[]; // Optional as not all quiz types may have options
  correctAnswer: string | string[] | number; // Type depends on quizType
  timeLimit: number;
  hint?: string; // Optional
  referenceImageUrl?: string; // Optional
  referenceVideoUrl?: string; // Optional
}