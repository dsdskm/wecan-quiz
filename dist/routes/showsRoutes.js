"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { authenticate } from './accountsRoutes'; // 이 줄은 더 이상 필요 없음
const auth_1 = require("@/middleware/auth"); // 인증 미들웨어 import
const multer_1 = __importDefault(require("multer")); // multer 미들웨어 import
// Show 컨트롤러 함수 import
const showsController_1 = require("@/controllers/showsController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }); // 메모리 스토리지 사용
// Show 생성 라우트 (배경 이미지 없이 Show 데이터만 생성)
router.post('/', auth_1.authenticateToken, showsController_1.createShow); // upload.single('backgroundImage') 미들웨어 제거
// 모든 Show 조회 라우트
router.get('/', auth_1.authenticateToken, showsController_1.getAllShows); // 핸들러를 컨트롤러 함수로 교체
// 특정 Show 조회 라우트
router.get('/:id', auth_1.authenticateToken, showsController_1.getShow); // 핸들러를 컨트롤러 함수로 교체
// Show 업데이트 라우트 (배경 이미지 파일 처리 로직 제외)
router.put('/:id', auth_1.authenticateToken, showsController_1.updateShow); // upload.single('backgroundImage') 미들웨어 제거
// Show 삭제 라우트 (단일 삭제)
router.delete('/:id', auth_1.authenticateToken, showsController_1.deleteShow); // 핸들러를 컨트롤러 함수로 교체
// Show 배경 이미지 업로드 라우트
router.post('/:showId/background-image', auth_1.authenticateToken, upload.single('backgroundImage'), showsController_1.uploadShowBackgroundImage); // uploadShowBackgroundImage 컨트롤러 함수 사용
// Show 배경 이미지 삭제 라우트
router.delete('/:showId/background-image', auth_1.authenticateToken, showsController_1.deleteShowBackgroundImage); // deleteShowBackgroundImage 컨트롤러 함수 사용
exports.default = router;
//# sourceMappingURL=showsRoutes.js.map