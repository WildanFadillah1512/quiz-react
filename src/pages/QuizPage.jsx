import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../hooks/useQuiz';
import Stars from '../components/Stars';
import Confetti from '../components/Confetti';

function QuizPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const quiz = useQuiz(user);

    // Auto-start quiz when navigating to this page (if idle and no resume dialog)
    useEffect(() => {
        if (quiz.gameState === 'idle' && !quiz.showResumeDialog && !quiz.hasResumeData) {
            quiz.loadNewQuiz();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quiz.gameState, quiz.showResumeDialog, quiz.hasResumeData]);

    const goHome = () => {
        navigate('/home');
    };

    const getOptionClass = (index) => {
        if (!quiz.isAnswered) return '';
        if (quiz.currentQuestion && index === quiz.currentQuestion.correctIndex) return 'correct';
        if (quiz.selectedOption === index) return 'wrong';
        return 'dimmed';
    };

    // Loading / idle state (before quiz starts)
    if (quiz.gameState === 'loading' || (quiz.gameState === 'idle' && !quiz.showResumeDialog)) {
        return (
            <div className="space-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Stars count={50} />
                <div className="spinner-container" style={{ position: 'relative', zIndex: 20 }}>
                    <div className="spinner">
                        <div className="ring-ping" />
                        <div className="ring-spin" />
                    </div>
                    <div className="spinner-text" style={{ color: 'var(--pink-500)' }}>OPENING GATE...</div>
                </div>
            </div>
        );
    }

    // Finished state
    if (quiz.gameState === 'finished') {
        const correctCount = quiz.correctCount || (quiz.score / 10);
        const totalQuestions = quiz.totalQuestions || 10;
        const accuracy = Math.round((correctCount / totalQuestions) * 100);

        let rank = 'D';
        let rankColor = 'var(--text-muted)';
        let rankTitle = 'ACADEMY STUDENT';

        if (accuracy === 100) {
            rank = 'S'; rankColor = 'var(--yellow-400)'; rankTitle = 'HOKAGE';
        } else if (accuracy >= 80) {
            rank = 'A'; rankColor = 'var(--pink-500)'; rankTitle = 'JONIN';
        } else if (accuracy >= 60) {
            rank = 'B'; rankColor = 'var(--cyan-400)'; rankTitle = 'CHUNIN';
        } else if (accuracy >= 40) {
            rank = 'C'; rankColor = 'var(--green-500)'; rankTitle = 'GENIN';
        }

        return (
            <div className="space-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem' }}>
                <Stars count={50} />
                <Confetti show={quiz.percentage >= 60} />

                <div className="animate-slide-in-up" style={{ position: 'relative', zIndex: 20, width: '100%', maxWidth: '560px' }}>
                    <div className="result-card">
                        <div className="glow" />

                        {/* Emoji & Score */}
                        <div style={{ marginBottom: '1.5rem', position: 'relative', display: 'inline-block', zIndex: 10 }}>
                            <div className="animate-bounce-slow" style={{ fontSize: '6rem' }}>
                                {quiz.resultEmoji}
                            </div>
                            <div style={{
                                position: 'absolute',
                                bottom: '-8px',
                                right: '-16px',
                                background: 'var(--yellow-500)',
                                color: 'black',
                                fontWeight: 900,
                                padding: '0.25rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-sans)',
                                boxShadow: '0 4px 12px rgba(234, 179, 8, 0.4)',
                                transform: 'rotate(12deg)',
                                border: '1px solid #FDE047',
                            }}>
                                {quiz.percentage} / 100
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-gradient" style={{
                            fontSize: '2.5rem',
                            fontWeight: 900,
                            fontFamily: 'var(--font-sans)',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em',
                            position: 'relative',
                            zIndex: 10,
                            background: 'linear-gradient(to right, #F472B6, #A855F7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            MISSION COMPLETE
                        </h2>

                        {/* Subtitle */}
                        <div style={{
                            fontSize: '0.875rem', fontFamily: 'var(--font-mono)',
                            color: 'var(--text-muted)', marginBottom: '2rem',
                            letterSpacing: '0.1em',
                            position: 'relative',
                            zIndex: 10,
                        }}>
                            RANK ASSESSMENT
                        </div>

                        {/* Rank Box */}
                        <div style={{
                            background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-2xl)',
                            padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-subtle)',
                            backdropFilter: 'blur(10px)',
                            position: 'relative',
                            zIndex: 10,
                        }}>
                            <div style={{ fontSize: '5rem', fontWeight: 900, color: rankColor, lineHeight: 1, textShadow: `0 0 30px ${rankColor}40` }}>
                                {rank}
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>
                                {rankTitle}
                            </div>

                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem',
                                borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem'
                            }}>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{quiz.score}</div>
                                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Poin</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--green-500)' }}>{correctCount}</div>
                                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Benar</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--red-500)' }}>{totalQuestions - correctCount}</div>
                                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Salah</div>
                                </div>
                            </div>
                        </div>

                        {/* Submit status */}
                        <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 10 }}>
                            {quiz.isSubmitting ? (
                                <div style={{ color: 'var(--yellow-400)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span className="animate-spin">⏳</span> Mengirim Data...
                                </div>
                            ) : (
                                <div style={{ color: 'var(--green-500)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    ✅ Data Tersimpan
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 50 }}>
                            <button className="btn-primary" onClick={quiz.restartQuiz}>
                                ⚔️ RETRY MISSION
                            </button>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="btn-secondary" onClick={() => navigate('/leaderboard')} style={{ flex: 1 }}>
                                    🏆 HALL OF FAME
                                </button>
                                <button className="btn-secondary" onClick={goHome} style={{ flex: 1 }}>
                                    🏠 HOME BASE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Playing state
    return (
        <div className="space-bg" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem 1rem 2rem',
            minHeight: '100vh',
        }}>
            <Stars count={50} />
            <Confetti show={quiz.showConfetti} />

            {/* Resume Dialog */}
            {quiz.showResumeDialog && (
                <div className="resume-overlay">
                    <div className="resume-dialog">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>
                            Kuis Belum Selesai
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            Ditemukan kuis yang belum selesai. Mau lanjutkan?
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button className="btn-primary" onClick={quiz.resumeQuiz}>
                                ▶️ LANJUTKAN
                            </button>
                            <button className="btn-secondary" onClick={quiz.startFresh}>
                                🔄 MULAI BARU
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '800px',
                zIndex: 10,
            }}>
                {/* Header: Back + Score */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    padding: '0 0.25rem',
                    position: 'relative',
                    zIndex: 50,
                }}>
                    <button className="btn-back" onClick={goHome} title="Back to Home">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="score-badge">
                        <span className="label">SCORE</span>
                        <span className="value">{quiz.percentage}%</span>
                    </div>
                </div>

                {/* Mascot emoji — above the card */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 30,
                    marginBottom: '-2.5rem',
                }}>
                    <div className="animate-float" style={{
                        fontSize: '4.5rem',
                        filter: 'drop-shadow(0 0 30px rgba(6, 182, 212, 0.6))',
                        userSelect: 'none',
                    }}>
                        {quiz.mascotEmoji}
                    </div>
                </div>

                {/* Question Card */}
                <div className="glass-card" style={{
                    padding: '4rem 2rem 2.5rem',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-3xl)',
                }}>
                    {/* Speaker icon top-right */}
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        color: 'rgba(6, 182, 212, 0.4)',
                        fontSize: '1.25rem',
                    }}>
                        🔊
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                        fontWeight: 700,
                        lineHeight: 1.7,
                        fontFamily: 'var(--font-sans)',
                        position: 'relative',
                        zIndex: 10,
                        maxWidth: '600px',
                    }}>
                        {quiz.currentQuestion?.question}
                    </h2>

                    {/* Progress bar at bottom of card */}
                    <div className="progress-bar" style={{
                        width: `${((quiz.currentIndex + 1) / quiz.totalQuestions) * 100}%`,
                    }} />
                </div>

                {/* Question number badge — between card and options */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '-32px',
                    marginBottom: '8px',
                    position: 'relative',
                    zIndex: 40,
                }}>
                    <div className="question-number">
                        <span>{quiz.currentIndex + 1}</span>
                    </div>
                </div>

                {/* Timer bar + info */}
                <div style={{ padding: '0.5rem 0', marginBottom: '0.75rem' }}>
                    <div className="timer-bar-container">
                        <div
                            className={`timer-bar ${quiz.timer.status}`}
                            style={{ width: `${quiz.timer.percentage}%` }}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.375rem',
                    }}>
                        <span className={`timer-text ${quiz.timer.status}`}>
                            ⏱️ {quiz.timer.formatted}
                        </span>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            Soal {quiz.currentIndex + 1} dari {quiz.totalQuestions}
                        </span>
                    </div>
                </div>

                {/* Options Grid — 2 columns × 2 rows */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.875rem',
                    position: 'relative',
                    zIndex: 50,
                }}>
                    {quiz.currentQuestion?.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-btn ${getOptionClass(index)}`}
                            onClick={() => quiz.handleAnswer(index)}
                            disabled={quiz.isAnswered}
                        >
                            <div className="option-label">
                                {['A', 'B', 'C', 'D'][index]}
                            </div>
                            <span className="option-text">{option}</span>
                            {quiz.isAnswered && index === quiz.currentQuestion.correctIndex && (
                                <span className="option-icon">✅</span>
                            )}
                            {quiz.isAnswered && quiz.selectedOption === index && index !== quiz.currentQuestion.correctIndex && (
                                <span className="option-icon">❌</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuizPage;
