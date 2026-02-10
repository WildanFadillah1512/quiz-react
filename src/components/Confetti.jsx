import { useMemo } from 'react';

const COLORS = ['#22D3EE', '#E879F9', '#FDB813', '#FFFFFF'];

function Confetti({ show }) {
    const pieces = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
            animationDuration: `${1 + Math.random()}s`,
            animationDelay: `${Math.random() * 0.2}s`,
        }));
    }, [show]);

    if (!show) return null;

    return (
        <div className="confetti-container">
            {pieces.map(piece => (
                <div
                    key={piece.id}
                    className="confetti-piece"
                    style={{
                        left: piece.left,
                        backgroundColor: piece.backgroundColor,
                        animationDuration: piece.animationDuration,
                        animationDelay: piece.animationDelay,
                    }}
                />
            ))}
        </div>
    );
}

export default Confetti;
