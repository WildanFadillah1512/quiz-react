import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard } from '../services/sheetService';
import Stars from '../components/Stars';

function LeaderboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const result = await getLeaderboard();
        setData(result);
        setLoading(false);
    };

    const topThree = data.slice(0, 3);
    const restOfList = data.slice(3);

    const goBack = () => {
        navigate('/home');
    };

    // Podium card component
    const PodiumCard = ({ entry, rank }) => {
        if (!entry) return <div style={{ flex: 1 }} />;

        const styles = {
            1: {
                avatar: 'podium-avatar gold-av',
                rankColor: '#FACC15',
                cardClass: 'podium-card gold',
                scoreStyle: {
                    background: 'rgba(234, 179, 8, 0.2)',
                    border: '1px solid rgba(234, 179, 8, 0.5)',
                    color: '#FDE047',
                    boxShadow: 'inset 0 0 20px rgba(250, 204, 21, 0.1)',
                },
                glowColor: 'rgba(250, 204, 21, 0.3)',
            },
            2: {
                avatar: 'podium-avatar silver-av',
                rankColor: '#D1D5DB',
                cardClass: 'podium-card',
                scoreStyle: {
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#22D3EE',
                },
                glowColor: 'rgba(156, 163, 175, 0.2)',
            },
            3: {
                avatar: 'podium-avatar bronze-av',
                rankColor: '#FB923C',
                cardClass: 'podium-card',
                scoreStyle: {
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#22D3EE',
                },
                glowColor: 'rgba(251, 146, 60, 0.2)',
            },
        };

        const s = styles[rank];
        const initial = (entry.nama || entry.email || '?').charAt(0).toUpperCase();

        return (
            <div style={{
                position: 'relative',
                flex: 1,
                marginTop: rank === 1 ? '-3rem' : '0',
                marginBottom: rank === 1 ? '1rem' : '0',
                zIndex: rank === 1 ? 20 : 10,
            }}>
                {/* Glow */}
                <div style={{
                    position: 'absolute',
                    inset: '-4px',
                    background: `linear-gradient(to bottom, ${s.glowColor}, transparent)`,
                    borderRadius: 'var(--radius-2xl)',
                    filter: 'blur(15px)',
                    pointerEvents: 'none',
                }} />

                {/* Crown for #1 */}
                {rank === 1 && (
                    <div style={{
                        position: 'absolute',
                        top: '-2.5rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '3rem',
                        animation: 'bounceSlow 3s infinite',
                        filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.8))',
                        zIndex: 30,
                    }}>
                        👑
                    </div>
                )}

                <div className={s.cardClass} style={rank === 1 ? { padding: '2rem' } : {}}>
                    <div className={s.avatar}>
                        {initial}
                    </div>
                    <div className="podium-rank" style={{ color: s.rankColor }}>
                        #{rank}
                    </div>
                    <div className="podium-name">
                        {entry.nama || entry.email?.split('@')[0] || 'Unknown'}
                    </div>
                    <div className="podium-score" style={s.scoreStyle}>
                        {entry.score}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-bg" style={{ minHeight: '100vh', overflow: 'auto' }}>
            <Stars count={40} />

            {/* Background effects */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{
                    position: 'absolute',
                    top: '-20%', left: '-20%',
                    width: '60%', height: '60%',
                    background: 'rgba(30, 58, 138, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(150px)',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-20%', right: '-20%',
                    width: '60%', height: '60%',
                    background: 'rgba(88, 28, 135, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(150px)',
                }} />
                {/* Orbital rings */}
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px', height: '800px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                    animation: 'spin 60s linear infinite',
                }} />
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px', height: '600px',
                    border: '1px dashed rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                    animation: 'spin 40s linear infinite reverse',
                }} />
            </div>

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '1.5rem',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Header */}
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="btn-back" onClick={goBack}>
                            <span style={{ fontSize: '1.5rem' }}>←</span>
                        </button>
                        <div>
                            <div style={{
                                fontSize: '0.625rem',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--pink-500)',
                                letterSpacing: '0.4em',
                                textTransform: 'uppercase',
                                marginBottom: '0.25rem',
                                animation: 'pulse-text 2s infinite',
                            }}>
                                Shinobi Rank Database
                            </div>
                            <h1 className="text-gradient" style={{
                                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                                fontWeight: 900,
                                fontStyle: 'italic',
                                textTransform: 'uppercase',
                                letterSpacing: '-0.03em',
                                lineHeight: 1,
                                background: 'linear-gradient(to right, white, #F472B6, #A855F7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Hall of Hokage
                            </h1>
                        </div>
                    </div>

                    <button className="btn-primary" onClick={() => navigate('/quiz')} style={{ width: 'auto', padding: '0.625rem 1.5rem', fontSize: '0.75rem' }}>
                        ⚔️ NEW MISSION
                    </button>
                </header>

                {/* Loading */}
                {loading ? (
                    <div className="spinner-container">
                        <div className="spinner">
                            <div className="ring-ping" style={{ borderColor: 'var(--pink-500)' }} />
                            <div className="ring-spin" style={{ borderTopColor: 'var(--purple-500)' }} />
                        </div>
                        <div className="spinner-text" style={{ color: 'var(--pink-500)' }}>FETCHING SCROLLS...</div>
                    </div>
                ) : data.length === 0 ? (
                    /* Empty state */
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '5rem 0',
                        minHeight: '400px',
                        color: 'rgba(255,255,255,0.3)',
                        border: '2px dashed rgba(255,255,255,0.05)',
                        borderRadius: 'var(--radius-3xl)',
                        background: 'rgba(255,255,255,0.01)',
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🍃</div>
                        <div style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontWeight: 700 }}>
                            NO SHINOBI FOUND
                        </div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                            BE THE FIRST HOKAGE — START MISSION!
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Podium Top 3 */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1rem',
                            alignItems: 'flex-end',
                            marginBottom: '2rem',
                            padding: '3rem 0 1rem',
                        }}>
                            {/* #2 */}
                            <PodiumCard entry={topThree[1]} rank={2} />
                            {/* #1 */}
                            <PodiumCard entry={topThree[0]} rank={1} />
                            {/* #3 */}
                            <PodiumCard entry={topThree[2]} rank={3} />
                        </div>

                        {/* Divider */}
                        <div style={{
                            width: '200px',
                            height: '2px',
                            background: 'linear-gradient(to right, transparent, var(--pink-500), transparent)',
                            margin: '0 auto 2rem',
                        }} />

                        {/* Rest of list */}
                        {restOfList.length > 0 && (
                            <div style={{
                                background: 'rgba(0,0,0,0.4)',
                                backdropFilter: 'blur(20px)',
                                borderTop: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-3xl) var(--radius-3xl) 0 0',
                                padding: '2rem',
                                flex: 1,
                            }}>
                                {/* Accent line */}
                                <div style={{
                                    width: '128px',
                                    height: '2px',
                                    background: 'linear-gradient(to right, transparent, var(--purple-500), transparent)',
                                    margin: '0 auto 1.5rem',
                                }} />

                                <h2 style={{
                                    color: 'rgba(255,255,255,0.3)',
                                    fontSize: '0.75rem',
                                    fontFamily: 'var(--font-mono)',
                                    letterSpacing: '0.3em',
                                    textTransform: 'uppercase',
                                    marginBottom: '1.5rem',
                                    paddingLeft: '1rem',
                                }}>
                                    Genin Ranks // 004-{String(restOfList.length + 3).padStart(3, '0')}
                                </h2>

                                {/* Table header */}
                                <div className="leaderboard-row" style={{
                                    display: 'none',
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '0.5rem 1.5rem',
                                    fontSize: '0.625rem',
                                    color: 'var(--pink-400)',
                                    fontWeight: 900,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                }}>
                                    {/* hidden on mobile, shown on desktop via media query override */}
                                </div>

                                <div className="desktop-header" style={{
                                    display: 'grid',
                                    gridTemplateColumns: '60px 1fr 1fr auto',
                                    gap: '1rem',
                                    padding: '0.5rem 1.5rem',
                                    fontSize: '0.625rem',
                                    color: 'var(--pink-400)',
                                    fontWeight: 900,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    marginBottom: '0.5rem',
                                }}>
                                    <div style={{ textAlign: 'center' }}>Rnk</div>
                                    <div>Shinobi Name</div>
                                    <div>Village / Category</div>
                                    <div style={{ textAlign: 'right' }}>Power Level</div>
                                </div>

                                {/* Rows */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {restOfList.map((item, index) => {
                                        const initial = (item.nama || item.email || '?').charAt(0).toUpperCase();
                                        return (
                                            <div key={index} className="leaderboard-row">
                                                <div style={{ textAlign: 'center' }}>
                                                    <span style={{
                                                        fontFamily: 'var(--font-mono)',
                                                        fontSize: '1.125rem',
                                                        color: 'rgba(255,255,255,0.5)',
                                                        fontWeight: 700,
                                                    }}>
                                                        #{index + 4}
                                                    </span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '6px',
                                                        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.5), rgba(236, 72, 153, 0.5))',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        color: 'white',
                                                        border: '1px solid var(--border-subtle)',
                                                        flexShrink: 0,
                                                    }}>
                                                        {initial}
                                                    </div>
                                                    <span style={{ fontWeight: 700, color: '#E5E7EB' }}>
                                                        {item.nama || item.email?.split('@')[0] || 'Unknown Shinobi'}
                                                    </span>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-muted)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                }}>
                                                    <span style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: 'var(--purple-500)',
                                                        flexShrink: 0,
                                                    }} />
                                                    Konoha (Anime)
                                                </div>

                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{
                                                        fontFamily: 'var(--font-mono)',
                                                        fontWeight: 700,
                                                        color: 'var(--cyan-400)',
                                                        fontSize: '1.125rem',
                                                        letterSpacing: '0.1em',
                                                    }}>
                                                        {item.score}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Footer */}
                <div style={{
                    marginTop: '3rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.2)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '1.5rem',
                    paddingBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                }}>
                    <div>
                        SYSTEM_STATUS: <span style={{ color: 'var(--green-500)' }}>ONLINE</span>
                        <span style={{ margin: '0 0.5rem' }}>|</span>
                        DATA_SOURCE: <span style={{ color: 'var(--pink-500)' }}>SCROLLS</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            background: 'var(--pink-500)',
                            borderRadius: '50%',
                            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                            display: 'inline-block',
                        }} />
                        CHAKRA FLOW: STABLE
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaderboardPage;
