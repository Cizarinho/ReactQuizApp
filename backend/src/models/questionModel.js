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
        right_answer, 
        wrong_answer_1,
        wrong_answer_2, 
        wrong_answer_3, 
        schwierigkeit
    } = questionData;

    const [result] = await pool.query(
        'INSERT INTO fragen (frage_text, right_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3, schwierigkeit) VALUES (?, ?, ?, ?, ?, ?)',
        [frage_text, right_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3, schwierigkeit]
    );
    return result.insertId;
};
/**
 * Fügt mehrere Fragen auf einmal in die Datenbank ein.
 * @param {Array<object>} questions - Ein Array von Frage-Objekten
 * @returns {promise<number>} - Anzahl der eingefügten Zeilen 
 */

export const createMultipleQuestions = async (questions) => {
    const sql = 'INSERT INTO fragen (frage_text, right_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3, schwierigkeit) VALUES ?'

    const values = questions.map(q => [q.frage_text, q.right_answer, q.wrong_answer_1, q.wrong_answer_2, q.wrong_answer_3, q.schwierigkeit])

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


/**
 * Holt eine zufällige Auswahl von Fragen für ein neues Quiz.
 * (5 easy, 5 medium, 5 hard)
 * @returns {Promise<Array>} - Ein Array mit 15 Fragen.
 */
export const getQuizQuestions = async () => {
    // Diese komplexe Abfrage führt drei separate Abfragen aus (eine pro Schwierigkeit),
    // holt jeweils 5 zufällige Zeilen (ORDER BY RAND()) und fügt sie
    // mit UNION ALL zu einem einzigen Ergebnis zusammen.
    const sql = `
        (SELECT * FROM fragen WHERE schwierigkeit = 'easy' ORDER BY RAND() LIMIT 5)
        UNION ALL
        (SELECT * FROM fragen WHERE schwierigkeit = 'medium' ORDER BY RAND() LIMIT 5)
        UNION ALL
        (SELECT * FROM fragen WHERE schwierigkeit = 'hard' ORDER BY RAND() LIMIT 5)
    `;
    
    const [rows] = await pool.query(sql);
    return rows;
};