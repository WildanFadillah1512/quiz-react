import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Stars from '../components/Stars';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register, resendVerification } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isRegister) {
                await register(email, password);
                setSuccess('📧 Email verifikasi telah dikirim! Cek inbox/spam kamu, lalu login.');
                setIsRegister(false);
            } else {
                await login(email, password);
                navigate('/quiz');
            }
        } catch (err) {
            const errorMessages = {
                'auth/user-not-found': 'Akun tidak ditemukan',
                'auth/wrong-password': 'Password salah',
                'auth/email-already-in-use': 'Email sudah terdaftar',
                'auth/weak-password': 'Password minimal 6 karakter',
                'auth/invalid-email': 'Format email tidak valid',
                'auth/invalid-credential': 'Email atau password salah',
                'auth/email-not-verified': 'Email belum diverifikasi. Cek inbox/spam kamu.',
            };
            setError(errorMessages[err.code] || 'Terjadi kesalahan, coba lagi');
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!email || !password) {
            setError('Masukkan email dan password untuk kirim ulang verifikasi');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await resendVerification(email, password);
            setSuccess('📧 Email verifikasi telah dikirim ulang! Cek inbox/spam kamu.');
        } catch (err) {
            setError('Gagal mengirim ulang verifikasi. Pastikan email dan password benar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', minHeight: '100vh' }}>
            <Stars count={60} />

            <div className="animate-slide-in-up" style={{ position: 'relative', zIndex: 20, width: '100%', maxWidth: '420px' }}>
                <div className="glass-card-glow" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                    {/* Glow effect */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '200px',
                        height: '200px',
                        background: 'rgba(6, 182, 212, 0.15)',
                        filter: 'blur(60px)',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }} />

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                        {/* Mascot */}
                        <div className="animate-float" style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>
                            🦊
                        </div>

                        {/* Title */}
                        <h1 className="text-gradient" style={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            fontFamily: 'var(--font-sans)',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(to right, #F472B6, #A855F7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            ANIME QUIZ
                        </h1>

                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                            marginBottom: '2rem',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            ⛩️ Otaku Edition
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="email"
                                placeholder="Email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                required
                                minLength={6}
                            />

                            {/* Error message */}
                            {error && (
                                <div style={{
                                    color: '#FCA5A5',
                                    fontSize: '0.875rem',
                                    padding: '0.75rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                }}>
                                    ⚠️ {error}
                                    {error.includes('belum diverifikasi') && (
                                        <button
                                            type="button"
                                            onClick={handleResendVerification}
                                            disabled={loading}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                marginTop: '0.5rem',
                                                padding: '0.5rem',
                                                background: 'rgba(6, 182, 212, 0.2)',
                                                border: '1px solid rgba(6, 182, 212, 0.4)',
                                                borderRadius: '8px',
                                                color: 'var(--cyan-400)',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            🔄 Kirim Ulang Email Verifikasi
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Success message */}
                            {success && (
                                <div style={{
                                    color: '#86EFAC',
                                    fontSize: '0.875rem',
                                    padding: '0.75rem',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    lineHeight: 1.5,
                                }}>
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading || !email || !password}
                            >
                                {loading ? '⏳ Loading...' : isRegister ? '📝 DAFTAR' : '🚀 MASUK'}
                            </button>

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
                            >
                                {isRegister ? 'Sudah punya akun? LOGIN' : 'Belum punya akun? DAFTAR'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer info */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                }}>
                    POWERED BY FIREBASE AUTH 🔐
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
