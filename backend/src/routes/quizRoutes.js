import express from 'express';
import { startQuiz, submitQuiz, fetchLeaderboard } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/start', protect, startQuiz);
router.post('/submit', protect, submitQuiz);
router.get('/leaderboard', protect, fetchLeaderboard);

export default router;