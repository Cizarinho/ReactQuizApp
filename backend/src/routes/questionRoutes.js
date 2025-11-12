import express from 'express';
import { addNewQuestion, fetchAllQuestions, importApiQuestions } from '../controllers/questionController.js';
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

/**
 * @route POST /api/questions/import
 * @desc Admin importiert Fragen von der Open Trivia DB
 * @access Private (Admin)
 */
router.post('/import',protect, adminOnly, importApiQuestions)


export default router;