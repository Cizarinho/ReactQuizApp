import express from 'express';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

dotenv.config();

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/quiz', quizRoutes)

app.get('/api/test', async (req,res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ success: true, message: 'Datenbankverbindung erfolgreich!', data: rows[0] });
    } catch (error) {
        console.error('Datenbankfehler:', error);
        res.status(500).json({ success: false, message: 'Datenbankverbindung fehlgeschlagen.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});