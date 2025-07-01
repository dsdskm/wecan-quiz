

import { Account } from '../types/Account'; // Account 타입 import
import Logger from '../utils/Logger'; // Logger import
import jwt from 'jsonwebtoken'; // JWT 라이브러리 import
import bcrypt from 'bcrypt'; // 비밀번호 해싱 라이브러리 import
import { getUserByIdFromFirebase, registerUserInFirebase } from '@/firebaseApi';

// JWT Secret Key (환경 변수에서 가져오거나 안전하게 관리)
// TODO: 실제 환경에서는 .env 파일 등을 사용하여 관리해야 합니다.
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // 기본값은 안전하지 않으니 변경 필수

const accountService = {
  /**
   * Register a new user account.
   * @param userData The user data for registration.
   * @returns A promise that resolves with the created Account object.
   */
  async registerUser(userData: Partial<Account>): Promise<Account> {
    // Add any business logic or validation here before saving to Firebase
    // For example, check if user ID or email already exists
    // Hash the password before saving

    // 예시: 비밀번호 해싱
    if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
    }

    const newAccount = await registerUserInFirebase(userData);
    return newAccount;
  },

  /**
   * Get a user account by user ID.
   * @param userId The ID of the user.
   * @returns A promise that resolves with the Account object or null if not found.
   */
  async getUserByUserId(userId: string): Promise<Account | null> {
    return await getUserByIdFromFirebase(userId);
  },

  /**
   * Log in a user account.
   * @param userId The ID of the user.
   * @param password The user's password.
   * @returns A promise that resolves with an object containing user info and JWT token, or null if login fails.
   */
  async loginUser(userId: string, password: string): Promise<{ user: Account, token: string } | null> {
      try {
          // 1. 사용자 ID로 계정 정보 가져오기
          const user = await getUserByIdFromFirebase(userId); // Firebase API에서 사용자 정보 가져오는 함수 필요

          if (!user) {
              Logger.warn(`Login failed: User not found with ID ${userId}`);
              return null; // 사용자 없음
          }

          // 2. 제공된 비밀번호와 저장된 해싱된 비밀번호 비교
          // TODO: Firebase API (getUserByIdFromFirebase)가 비밀번호도 가져오는지 확인 필요
          // 만약 Firebase API가 해싱된 비밀번호를 가져오지 않는다면, 비밀번호 확인 로직을 별도로 구현해야 합니다.
          // 예: 별도의 Firebase API 함수 호출 또는 서비스 내부에서 처리
          // 현재는 user 객체에 password 필드가 있다고 가정합니다.
          if (!user.password) {
              Logger.error(`Login failed for user ${userId}: Password not stored or retrieved.`);
              return null; // 비밀번호 정보가 없는 경우
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
              Logger.warn(`Login failed: Invalid password for user ID ${userId}`);
              return null; // 비밀번호 불일치
          }

          // 3. 로그인 성공 시 JWT 토큰 생성
          // 토큰에 포함할 정보 (사용자 ID 등)
          const payload = { userId: user.userId };

          // JWT 토큰 생성 (만료 시간 설정 등)
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // 1시간 유효한 토큰 예시

          // 비밀번호는 응답에 포함하지 않도록 제외
          const userWithoutPassword: Account = { ...user };
          delete userWithoutPassword.password; // 비밀번호 필드 제거

          // 4. 사용자 정보와 토큰 반환
          return { user: userWithoutPassword, token };

      } catch (error) {
          Logger.error(`Error during login for user ${userId}:`, error);
          throw new Error('Failed to log in'); // 로그인 처리 중 오류 발생
      }
  }

  // 필요한 다른 계정 관련 서비스 함수들 추가
  // 예: 프로필 업데이트, 비밀번호 변경 등
};

export default accountService;
