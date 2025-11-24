import { getQuizQuestions } from "../models/questionModel.js";
import { saveScore, getLeaderboard } from "../models/leaderboardModel.js";
import pool from "../db.js"

/**
 * Startet ein neues neues Quiz und sendet die Fragen
 */
export const startQuiz = async (req, res) => {
    try {
        const questions = await getQuizQuestions();

        const formattedQuestions = questions.map(q => {
            const answers = [
                q.right_answer, 
                q.wrong_answer_1, 
                q.wrong_answer_2, 
                q.wrong_answer_3
            ];

            for (let i = answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answers[i], answers[j]] = [answers[j], answers[i]];
            }
            
            return {
                frage_id: q.frage_id,
                frage_text: q.frage_text,
                schwierigkeit: q.schwierigkeit,
                answers: answers
            };
        });

        res.json({ success: true, data: formattedQuestions });

    } catch (error) {
        console.error('Fehler beim Starten des Quiz:', error);
        res.status(500).json({ success: false, message: 'Serverfehler.' });
    }
};

export const submitQuiz = async (req, res) => {
    try {
        const userAnswers = req.body.answers; 
        const userId = req.user.id; 
        let score = 0;
        
        const questionIds = userAnswers.map(a => a.frage_id);
        if (questionIds.length === 0) return res.json({ success: true, score: 0 });

        const [correctAnswers] = await pool.query(
            'SELECT frage_id, right_answer, schwierigkeit FROM fragen WHERE frage_id IN (?)',
            [questionIds]
        );

        for (const userAnswer of userAnswers) {
            const correctAnswer = correctAnswers.find(ca => ca.frage_id === userAnswer.frage_id);
            if (correctAnswer && userAnswer.antwort === correctAnswer.right_answer) {
                if (correctAnswer.schwierigkeit === 'easy') score += 10;
                if (correctAnswer.schwierigkeit === 'medium') score += 20;
                if (correctAnswer.schwierigkeit === 'hard') score += 30;
            }
        }

        await saveScore(userId, score);
        res.status(201).json({ success: true, message: 'Quiz beendet!', score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Serverfehler.' });
    }
};

export const fetchLeaderboard = async (req, res) => {
    try {
        const leaderboard = await getLeaderboard();
        res.json({ success: true, data: leaderboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Serverfehler.' });
    }
};