import { db } from '@/firebase';
import { Account } from '@/types/Account';
import { v4 as uuidv4 } from 'uuid';
import Logger from '@/utils/Logger';
import bcrypt from 'bcrypt'; // bcrypt는 npm 패키지이므로 상대 경로가 아닌 모듈 이름으로 임포트
import Joi from 'joi';

// 임시 사용자 데이터 저장 (메모리) - 실제 서비스에서는 데이터베이스 사용
const accountsCollection = db.collection('accounts');


// 사용자 로그인 데이터 유효성 검사 스키마
const loginSchema = Joi.object({
  userId: Joi.string().required(),
  password: Joi.string().required(),
});


export const registerUser = async (userData: any) => {
  const value = userData;

  const { userId, username, password } = value;

  // userId 중복 확인
  const accountSnapshot = await accountsCollection.where('userId', '==', userId).get();
  if (!accountSnapshot.empty) {
    throw new Error('User ID already exists');
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10); // 10은 솔트 라운드 수

  // 새 계정 생성
  const newAccount: Account = {
    id: uuidv4(), // 고유 ID 생성
    userId: userId,
    username: username,
    password: hashedPassword, // 해싱된 비밀번호 저장
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Firestore에 계정 추가
  await accountsCollection.doc(newAccount.id).set(newAccount);
  Logger.info(`New account created: ${newAccount.userId}`);

  // 민감한 정보 제외하고 반환
  const { password: _, ...accountWithoutPassword } = newAccount;
  return accountWithoutPassword;
};

export const loginUser = async (loginData: any) => {
  // 입력 값 유효성 검사
  const { error, value } = loginSchema.validate(loginData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const { userId, password } = value;

  // 사용자 찾기
  const accountSnapshot = await accountsCollection.where('userId', '==', userId).limit(1).get();
  if (accountSnapshot.empty) {
    throw new Error('User not found');
  }

  const accountDoc = accountSnapshot.docs[0];
  const account = accountDoc.data() as Account;

  // 입력된 비밀번호와 저장된 해시된 비밀번호 비교
  const passwordMatch = await bcrypt.compare(password, account.password as string);
  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  // 로그인 성공 시 토큰 생성 등 처리 (예시)
  const token = uuidv4(); // 임시 토큰 생성
  Logger.info(`Generated token: "${token}"`);
  Logger.info(`User logged in: ${userId}`);

  // 토큰 및 사용자 정보 반환
  return { token, userId: account.userId, username: account.username };
};

export const deleteUser = async (userId: string) => {
  // 사용자 찾기
  const accountSnapshot = await accountsCollection.where('userId', '==', userId).limit(1).get();

  if (accountSnapshot.empty) {
    throw new Error('User not found');
  }

  const accountDoc = accountSnapshot.docs[0];
  const accountIdToDelete = accountDoc.id;

  // Firestore에서 계정 삭제
  await accountsCollection.doc(accountIdToDelete).delete();
  Logger.info(`Account deleted: ${userId}`);

  return true; // 삭제 성공 시 true 반환
};

export const getAllAccounts = async (): Promise<Account[]> => {
  try {
    const accountsSnapshot = await accountsCollection.get();
    const accounts: Account[] = [];

    accountsSnapshot.forEach(doc => {
      const accountData = doc.data() as Account;
      // 민감한 정보 (비밀번호) 제외하고 추가
      const { password: _, ...accountWithoutPassword } = accountData;
      accounts.push(accountWithoutPassword as Account);
    });

    Logger.info(`Fetched ${accounts.length} accounts.`);
    return accounts;
  } catch (error: any) {
    throw new Error(`Error fetching accounts: ${error.message}`);
  }
};
