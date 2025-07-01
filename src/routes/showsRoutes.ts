import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { showService } from '../services/showService'; // Assuming the service file is in ../services
import Logger from '@/utils/Logger';

const router = Router();

// Joi schema for Quiz structure (assuming it matches Quiz.ts)
const quizSchema = Joi.object({
  question: Joi.string().required(),
  id: Joi.string().optional(), // Added based on Quiz.ts
  title: Joi.string().optional(), // Added based on Quiz.ts
  quizType: Joi.string().optional(), // Added based on Quiz.ts
  options: Joi.array().items(Joi.string()).required(),
  correctAnswer: Joi.alt(Joi.string(), Joi.array().items(Joi.string()), Joi.number()).optional(), // Added based on Quiz.ts
  timeLimit: Joi.number().optional(), // Added based on Quiz.ts
  hint: Joi.string().optional(), // Added based on Quiz.ts
  referenceImageUrl: Joi.string().optional(), // Added based on Quiz.ts
  referenceVideoUrl: Joi.string().optional(), // Added based on Quiz.ts
  createdAt: Joi.date().optional(), // Added based on Quiz.ts
  updatedAt: Joi.date().optional(), // Added based on Quiz.ts
});

const createShowSchema = Joi.object({
  title: Joi.string().required(),
  // Detailed description of the show
  details: Joi.string().required(),
  // Optional URL for a background image
  backgroundImageUrl: Joi.string().optional(),
  quizzes: Joi.array().items(quizSchema).min(0).required(), // 빈 배열도 허용
  // Status of the show (waiting, inprogress, paused, completed)
  status: Joi.string().valid('waiting', 'inprogress', 'paused', 'completed').required(),
  // URL related to the show
  url: Joi.string().uri().required(),
});

// Joi schema for updating a show
const updateShowSchema = Joi.object({
  title: Joi.string().optional(),
  details: Joi.string().optional(),
  backgroundImageUrl: Joi.string().optional(),
  status: Joi.string().valid('waiting', 'inprogress', 'paused', 'completed').optional(),
  url: Joi.string().uri().optional(),
  // quizzes, createdAt, startTime, endTime, updatedAt are not updated directly via this route
});

// GET /shows - get all shows
router.get('/', async (req: Request, res: Response) => {
  try {
    const shows = await showService.getAllShows();
    res.status(200).json(shows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /shows/:showId - get show by ID
router.get('/:showId', async (req: Request, res: Response) => {
  try {
    const { showId } = req.params;
    const show = await showService.getShowById(showId);

    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.status(200).json(show);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /shows - create new show
router.post('/', async (req: Request, res: Response) => {
  Logger.info("post shows");
  try {
    Logger.info(`POST /shows received body: ${JSON.stringify(req.body)}`);

    const { error, value } = createShowSchema.validate(req.body);

    if (error) {
      Logger.error("Joi validation error:", error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    Logger.info(`POST /shows Joi validated value: ${JSON.stringify(value)}`);

    const newShowData = {
      ...value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newShow = await showService.createShow(newShowData);
    res.status(201).json(newShow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
// PUT /shows/:showId - update show by ID
router.put('/:showId', async (req: Request, res: Response) => {
  try {
    const { showId } = req.params;
    const { error, value } = updateShowSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Add updated timestamp
    const updateData = {
      ...value,
      updatedAt: new Date(),
    };


    const updatedShow = await showService.updateShow(showId, updateData);

    if (!updatedShow) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.status(200).json(updatedShow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /shows/:showId - delete show by ID
router.delete('/:showId', async (req: Request, res: Response) => {
  try {
    const { showId } = req.params;
    const success = await showService.deleteShow(showId);

    if (!success) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.status(204).send(); // No content to send back on successful deletion
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /shows/:showId/quizzes - add quiz to show
router.post('/:showId/quizzes', async (req: Request, res: Response) => {
  try {
    const { showId } = req.params;
    const { quizId } = req.body;

    if (!quizId || typeof quizId !== 'string') {
      return res.status(400).json({ error: 'quizId is required and must be a string' });
    }

    const updatedShow = await showService.addQuizToShow(showId, quizId);

    if (!updatedShow) {
      // Service should ideally return null if show or quiz not found
      // Or have specific error handling
      // For now, assuming if update fails, it might be show not found
      return res.status(404).json({ error: 'Show or Quiz not found' });
    }

    res.status(200).json(updatedShow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /shows/:showId/quizzes/:quizId - remove quiz from show
router.delete('/:showId/quizzes/:quizId', async (req: Request, res: Response) => {
  try {
    const { showId, quizId } = req.params;

    const updatedShow = await showService.removeQuizFromShow(showId, quizId);

    if (!updatedShow) {
      // Service should ideally return null if show not found or quiz not in show
      // For now, assuming if update fails, it might be show not found
      return res.status(404).json({ error: 'Show or Quiz not found in show' });
    }

    res.status(200).json(updatedShow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


export default router;