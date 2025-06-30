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
const router = (0, express_1.Router)();
// Joi schema for creating a new show
const createShowSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    details: joi_1.default.string().required(),
    backgroundImageUrl: joi_1.default.string().optional(),
    // quizzes are added separately, not required at creation
    status: joi_1.default.string().valid('waiting', 'inprogress', 'paused', 'completed').required(),
    url: joi_1.default.string().uri().required(),
    // createdAt, startTime, endTime, updatedAt are managed by the service/database
});
// Joi schema for updating a show
const updateShowSchema = joi_1.default.object({
    title: joi_1.default.string().optional(),
    details: joi_1.default.string().optional(),
    backgroundImageUrl: joi_1.default.string().optional(),
    status: joi_1.default.string().valid('waiting', 'inprogress', 'paused', 'completed').optional(),
    url: joi_1.default.string().uri().optional(),
    // quizzes, createdAt, startTime, endTime, updatedAt are not updated directly via this route
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
    try {
        const { error, value } = createShowSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        // Add creation timestamp and initial status/url
        const newShowData = Object.assign(Object.assign({}, value), { createdAt: new Date(), updatedAt: new Date(), 
            // startTime and endTime will likely be set when the show starts
            quizzes: [] // Start with an empty quiz array
         });
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
exports.default = router;
//# sourceMappingURL=showsRoutes.js.map