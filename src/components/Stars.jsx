import { useMemo } from 'react';

function Stars({ count = 50 }) {
    const stars = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            opacity: Math.random(),
            animationDelay: `${Math.random() * 5}s`,
        }));
    }, [count]);

    return (
        <div className="stars-container">
            {stars.map(star => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.width,
                        height: star.height,
                        opacity: star.opacity,
                        animationDelay: star.animationDelay,
                    }}
                />
            ))}
        </div>
    );
}

export default Stars;
