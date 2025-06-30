import { Quiz } from './Quiz';

export enum ShowStatus {
  Waiting = 'waiting',
  InProgress = 'inprogress',
  Paused = 'paused',
  Completed = 'completed',
}

export interface Show {
  id: string; // id 타입을 string으로 변경
  title: string;
  details: string;
  backgroundImageUrl?: string;
  quizzes: Quiz[];
  status: ShowStatus;
  url: string;
  createdAt: Date; // Show 생성 시간 추가
  startTime?: Date; // Show 시작 시간 추가
  endTime?: Date; // Show 종료 시간
  updatedAt: Date; // Show 업데이트 시간 추가
}