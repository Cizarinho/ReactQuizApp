import { createQuestion, getAllQuestions, createMultipleQuestions } from "../models/questionModel";
import axios from axios;

export const addNewQuestion = async (req, res) => {
    try {
        const newQuestionId = await createQuestion(req.body)
        res.status(201).json({success: true, message: 'Frage erfolgreich erstellt', questionId: newQuestionId})

    } catch (error) {
        console.error('Fehler beim Erstellen der Frage:',error);
        res.status(500).json({success: false, message: 'Serverfehler.'});
    }
};

export const fetchAllQuestions = async (req,res) => {
    try {
        const questions = await getAllQuestions();
        const shuffledQuestions = questions.map(q => {
            const answers = [q.korrekte_antwort, q.falsche_antwort_1, q.falsche_antwort_2, q.falsche_antwort_3 ];

            for (let i = answers.length-1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answers[i], answers[j]] = [answers[j], answers[i]]
            }
            return {
                frage_id: q.frage_id,
                frage_text: q.frage_text,
                answers: answers
            };
        });
        res,json({success: true, data: shuffledQuestions})

    } catch (error) {
        console.error('Fragen konnten nicht abgerufen werden', error);
        res.status(500).json({success: false, message: 'Serverfehler'});

    }
}

export const importApiQuestions = async (req,res) => {
    try {
        const amount = req.body.amount || 10;
        const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}&type=multiple`);
        if (response.data.response_code !== 0) {
            return res.status(500).json({success: false, message: 'Fehler beim Abrufen der Fragen'});
        }

        const apiQuestions = response.data.results

    } catch {

    }
};