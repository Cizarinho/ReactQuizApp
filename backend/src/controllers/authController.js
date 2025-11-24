import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByUsername, createUser} from '../models/userModel.js';


export const registerUser = async (req,res) => {
    console.log("Daten vom Front:", req.body)
    try 
    {
        const {benutzername, passwort} = req.body;

        const existingUser = await findUserByUsername(benutzername);

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Benutzername ist bereits vergeben.' });
        }

        const saltDelay = 10
        const salt = await bcrypt.genSalt(saltDelay)
        const password_hash = await bcrypt.hash(passwort, salt)

        const newUserId = await createUser(benutzername, password_hash);

        res.status(201).json({ 
            success: true, 
            message: 'Benutzer erfolgreich registriert.',
            userId:  newUserId
        });
    } catch (error) 
    {
        console.error('Registrierungsfehler',error);
        res.status(500).json({ success: false, message: 'Fehler bei der Registrierung.' });
    }
}

export const loginUser = async (req,res) => {
    try {
        const {benutzername, passwort} = req.body;
        
        const user = await findUserByUsername(benutzername);
        if (!user) 
        {
            return res.status(401).json({success:false, message: 'Login fehlgeschlagen'});
        }

        const isMatch = await bcrypt.compare(passwort, user.password_hash);
        if (!isMatch) 
        {
            return res.status(401).json({success: false, message: 'Login fehlgeschlagen'});
        }
        
        const payload = 
        {
            id: user.benutzer_id,
            username: user.benutzername,
            isAdmin: user.is_admin
        }

        const token =jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '1h'})
        res.json({success: true, message: 'Login erfolgreich', token: token, user: payload})
    } catch (error) {
        console.error('Login-Fehler:', error);
        res.status(500).json({ success: false, message: 'Serverfehler beim Login.'})
    }
}