import pool from '../db.js';

/**
 * Findet einen Benutzer anhand seines Benutzernamens.
 * @param {string} benutzername - Der Name des zu suchenden Benutzers.
 * @returns {Promise<object | undefined>} Das Benutzerobjekt oder undefined.
 */
export const findUserByUsername = async (benutzername) => {
    const [users] = await pool.query(
        'SELECT * FROM benutzer WHERE benutzername = ?',
        [benutzername]
    );
    // Gibt den ersten Benutzer oder undefined zurück, falls nichts gefunden wurde.
    return users[0];
};

/**
 * Erstellt einen neuen Benutzer in der Datenbank.
 * @param {string} benutzername - Der Benutzername.
 * @param {string} password_hash - Der bereits gehashte Passwort-String.
 * @returns {Promise<number>} Die ID des neu erstellten Benutzers.
 */
export const createUser = async (benutzername, password_hash) => {
    const [result] = await pool.query(
        'INSERT INTO benutzer (benutzername, password_hash) VALUES (?, ?)',
        [benutzername, password_hash]
    );
    return result.insertId;
};