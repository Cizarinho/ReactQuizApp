import pool from '../db.js';

/**
 * Erstellt eine neue Frage in der Datenbank.
 * @param {object} questionData - Die Daten der Frage.
 * @param {string} questionData.frage_text - Der Text der Frage.
 * @param {string} questionData.korrekte_antwort - Die richtige Antwort.
 * @param {string} questionData.falsche_antwort_1 - Falsche Antwort 1.
 * @param {string} questionData.falsche_antwort_2 - Falsche Antwort 2.
 * @param {string} questionData.falsche_antwort_3 - Falsche Antwort 3.

 * @returns {Promise<number>} Die ID der neu erstellten Frage.
 */
export const createQuestion = async (questionData) => {
    const { 
        frage_text, 
        korrekte_antwort, 
        falsche_antwort_1, 
        falsche_antwort_2, 
        falsche_antwort_3 
    } = questionData;

    const [result] = await pool.query(
        'INSERT INTO fragen (frage_text, right_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3) VALUES (?, ?, ?, ?, ?)',
        [frage_text, korrekte_antwort, falsche_antwort_1, falsche_antwort_2, falsche_antwort_3,]
    );
    return result.insertId;
};

/**
 * Ruft alle Fragen aus der Datenbank ab.
 * @returns {Promise<Array>} Ein Array mit allen Fragen-Objekten.
 */
export const getAllQuestions = async () => {
    const [rows] = await pool.query('SELECT * FROM fragen');
    return rows;
};