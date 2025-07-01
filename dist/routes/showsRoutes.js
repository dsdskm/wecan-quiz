"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const showService_1 = require("../services/showService"); // Assuming the service file is in ../services
const Logger_1 = __importDefault(require("@/utils/Logger"));
const multer_1 = __importDefault(require("multer")); // Import multer
const router = (0, express_1.Router)();
const auth_1 = require("../middleware/auth");
// Joi schema for Quiz structure (assuming it matches Quiz.ts)
const quizSchema = joi_1.default.object({
    question: joi_1.default.string().required(),
    id: joi_1.default.string().optional(), // Added based on Quiz.ts
    title: joi_1.default.string().optional(), // Added based on Quiz.ts
    quizType: joi_1.default.string().optional(), // Added based on Quiz.ts
    options: joi_1.default.array().items(joi_1.default.string()).required(),
    correctAnswer: joi_1.default.alt(joi_1.default.string(), joi_1.default.array().items(joi_1.default.string()), joi_1.default.number()).optional(), // Added based on Quiz.ts
    timeLimit: joi_1.default.number().optional(), // Added based on Quiz.ts
    hint: joi_1.default.string().optional(), // Added based on Quiz.ts
    referenceImageUrl: joi_1.default.string().optional(), // Added based on Quiz.ts
    referenceVideoUrl: joi_1.default.string().optional(), // Added based on Quiz.ts
    createdAt: joi_1.default.date().optional(), // Added based on Quiz.ts
    updatedAt: joi_1.default.date().optional(), // Added based on Quiz.ts
});
const createShowSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    // Detailed description of the show
    details: joi_1.default.string().required(),
    // Optional URL for a background image
    backgroundImageUrl: joi_1.default.string().allow(null, '').optional(),
    quizzes: joi_1.default.array().items(quizSchema).min(0).required(), // 빈 배열도 허용
    // Status of the show (waiting, inprogress, paused, completed)
    status: joi_1.default.string().valid('waiting', 'inprogress', 'paused', 'completed').required(),
    // URL related to the show
    url: joi_1.default.string().uri().required(),
});
// Joi schema for updating a show
const updateShowSchema = joi_1.default.object({
    title: joi_1.default.string().optional(),
    details: joi_1.default.string().optional(),
    backgroundImageUrl: joi_1.default.string().allow(null, '').optional(),
    status: joi_1.default.string().valid('waiting', 'inprogress', 'paused', 'completed').optional(),
    url: joi_1.default.string().uri().optional(),
    // quizzes, createdAt, startTime, endTime, updatedAt are not updated directly via this route
});
// Configure multer for file uploads
const storage = multer_1.default.memoryStorage(); // Store files in memory
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB (adjust as needed)
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
});
// GET /shows - get all shows
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shows = yield showService_1.showService.getAllShows();
        res.status(200).json(shows);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// GET /shows/:showId - get show by ID
router.get('/:showId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { showId } = req.params;
        const show = yield showService_1.showService.getShowById(showId);
        if (!show) {
            return res.status(404).json({ error: 'Show not found' });
        }
        res.status(200).json(show);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// POST /shows - create new show
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Logger_1.default.info("post shows");
    try {
        Logger_1.default.info(`POST /shows received body: ${JSON.stringify(req.body)}`);
        const { error, value } = createShowSchema.validate(req.body);
        // if (error) {
        //   Logger.error("Joi validation error:", error.details[0].message);
        //   return res.status(400).json({ error: error.details[0].message });
        // }
        Logger_1.default.info(`POST /shows Joi validated value: ${JSON.stringify(value)}`);
        const newShowData = Object.assign(Object.assign({}, value), { createdAt: new Date(), updatedAt: new Date() });
        const newShow = yield showService_1.showService.createShow(newShowData);
        res.status(201).json(newShow);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// PUT /shows/:showId - update show by ID
router.put('/:showId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { showId } = req.params;
        const { error, value } = updateShowSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        // Add updated timestamp
        const updateData = Object.assign(Object.assign({}, value), { updatedAt: new Date() });
        const updatedShow = yield showService_1.showService.updateShow(showId, updateData);
        if (!updatedShow) {
            return res.status(404).json({ error: 'Show not found' });
        }
        res.status(200).json(updatedShow);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// DELETE /shows/:showId - delete show by ID
router.delete('/:showId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { showId } = req.params;
        const success = yield showService_1.showService.deleteShow(showId);
        if (!success) {
            return res.status(404).json({ error: 'Show not found' });
        }
        res.status(204).send(); // No content to send back on successful deletion
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// POST /shows/:showId/quizzes - add quiz to show
router.post('/:showId/quizzes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { showId } = req.params;
        const { quizId } = req.body;
        if (!quizId || typeof quizId !== 'string') {
            return res.status(400).json({ error: 'quizId is required and must be a string' });
        }
        const updatedShow = yield showService_1.showService.addQuizToShow(showId, quizId);
        if (!updatedShow) {
            // Service should ideally return null if show or quiz not found
            // Or have specific error handling
            // For now, assuming if update fails, it might be show not found
            return res.status(404).json({ error: 'Show or Quiz not found' });
        }
        res.status(200).json(updatedShow);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// DELETE /shows/:showId/quizzes/:quizId - remove quiz from show
router.delete('/:showId/quizzes/:quizId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { showId, quizId } = req.params;
        const updatedShow = yield showService_1.showService.removeQuizFromShow(showId, quizId);
        if (!updatedShow) {
            // Service should ideally return null if show not found or quiz not in show
            // For now, assuming if update fails, it might be show not found
            return res.status(404).json({ error: 'Show or Quiz not found in show' });
        }
        res.status(200).json(updatedShow);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// POST /shows/:id/upload-background-image - Upload background image for a show
router.post('/:id/upload-background-image', auth_1.authenticateToken, upload.single('backgroundImage'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Logger_1.default.info("upload-background-image");
        const showId = req.params.id;
        const file = req.file; // Uploaded file will be in req.file
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Call the service function to upload the image and update the show
        const updatedShow = yield showService_1.showService.uploadBackgroundImage(showId, file);
        if (updatedShow) {
            res.json(updatedShow);
        }
        else {
            res.status(404).json({ message: 'Show not found' });
        }
    }
    catch (error) {
        console.error('Error uploading background image:', error);
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=showsRoutes.js.map