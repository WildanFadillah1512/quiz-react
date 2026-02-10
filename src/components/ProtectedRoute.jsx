import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="space-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner-container">
                    <div className="spinner">
                        <div className="ring-ping" />
                        <div className="ring-spin" />
                    </div>
                    <div className="spinner-text">AUTHENTICATING...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
