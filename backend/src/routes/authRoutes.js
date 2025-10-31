import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login',loginUser);


router.get('/profile', protect, (req, res) => {
    res.json({
        message: "Du hast Zugriff auf diesen geschützten Bereich!",
        user: req.user 
    });
});

router.get('/admin-test', protect, adminOnly, (req, res) => {
    res.json({
        message: "WILLKOMMEN, ADMIN!",
        user: req.user
    });
});

export default router;