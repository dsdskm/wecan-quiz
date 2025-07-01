import { Request, Response } from 'express';
import Logger from '@/utils/Logger'; // Logger import
import accountService from '@/services/accountService';

// 계정 등록 라우트 핸들러
export const registerAccount = async (req: Request, res: Response) => {
  const { userId, username, password } = req.body;

  try {
    // accountService의 registerUser 함수 호출
    const newAccount = await accountService.registerUser({ userId, username, password });
    res.status(201).json(newAccount);
  } catch (error: any) {
    Logger.error(`Account registration failed: ${error.message}`);
    if (error.message === 'User ID already exists' || error.message === 'Invalid email format.' || error.message.startsWith('Password')) {
      return res.status(400).send(error.message);
    }
    res.status(500).send('Error registering account');
  }
};

export const loginAccount = async (req: Request, res: Response) => {
    const { userId, password } = req.body; // 로그인에 필요한 정보 (예: userId, password)
  
    try {
      // accountService의 loginUser 함수 호출
      // loginUser 함수는 인증 성공 시 { user: Account, token: string } 객체 또는 null을 반환
      const loginResult = await accountService.loginUser(userId, password); // userId와 password 전달
  
      if (loginResult) {
         // 로그인 성공 시 사용자 정보와 토큰을 응답
         res.status(200).json(loginResult);
      } else {
         // 로그인 실패 시 (예: 사용자 없거나 비밀번호 불일치)
         res.status(401).send('Invalid credentials'); // Unauthorized
      }
  
    } catch (error: any) {
      Logger.error(`Account login failed: ${error.message}`);
      res.status(500).send('Error logging in');
    }
  };