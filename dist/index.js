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
const showsRoutes_1 = __importDefault(require("@/routes/showsRoutes")); // 쇼 라우터 import
const accountsRoutes_2 = require("@/routes/accountsRoutes"); // authenticate 및 apiKeyAuth 미들웨어 import
const Logger_1 = __importDefault(require("./utils/Logger"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // CORS 미들웨어 추가
app.use(express_1.default.json()); // JSON 요청 본문 파싱을 위한 미들웨어 추가
app.get('/', (req, res) => {
    // addVersionToFirestore()
    res.send(`HELLO WECAN-SHOW!`);
});
// Root 경로에 적용할 Rate Limiter
const rootRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1분 동안
    max: 100, // IP당 최대 60개 요청 허용
    message: 'Too many requests from this IP, please try again after a minute',
});
// Root 경로에 Rate Limiting 미들웨어 적용
// app.use('/', rootRateLimiter);
// Account 관련 라우터 사용
app.use('/accounts', accountsRoutes_1.default);
// Quiz 관련 라우터 사용
// Show 관련 라우터 사용
app.use('/shows', accountsRoutes_2.authenticate, showsRoutes_1.default);
const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
    Logger_1.default.info(`listening on port ${port}`);
    Logger_1.default.info(`api key is ${process.env.API_KEY}`);
});
//# sourceMappingURL=index.js.map