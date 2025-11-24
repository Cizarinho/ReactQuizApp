import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';

// Seiten importieren
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import MenuPage from './pages/MenuPage'

function App() {
  const { user, logout } = useContext(AuthContext); // User und Logout holen

  return (
    <Router>
      <div className="app-container">
        <nav style={{ padding: '15px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div className="nav-links">
            <Link to="/quiz" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Quiz</Link>
            <Link to="/leaderboard" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Leaderboard</Link>
            {/* Admin Link nur zeigen, wenn User ein Admin ist */}
            {user && user.isAdmin === 1 && (
               <Link to="/admin" style={{ color: '#ff4444', marginRight: '15px', textDecoration: 'none', fontWeight: 'bold' }}>Admin</Link>
            )}
          </div>

          <div className="user-info">
            {user ? (
              <>
                <span style={{ marginRight: '10px' }}>Hallo, {user.username}</span>
                <button onClick={logout} style={{ background: '#555', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* Wir schützen die Routen später noch besser, aber das reicht für den Anfang */}
          <Route path="/menu" element={user ? <MenuPage /> : <Navigate to="/" />} />
          <Route path="/quiz" element={user ? <QuizPage /> : <Navigate to="/" />} />
          <Route path="/leaderboard" element={user ? <LeaderboardPage /> : <Navigate to="/" />} />
          <Route path="/admin" element={user && user.isAdmin === 1 ? <AdminPage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;