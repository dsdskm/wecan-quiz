require('module-alias/register'); // Add this line at the very beginning
require('dotenv').config(); // .env 파일에서 환경 변수 로드


import express, { Request, Response } from 'express';
import cors from 'cors'; // cors 패키지 추가
import rateLimit from 'express-rate-limit'; // rateLimit 함수 import

import accountsRouter from '@/routes/accountsRoutes'; // accounts 라우터 import
// import quizzesRouter from '@/routes/quizzesRoutes'; // 퀴즈 라우터 import
// import showsRouter from '@/routes/showsRoutes'; // 쇼 라우터 import
import { authenticate, apiKeyAuth } from '@/routes/accountsRoutes'; // authenticate 및 apiKeyAuth 미들웨어 import
import Logger from './utils/Logger';



const app = express();

app.use(cors()); // CORS 미들웨어 추가
app.use(express.json()); // JSON 요청 본문 파싱을 위한 미들웨어 추가

app.get('/', (req, res) => {
  // API Key 인증 미들웨어는 이 라우트 핸들러 이전에 적용됩니다.
  // Rate Limiter는 이 라우트 핸들러 이전에 적용됩니다.

  // Rate Limiter는 이 라우트 핸들러 이전에 적용됩니다.
  const name = process.env.NAME;
  // addVersionToFirestore()
  res.send(`${name}!`);
});

// Root 경로에 적용할 Rate Limiter
const rootRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분 동안
  max: 100, // IP당 최대 60개 요청 허용
  message: 'Too many requests from this IP, please try again after a minute',
});

// 모든 API 엔드포인트에 API Key 인증 미들웨어 적용
app.use(apiKeyAuth);

// Root 경로에 Rate Limiting 미들웨어 적용
// app.use('/', rootRateLimiter);

// Account 관련 라우터 사용
app.use('/accounts', accountsRouter);

// Quiz 관련 라우터 사용
// app.use('/quizzes', authenticate, quizzesRouter);

// Show 관련 라우터 사용
// app.use('/shows', authenticate, showsRouter);

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  Logger.info(`listening on port ${port}`);
  Logger.info(`api key is ${process.env.API_KEY}`);
});
