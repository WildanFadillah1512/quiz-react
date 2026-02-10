import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="space-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div className="spinner-container">
                    <div className="spinner">
                        <div className="ring-ping" />
                        <div className="ring-spin" />
                    </div>
                    <div className="spinner-text">INITIALIZING...</div>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
            <Route path="/home" element={
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
            } />
            <Route path="/quiz" element={
                <ProtectedRoute>
                    <QuizPage />
                </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
                <ProtectedRoute>
                    <LeaderboardPage />
                </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
