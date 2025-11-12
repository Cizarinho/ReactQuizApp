import { getQuizQuestions } from "../models/questionModel";
import { saveScore, getLeaderboard } from "../models/leaderboardModel";
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