import { Request, Response } from 'express';
import Logger from '@/utils/Logger'; // Logger import
import accountService from '@/services/accountService';

export const registerAccount = async (req: Request, res: Response) => {
  const { userId, username, password } = req.body;

  try {
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
    const { userId, password } = req.body;
  
    try {
      const loginResult = await accountService.loginUser(userId, password);
  
      if (loginResult) {
         res.json(loginResult); // Default status is 200
      } else {
         // 로그인 실패 시 (예: 사용자 없거나 비밀번호 불일치)
         res.status(401).send('Invalid credentials'); // Unauthorized
      }
  
    } catch (error: any) {
      Logger.error(`Account login failed: ${error.message}`);
      res.status(500).send('Error logging in');
    }
  };

export const getAccount = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const account = await accountService.getUserByUserId(userId);

    if (account) {
      res.json(account); // 계정 정보가 있으면 200 응답과 함께 데이터 전송
    } else {      res.status(404).json({ message: 'Account not found' });
    }
  } catch (error: any) {
    Logger.error(`Error fetching account ${userId}: ${error.message}`);
    res.status(500).json({ message: 'Error fetching account' }); // 오류 발생 시 500 응답
  }
};