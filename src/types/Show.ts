export enum ShowStatus {
  Waiting = 'waiting',
  InProgress = 'inprogress',
  Paused = 'paused',
  Completed = 'completed',
}

export interface Show {
  id?: string; // id 타입을 string으로 변경
  title: string;
  details: string;
  backgroundImageUrl?: string;
  quizzes?: string[];
  status: ShowStatus;
  url: string;
  createdAt?: string; // Show 생성 시간 추가
  startTime?: string; // Show 시작 시간 추가
  endTime?: string; // Show 종료 시간
  updatedAt?: string; // Show 업데이트 시간 추가
}