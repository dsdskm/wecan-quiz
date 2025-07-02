require('module-alias/register'); // Add this line at the very beginning
require('dotenv').config(); // .env 파일에서 환경 변수 로드


import express, { Request, Response } from 'express';
import cors from 'cors'; // cors 패키지 추가
import rateLimit from 'express-rate-limit'; // rateLimit 함수 import

import accountsRouter from '@/routes/accountsRoutes'; // accounts 라우터 import

import showsRouter from '@/routes/showRoutes'; // 쇼 라우터 import
import quizRouter from '@/routes/quizRoutes'
import Logger from './utils/Logger';
import { authenticateToken } from './middleware/auth';



const app = express();

app.use(cors()); // CORS 미들웨어 추가
app.use(express.json()); // JSON 요청 본문 파싱을 위한 미들웨어 추가

app.get('/', (req, res) => {
  // addVersionToFirestore()
  res.send(`HELLO WECAN-SHOW!`);
});

// Root 경로에 적용할 Rate Limiter
const rootRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분 동안
  max: 100, // IP당 최대 60개 요청 허용
  message: 'Too many requests from this IP, please try again after a minute',
});

// Root 경로에 Rate Limiting 미들웨어 적용
// app.use('/', rootRateLimiter);

// Account 관련 라우터 사용
app.use('/accounts', accountsRouter);

// Show 관련 라우터 사용
app.use('/shows', authenticateToken, showsRouter);

// Quiz 관련 라우터 사용
app.use('/quiz', authenticateToken, quizRouter);

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  Logger.info(`listening on port ${port}`);
});
