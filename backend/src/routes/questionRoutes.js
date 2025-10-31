import express from 'express';
import { addNewQuestion, fetchAllQuestions } from '../controllers/questionController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/questions
 * @desc    Admin erstellt eine neue Frage
 * @access  Private (Admin)
 */
router.post('/', protect, adminOnly, addNewQuestion);


/**
 * @route   GET /api/questions
 * @desc    Eingeloggter User ruft alle Fragen ab
 * @access  Private (Eingeloggt)
 */
router.get('/', protect, fetchAllQuestions);


export default router;