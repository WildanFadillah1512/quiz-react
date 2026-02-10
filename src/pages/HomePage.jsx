import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Stars from '../components/Stars';

function HomePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const username = user?.email?.split('@')[0] || 'Astronaut';

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="space-bg" style={{ minHeight: '100vh', overflow: 'auto' }}>
            <Stars count={60} />

            {/* Ambient glow effects */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', top: '-30%', left: '-10%',
                    width: '50%', height: '50%',
                    background: 'rgba(6, 182, 212, 0.06)',
                    borderRadius: '50%', filter: 'blur(120px)',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-20%', right: '-10%',
                    width: '50%', height: '50%',
                    background: 'rgba(88, 28, 135, 0.08)',
                    borderRadius: '50%', filter: 'blur(120px)',
                }} />
            </div>

            {/* Content */}
            <div style={{
                position: 'relative', zIndex: 10,
                maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem',
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
            }}>

                {/* Navigation */}
                <nav style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '2rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--pink-500), var(--purple-600))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.25rem', fontWeight: 900, color: 'white',
                            border: '2px solid rgba(236, 72, 153, 0.5)',
                            boxShadow: '0 0 15px rgba(236, 72, 153, 0.3)',
                        }}>
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white' }}>
                                {username}
                            </div>
                            <div style={{
                                fontSize: '0.625rem', color: 'var(--pink-400)',
                                fontFamily: 'var(--font-mono)', letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                            }}>
                                Elite Otaku
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.5rem 1.25rem', background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)',
                            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)', transition: 'all 0.2s',
                            letterSpacing: '0.1em',
                        }}
                        onMouseOver={(e) => { e.target.style.background = 'rgba(239,68,68,0.2)'; e.target.style.borderColor = 'rgba(239,68,68,0.4)'; e.target.style.color = '#FCA5A5'; }}
                        onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.color = 'var(--text-muted)'; }}
                    >
                        🚪 LOGOUT
                    </button>
                </nav>

                {/* Hero Section */}
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    padding: '2rem 0',
                }}>
                    {/* Floating mascot */}
                    <div className="animate-float" style={{
                        fontSize: '6rem', marginBottom: '1.5rem',
                        filter: 'drop-shadow(0 0 40px rgba(236, 72, 153, 0.6))',
                    }}>
                        🦊
                    </div>

                    {/* Subtitle */}
                    <div style={{
                        fontSize: '0.625rem', fontFamily: 'var(--font-mono)',
                        color: 'var(--pink-500)', letterSpacing: '0.5em',
                        textTransform: 'uppercase', marginBottom: '0.75rem',
                        animation: 'pulse-text 2s infinite',
                    }}>
                        Otaku HQ // Online
                    </div>

                    {/* Title */}
                    <h1 className="text-gradient" style={{
                        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900,
                        fontStyle: 'italic', letterSpacing: '-0.03em',
                        lineHeight: 1.1, marginBottom: '1rem',
                        textTransform: 'uppercase',
                        background: 'linear-gradient(to right, white, #F472B6, #A855F7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        ANIME QUIZ
                    </h1>

                    <p style={{
                        color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)',
                        fontSize: '0.875rem', maxWidth: '500px', lineHeight: 1.7,
                        marginBottom: '3rem',
                    }}>
                        Uji level wibu kamu di kategori <span style={{ color: 'var(--pink-400)', fontWeight: 700 }}>Anime & Manga</span>!
                        Jawab 10 soal dan buktikan kamu layak masuk Rank S.
                    </p>

                    {/* Action Cards */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.25rem', width: '100%', maxWidth: '700px', marginBottom: '3rem',
                    }}>
                        {/* Start Quiz Card */}
                        <button
                            onClick={() => navigate('/quiz')}
                            className="home-card"
                            style={{
                                cursor: 'pointer', textAlign: 'left', padding: '2rem',
                                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(15, 23, 42, 0.8))',
                                border: '1px solid rgba(236, 72, 153, 0.4)',
                                borderRadius: 'var(--radius-2xl)', position: 'relative',
                                overflow: 'hidden', transition: 'all 0.3s ease',
                                fontFamily: 'var(--font-sans)',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 0 40px rgba(236, 72, 153, 0.3)';
                                e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.7)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.4)';
                            }}
                        >
                            {/* Glow */}
                            <div style={{
                                position: 'absolute', top: '-50%', right: '-50%',
                                width: '200px', height: '200px',
                                background: 'rgba(236, 72, 153, 0.1)', borderRadius: '50%',
                                filter: 'blur(60px)', pointerEvents: 'none',
                            }} />

                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚔️</div>
                                <div style={{
                                    fontSize: '1.25rem', fontWeight: 900, color: 'white',
                                    marginBottom: '0.375rem', letterSpacing: '-0.01em',
                                }}>
                                    Start Mission
                                </div>
                                <div style={{
                                    fontSize: '0.75rem', color: 'var(--text-muted)',
                                    fontFamily: 'var(--font-mono)', lineHeight: 1.5,
                                }}>
                                    10 Soal • Rank Testing
                                </div>
                                <div style={{
                                    marginTop: '1rem', display: 'inline-flex', alignItems: 'center',
                                    gap: '0.5rem', padding: '0.5rem 1rem',
                                    background: 'linear-gradient(to right, var(--pink-500), var(--purple-600))',
                                    borderRadius: 'var(--radius-full)', color: 'white',
                                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                                }}>
                                    IKUZO! →
                                </div>
                            </div>
                        </button>

                        {/* Leaderboard Card */}
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="home-card"
                            style={{
                                cursor: 'pointer', textAlign: 'left', padding: '2rem',
                                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(15, 23, 42, 0.8))',
                                border: '1px solid rgba(34, 211, 238, 0.3)',
                                borderRadius: 'var(--radius-2xl)', position: 'relative',
                                overflow: 'hidden', transition: 'all 0.3s ease',
                                fontFamily: 'var(--font-sans)',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 0 40px rgba(34, 211, 238, 0.3)';
                                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.7)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
                            }}
                        >
                            {/* Glow */}
                            <div style={{
                                position: 'absolute', top: '-50%', right: '-50%',
                                width: '200px', height: '200px',
                                background: 'rgba(34, 211, 238, 0.1)', borderRadius: '50%',
                                filter: 'blur(60px)', pointerEvents: 'none',
                            }} />

                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👑</div>
                                <div style={{
                                    fontSize: '1.25rem', fontWeight: 900, color: 'white',
                                    marginBottom: '0.375rem', letterSpacing: '-0.01em',
                                }}>
                                    Hall of Fame
                                </div>
                                <div style={{
                                    fontSize: '0.75rem', color: 'var(--text-muted)',
                                    fontFamily: 'var(--font-mono)', lineHeight: 1.5,
                                }}>
                                    Ranking para Hokage
                                </div>
                                <div style={{
                                    marginTop: '1rem', display: 'inline-flex', alignItems: 'center',
                                    gap: '0.5rem', padding: '0.5rem 1rem',
                                    background: 'rgba(34, 211, 238, 0.2)',
                                    border: '1px solid rgba(34, 211, 238, 0.5)',
                                    borderRadius: 'var(--radius-full)', color: '#A5F3FC',
                                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                                }}>
                                    VIEW RANKS →
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Info Stats Row */}
                    <div style={{
                        display: 'flex', gap: '2rem', justifyContent: 'center',
                        flexWrap: 'wrap', marginBottom: '2rem',
                    }}>
                        <InfoStat icon="📜" label="Misi" value="10" />
                        <InfoStat icon="⏳" label="Limit" value="2 min" />
                        <InfoStat icon="🎌" label="Genre" value="Anime" />
                        <InfoStat icon="💾" label="Save" value="Auto" />
                    </div>

                    {/* How to play */}
                    <div style={{
                        width: '100%', maxWidth: '700px',
                        background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-2xl)', padding: '2rem',
                    }}>
                        <h3 style={{
                            fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
                            color: 'var(--cyan-500)', letterSpacing: '0.3em',
                            textTransform: 'uppercase', marginBottom: '1.5rem',
                            textAlign: 'center',
                        }}>
                            🔰 Tutorial
                        </h3>

                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1.25rem',
                        }}>
                            <StepCard num="01" title="Start Mission" desc="Tekan tombol Start untuk memulai ujian Chuunin kamu." />
                            <StepCard num="02" title="Pilih Jutsu" desc="Pilih satu jawaban yang paling tepat." />
                            <StepCard num="03" title="Speed Run" desc="Selesaikan sebelum waktu habis untuk skor maksimal." />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '0.625rem', fontFamily: 'var(--font-mono)',
                    color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '1.5rem', paddingBottom: '1rem',
                    flexWrap: 'wrap', gap: '0.5rem',
                }}>
                    <div>
                        PROJECT: <span style={{ color: 'var(--pink-500)' }}>ANIME_QUIZ</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            width: '6px', height: '6px', background: 'var(--green-500)',
                            borderRadius: '50%', display: 'inline-block',
                            boxShadow: '0 0 8px var(--green-500)',
                        }} />
                        LINK START!
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components
function InfoStat({ icon, label, value }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
        }}>
            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
            <span style={{
                fontSize: '1rem', fontWeight: 900, color: 'white',
                fontFamily: 'var(--font-mono)',
            }}>
                {value}
            </span>
            <span style={{
                fontSize: '0.625rem', color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.15em',
            }}>
                {label}
            </span>
        </div>
    );
}

function StepCard({ num, title, desc }) {
    return (
        <div style={{
            display: 'flex', gap: '1rem', alignItems: 'flex-start',
        }}>
            <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                fontWeight: 700, color: 'var(--cyan-400)', flexShrink: 0,
            }}>
                {num}
            </div>
            <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white', marginBottom: '0.25rem' }}>
                    {title}
                </div>
                <div style={{
                    fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5,
                }}>
                    {desc}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
