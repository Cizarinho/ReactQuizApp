import pool from "../db.js";

/**
 * Speichert ein neues Quizergebnis in der Datenbank
 * @param {number} benutzer_id - Die ID des Spielers
 * @param {number} punktestand - Der erreichte Punktestand
 * @returns {Promise<number>} - Die ID des neuen Leaderboard-Eintrag
 */

export const saveScore = async (benutzer_id, punktestand) => {
    const [result] = await pool.query('INSERT INTO leaderboard (benutzer_id, punktestand) VALUES (?, ?)'
        [benutzer_id, punktestand]
    );
    return result.insertId;
};

/**
 * Ruft die Top 20 Punktestände aus der Datenbank ab.
 * @return {Promise<Array>} - Ein Array mit den Leaderboard-Daten.
 */

export const getLeaderboard = async () => {

    const [rows] = await pool.query(
        `SELECT 
            b.benutzername, 
            l.punktestand, 
            l.gespielt_am 
         FROM leaderboard l
         JOIN BENUTZER b ON l.benutzer_id = b.benutzer_id
         ORDER BY l.punktestand DESC
         LIMIT 20`
        );
        return rows
}