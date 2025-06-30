import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { showService } from '../services/showService'; // Assuming the service file is in ../services

const router = Router();

// Joi schema for creating a new show
const createShowSchema = Joi.object({
  title: Joi.string().required(),
  details: Joi.string().required(),
  backgroundImageUrl: Joi.string().optional(),
  // quizzes are added separately, not required at creation
  status: Joi.string().valid('waiting', 'inprogress', 'paused', 'completed').required(),
  url: Joi.string().uri().required(),
  // createdAt, startTime, endTime, updatedAt are managed by the service/database
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
  try {
    const { error, value } = createShowSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Add creation timestamp and initial status/url
    const newShowData = {
        ...value,
        createdAt: new Date(),
        updatedAt: new Date(),
        // startTime and endTime will likely be set when the show starts
        quizzes: [] // Start with an empty quiz array
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