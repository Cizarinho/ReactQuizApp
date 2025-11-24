import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {
    // --- STATE VARIABLEN (Das Gedächtnis der Komponente) ---
    const [questions, setQuestions] = useState([]);        // Die geladenen Fragen
    const [currentIndex, setCurrentIndex] = useState(0);   // Wo sind wir gerade? (0 bis 14)
    const [userAnswers, setUserAnswers] = useState([]);    // Was hat der User ausgewählt?
    const [score, setScore] = useState(null);              // Das Endergebnis
    const [loading, setLoading] = useState(true);          // Lädt es gerade?
    const [error, setError] = useState(null);              // Gab es Fehler?

    const { token } = useContext(AuthContext); // Wir brauchen das Token für die API
    const navigate = useNavigate();

    // 1. BEIM LADEN: Quiz starten und Fragen holen
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/quiz/start');
                setQuestions(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Fehler beim Laden:", err);
                setError("Konnte Fragen nicht laden.");
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    // 2. FUNKTION: Wenn eine Antwort angeklickt wird
    const handleAnswerClick = (selectedAnswer) => {
        const currentQuestion = questions[currentIndex];

        // Antwort speichern
        const newAnswer = {
            frage_id: currentQuestion.frage_id,
            antwort: selectedAnswer
        };
        
        // Zum Array der Antworten hinzufügen
        const updatedAnswers = [...userAnswers, newAnswer];
        setUserAnswers(updatedAnswers);

        // Nächste Frage oder Auswertung?
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Wir sind am Ende -> Quiz abschicken!
            submitQuiz(updatedAnswers);
        }
    };

    // 3. FUNKTION: Quiz an den Server senden
    const submitQuiz = async (finalAnswers) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/quiz/submit', {
                answers: finalAnswers
            });
            setScore(res.data.score); // Den Score vom Server anzeigen
        } catch (err) {
            console.error("Fehler beim Senden:", err);
            setError("Konnte Ergebnis nicht speichern.");
        }
        setLoading(false);
    };

    // --- RENDER TEIL (Was sieht der User?) ---

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Lade Quiz...</div>;
    if (error) return <div style={{color: 'red', textAlign: 'center', marginTop: '50px'}}>{error}</div>;

    // A) Wenn das Spiel vorbei ist (Score ist da)
    if (score !== null) {
        return (
            <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
                <h2>Quiz Beendet!</h2>
                <h1>Dein Punktestand: {score}</h1>
                <p>Gut gemacht!</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <button onClick={() => window.location.reload()} style={buttonStyle}>Neues Spiel</button>
                    {/* NEUER BUTTON: */}
                    <button onClick={() => navigate('/menu')} style={secondaryButtonStyle}>Hauptmenü</button>
                </div>
            </div>
        );
    }

    // B) Wenn das Spiel noch läuft (Frage anzeigen)
    const currentQuestion = questions[currentIndex];
    
    // Kleiner Helfer für die Farbe der Schwierigkeit
    const difficultyColor = {
        easy: 'green',
        medium: 'orange',
        hard: 'red'
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
            {/* Fortschrittsanzeige */}
            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                <span>Frage {currentIndex + 1} von {questions.length}</span>
                <span style={{ fontWeight: 'bold', color: difficultyColor[currentQuestion.schwierigkeit] }}>
                    {currentQuestion.schwierigkeit.toUpperCase()}
                </span>
            </div>

            {/* Fragekarte */}
            <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '30px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '20px' }}>{currentQuestion.frage_text}</h3>

                <div style={{ display: 'grid', gap: '10px' }}>
                    {currentQuestion.answers.map((answer, index) => (
                        <button 
                            key={index} 
                            onClick={() => handleAnswerClick(answer)}
                            style={answerButtonStyle}
                        >
                            {answer}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- STYLES (Einfache CSS-Styles direkt im JS) ---
const buttonStyle = {
    padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
};

const secondaryButtonStyle = {
    padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
};

const answerButtonStyle = {
    padding: '15px', 
    backgroundColor: '#f9f9f9', 
    border: '1px solid #ddd', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    fontSize: '16px', 
    textAlign: 'left',
    transition: 'background 0.2s'
};

export default QuizPage;