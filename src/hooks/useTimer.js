import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for countdown timer
 * @param {number} initialTime - time in seconds
 * @param {function} onTimeUp - callback when timer reaches 0
 */
export function useTimer(initialTime, onTimeUp) {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const onTimeUpRef = useRef(onTimeUp);

    // Keep callback ref updated
    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);

    // Timer logic
    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    setIsRunning(false);
                    if (onTimeUpRef.current) onTimeUpRef.current();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);
    const reset = useCallback((newTime) => {
        setTimeRemaining(newTime || initialTime);
        setIsRunning(false);
    }, [initialTime]);

    const setTime = useCallback((time) => {
        setTimeRemaining(time);
    }, []);

    // Format MM:SS
    const formatted = `${String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:${String(timeRemaining % 60).padStart(2, '0')}`;

    // Timer status
    const percentage = (timeRemaining / initialTime) * 100;
    const status = percentage > 50 ? 'normal' : percentage > 20 ? 'warning' : 'danger';

    return {
        timeRemaining,
        isRunning,
        formatted,
        percentage,
        status,
        start,
        pause,
        reset,
        setTime,
    };
}
