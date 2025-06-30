"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register'); // Add this line at the very beginning
require('dotenv').config(); // .env 파일에서 환경 변수 로드
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // cors 패키지 추가
const express_rate_limit_1 = __importDefault(require("express-rate-limit")); // rateLimit 함수 import
const accountsRoutes_1 = __importDefault(require("@/routes/accountsRoutes")); // accounts 라우터 import
// import quizzesRouter from '@/routes/quizzesRoutes'; // 퀴즈 라우터 import
// import showsRouter from '@/routes/showsRoutes'; // 쇼 라우터 import
const accountsRoutes_2 = require("@/routes/accountsRoutes"); // authenticate 및 apiKeyAuth 미들웨어 import
const Logger_1 = __importDefault(require("./utils/Logger"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // CORS 미들웨어 추가
app.use(express_1.default.json()); // JSON 요청 본문 파싱을 위한 미들웨어 추가
app.get('/', (req, res) => {
    // API Key 인증 미들웨어는 이 라우트 핸들러 이전에 적용됩니다.
    // Rate Limiter는 이 라우트 핸들러 이전에 적용됩니다.
    // Rate Limiter는 이 라우트 핸들러 이전에 적용됩니다.
    const name = process.env.NAME;
    // addVersionToFirestore()
    res.send(`${name}!`);
});
// Root 경로에 적용할 Rate Limiter
const rootRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1분 동안
    max: 100, // IP당 최대 60개 요청 허용
    message: 'Too many requests from this IP, please try again after a minute',
});
// 모든 API 엔드포인트에 API Key 인증 미들웨어 적용
app.use(accountsRoutes_2.apiKeyAuth);
// Root 경로에 Rate Limiting 미들웨어 적용
// app.use('/', rootRateLimiter);
// Account 관련 라우터 사용
app.use('/accounts', accountsRoutes_1.default);
// Quiz 관련 라우터 사용
// app.use('/quizzes', authenticate, quizzesRouter);
// Show 관련 라우터 사용
// app.use('/shows', authenticate, showsRouter);
const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
    Logger_1.default.info(`listening on port ${port}`);
    Logger_1.default.info(`api key is ${process.env.API_KEY}`);
});
//# sourceMappingURL=index.js.map