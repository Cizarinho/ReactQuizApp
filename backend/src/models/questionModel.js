import pool from '../db.js';

/**
* Erstellt eine neue Frage in der Datenbank.
* @param {object} questionData - Die Daten der Frage.
* @param {string} questionData.frage_text - Der Text der Frage.
* @param {string} questionData.korrekte_antwort - Die richtige Antwort.
* @param {string} questionData.falsche_antwort_1 - Falsche Antwort 1.
* @param {string} questionData.falsche_antwort_2 - Falsche Antwort 2.
* @param {string} questionData.falsche_antwort_3 - Falsche Antwort 3.
* @param {enum}   questionData.schwierigkeit - Schwierigkeitsgrad der Frage
* @returns {Promise<number>} Die ID der neu erstellten Frage.
*/

export const createQuestion = async (questionData) => {
    const { 
        frage_text, 
        korrekte_antwort, 
        falsche_antwort_1, 
        falsche_antwort_2, 
        falsche_antwort_3 ,
        schwierigkeit
    } = questionData;

    const [result] = await pool.query(
        'INSERT INTO fragen (frage_text, right_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3, schwierigkeit) VALUES (?, ?, ?, ?, ?, ?)',
        [frage_text, korrekte_antwort, falsche_antwort_1, falsche_antwort_2, falsche_antwort_3, schwierigkeit]
    );
    return result.insertId;
};
/**
 * Fügt mehrere Fragen auf einmal in die Datenbank ein.
 * @param {Array<object>} questions - Ein Array von Frage-Objekten
 * @returns {promise<number>} - Anzahl der eingefügten Zeilen 
 */

export const createMultipleQuestions = async (questions) => {
    const sql = "INSERT INTO fragen(frage_text, right answer, wrong answer_1, wrong_answer_2, wrong_answer_3, schwierigkeit) VALUES (?, ?, ?, ?, ?, ?)"

    const values = questions.map(q => [q.frage_text, q.korrekte_antwort, q.falsche_antwort_1, q.falsche_antwort_2, q.falsche_antwort_3, q.schwierigkeit])

    const [result] = await pool.query(sql, [values]);

    return result.affectedRows
};
/**
* Ruft alle Fragen aus der Datenbank ab.
* @returns {Promise<Array>} Ein Array mit allen Fragen-Objekten.
*/
export const getAllQuestions = async () => {
    const [rows] = await pool.query('SELECT * FROM fragen');
    return rows;
};