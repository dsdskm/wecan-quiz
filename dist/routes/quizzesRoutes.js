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
const quizService_1 = require("../services/quizService");
const router = (0, express_1.Router)();
// Joi schema for quiz creation
const createQuizSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    questions: joi_1.default.array().items(joi_1.default.object({
        text: joi_1.default.string().required(),
        options: joi_1.default.array().items(joi_1.default.string()).min(2).required(),
        correctAnswer: joi_1.default.string().required(), // Assuming correct answer is one of the options
    })).min(1).required(),
});
// Joi schema for quiz update
const updateQuizSchema = joi_1.default.object({
    title: joi_1.default.string().optional(),
    questions: joi_1.default.array().items(joi_1.default.object({
        text: joi_1.default.string().required(),
        options: joi_1.default.array().items(joi_1.default.string()).min(2).required(),
        correctAnswer: joi_1.default.string().required(),
    })).min(1).optional(),
}).min(1); // At least one field is required for update
// GET /quizzes - get all quizzes
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizzes = yield (0, quizService_1.getAllQuizzes)();
        res.json(quizzes);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// GET /quizzes/:quizId - get quiz by ID
router.get('/:quizId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.params.quizId;
        const quiz = yield (0, quizService_1.getQuizById)(quizId);
        if (quiz) {
            res.json(quiz);
        }
        else {
            res.status(404).json({ message: 'Quiz not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// POST /quizzes - create new quiz
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = createQuizSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const newQuiz = yield (0, quizService_1.createQuiz)(req.body);
        res.status(201).json(newQuiz);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// PUT /quizzes/:quizId - update quiz by ID
router.put('/:quizId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = updateQuizSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const quizId = req.params.quizId;
        const updatedQuiz = yield (0, quizService_1.updateQuiz)(quizId, req.body);
        if (updatedQuiz) {
            res.json(updatedQuiz);
        }
        else {
            res.status(404).json({ message: 'Quiz not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// DELETE /quizzes/:quizId - delete quiz by ID
router.delete('/:quizId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.params.quizId;
        const success = yield (0, quizService_1.deleteQuiz)(quizId);
        if (success) {
            res.status(204).send(); // No content to send back on successful deletion
        }
        else {
            res.status(404).json({ message: 'Quiz not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=quizzesRoutes.js.map