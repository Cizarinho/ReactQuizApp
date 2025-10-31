import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../models/userModel.js'; 

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; 

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; 
            next(); 

        } catch (error) {
            console.error('Token-Fehler:', error);
            res.status(401).json({ success: false, message: 'Nicht autorisiert, Token ungültig.' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Nicht autorisiert, kein Token gefunden.' });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Zugriff verweigert, nur für Admins.' });
    }
};