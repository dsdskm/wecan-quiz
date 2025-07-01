import { Router, Request, Response } from 'express';
import Joi from 'joi';
import Logger from '@/utils/Logger';
import * as accountService from '@/services/accountService'; // accountService 전체를 임포트
import jwt from 'jsonwebtoken'; // Import jsonwebtoken

const router = Router();
const jwtSecret = process.env.JWT_SECRET || 'wecan-show-secret'; // Use a strong, random key and manage it securely!

// 사용자 로그인 데이터 유효성 검사 스키마
const loginSchema = Joi.object({
  userId: Joi.string().required(),
  password: Joi.string().required(),
});

const passwordSchema = Joi.object({
  password: Joi.string().required(),
});

// 유효성 검사 미들웨어 생성 함수
const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: () => void) => {
  const { error } = schema.validate(req.body);
  Logger.error(`validate error`,error)
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

// JWT 인증 미들웨어
export const authenticate = (req: Request, res: Response, next: any): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Extract the token part

    jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
      if (err) {
        // Token is invalid or expired
        res.status(401).send('Invalid or expired token');
      } else {
        // Token is valid, attach user info and proceed
        req.user = decoded; // decoded should contain the payload, e.g., { userId: '...' }
        next();
      }
    });
  } else {
    // No token provided or not in "Bearer " format
    res.status(401).send('Unauthorized');
  }
};



// 사용자 계정 생성 - accountService 사용, API Key 인증 제거
router.post('/register', async (req: Request, res: Response) => {
  const { userId, username, password, email } = req.body;

  try {
    // accountService의 registerUser 함수 호출
    const newAccount = await accountService.registerUser({ userId, username, password, email });
    res.status(201).json(newAccount);
  } catch (error: any) {
    Logger.error(`Account registration failed: ${error.message}`);
    if (error.message === 'User ID already exists' || error.message === 'Invalid email format.' || error.message.startsWith('Password')) {
      return res.status(400).send(error.message);
    }
    res.status(500).send('Error registering account');
  }
});

// 사용자 계정 목록 조회 - accountService 사용
router.get('/', async (req: Request, res: Response) => {
  try {
    // accountService의 getAllAccounts 함수 호출 (아직 없으면 추가 필요)
    const accounts = await accountService.getAllAccounts();
    res.status(200).json(accounts);
  } catch (error: any) {
    Logger.error(`Error fetching accounts: ${error.message}`);
    res.status(500).send('Error fetching accounts.');
  }
});



// 사용자 로그인 - accountService 사용
router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  const { userId, password } = req.body;
  Logger.info(`login userId=${userId},password=${password}`,)
  try {
    // accountService의 loginUser 함수 호출
    const loginResult = await accountService.loginUser({ userId, password });
    const token = jwt.sign({ userId: loginResult.userId }, jwtSecret, { expiresIn: '1h' }); // Assuming loginResult has userId
    const result = { ...loginResult, token }
    Logger.info(`result`,result)
    res.status(200).json(result);
  } catch (error: any) {
    Logger.error(`Account login failed: ${error.message}`);
    res.status(401).send('Invalid credentials'); // 로그인 실패 시 401 응답
  }
});

// 사용자 로그아웃 (간단한 예시 - 클라이언트에서 토큰 삭제를 안내)
router.post('/logout', /*authenticate*/ (req: Request, res: Response) => {
  const userId = req.body.userId; // req.user 객체에 userId 속성이 있다고 가정

  if (userId) {
    Logger.info(`User ${userId} logged out.`); // 로그아웃 로그 기록
  } else {
    Logger.warn('Logout request received, but user ID not found in token.');
  }
  res.status(200).send('Log out successful. Please remove the token from your client.');
});

export default router;