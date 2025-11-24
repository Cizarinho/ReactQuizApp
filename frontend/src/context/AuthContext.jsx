import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Context erstellen
export const AuthContext = createContext();

// 2. Provider Komponente erstellen
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Beim Starten der App: Prüfen, ob ein Token da ist
    useEffect(() => {
        if (token) {
            // Token für alle zukünftigen Anfragen setzen
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Benutzer aus localStorage laden (optional, falls wir User-Infos speichern)
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    // Login Funktion
    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    // Logout Funktion
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};