import * as admin from 'firebase-admin';

// Firebase Admin SDK 초기화
// GOOGLE_APPLICATION_CREDENTIALS 환경 변수를 사용하여 서비스 계정 키를 로드합니다.
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Firestore 데이터베이스 인스턴스 가져오기
const db = admin.firestore();

// Firestore 데이터베이스 인스턴스 내보내기
export { db };