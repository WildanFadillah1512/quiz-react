import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchQuestions } from '../services/quizService';
import { saveResult } from '../services/sheetService';
import { useTimer } from './useTimer';

const STORAGE_KEY = 'quiz_state';
const QUIZ_DURATION = 120; // 2 minutes

/**
 * Custom hook for all quiz logic
 */
export function useQuiz(user) {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [gameState, setGameState] = useState('idle'); // idle, loading, playing, finished
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitDone, setSubmitDone] = useState(false);
    const [hasResumeData, setHasResumeData] = useState(false);
    const [showResumeDialog, setShowResumeDialog] = useState(false);
    const [error, setError] = useState(null);

    const advanceTimeoutRef = useRef(null);
    const isFinishingRef = useRef(false);

    // Use refs for values needed inside finishQuiz to avoid stale closures
    const scoreRef = useRef(score);
    const answersRef = useRef(answers);
    const questionsRef = useRef(questions);
    const userRef = useRef(user);

    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { answersRef.current = answers; }, [answers]);
    useEffect(() => { questionsRef.current = questions; }, [questions]);
    useEffect(() => { userRef.current = user; }, [user]);

    // Stable finishQuiz using refs — no re-render dependency issues
    const finishQuiz = useCallback(() => {
        if (isFinishingRef.current) return;
        isFinishingRef.current = true;

        timer.pause();
        setGameState('finished');
        setIsAnswered(false);
        localStorage.removeItem(STORAGE_KEY);

        const currentScore = scoreRef.current;
        const currentQuestions = questionsRef.current;
        const currentUser = userRef.current;
        const currentAnswers = answersRef.current;
        const totalAnswered = currentAnswers.length;

        // Save to SheetDB
        setIsSubmitting(true);
        saveResult({
            email: currentUser?.email || 'anonymous',
            nama: currentUser?.email?.split('@')[0] || 'anonymous',
            score: currentQuestions.length > 0
                ? Math.round((currentScore / currentQuestions.length) * 100)
                : 0,
            total_soal: currentQuestions.length,
            benar: currentScore,
            salah: totalAnswered - currentScore,
            waktu_selesai: `${QUIZ_DURATION - timer.timeRemaining}s`,
            tanggal: new Date().toLocaleString('id-ID'),
        })
            .then(() => setSubmitDone(true))
            .catch((e) => {
                console.error('Save failed:', e);
                setSubmitDone(true);
            })
            .finally(() => setIsSubmitting(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Timer — handleTimeUp is stable because finishQuiz is stable
    const handleTimeUp = useCallback(() => {
        if (advanceTimeoutRef.current) {
            clearTimeout(advanceTimeoutRef.current);
        }
        finishQuiz();
    }, [finishQuiz]);

    const timer = useTimer(QUIZ_DURATION, handleTimeUp);

    // Check for resume data on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.userEmail === user?.email && data.questions && data.questions.length > 0) {
                    setHasResumeData(true);
                    setShowResumeDialog(true);
                    setGameState('idle');
                    return;
                }
            } catch (e) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        // Don't auto-load — wait for user to click start from homepage
        setGameState('idle');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Save state to localStorage on changes (only when playing)
    useEffect(() => {
        if (gameState === 'playing' && questions.length > 0 && !isAnswered) {
            const stateToSave = {
                questions,
                currentIndex,
                score,
                answers,
                timeRemaining: timer.timeRemaining,
                userEmail: user?.email,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        }
    }, [currentIndex, score, gameState, isAnswered, questions, answers, timer.timeRemaining, user?.email]);

    const loadNewQuiz = async () => {
        setGameState('loading');
        setError(null);
        isFinishingRef.current = false;
        try {
            const qs = await fetchQuestions();
            setQuestions(qs);
            setCurrentIndex(0);
            setScore(0);
            setAnswers([]);
            setIsAnswered(false);
            setSelectedOption(null);
            setGameState('playing');
            timer.reset(QUIZ_DURATION);
            timer.start();
        } catch (err) {
            setError('Gagal memuat soal kuis');
            setGameState('idle');
            console.error(err);
        }
    };

    const resumeQuiz = () => {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            isFinishingRef.current = false;
            setQuestions(data.questions);
            setCurrentIndex(data.currentIndex);
            setScore(data.score);
            setAnswers(data.answers || []);
            setIsAnswered(false);
            setSelectedOption(null);
            timer.setTime(data.timeRemaining);
            setGameState('playing');
            timer.start();
            setShowResumeDialog(false);
        } catch (e) {
            console.error('Resume failed:', e);
            localStorage.removeItem(STORAGE_KEY);
            loadNewQuiz();
        }
    };

    const startFresh = () => {
        localStorage.removeItem(STORAGE_KEY);
        setShowResumeDialog(false);
        setHasResumeData(false);
        loadNewQuiz();
    };

    const handleAnswer = (optionIndex) => {
        if (isAnswered || gameState !== 'playing') return;

        const currentQuestion = questions[currentIndex];
        const correct = optionIndex === currentQuestion.correctIndex;

        setSelectedOption(optionIndex);
        setIsAnswered(true);
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
            triggerConfetti();
        } else {
            try { if (navigator.vibrate) navigator.vibrate(200); } catch (e) { }
        }

        const newAnswer = {
            questionIndex: currentIndex,
            selected: optionIndex,
            correct: currentQuestion.correctIndex,
            isCorrect: correct,
        };
        setAnswers(prev => [...prev, newAnswer]);

        // Auto-advance after delay
        advanceTimeoutRef.current = setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setIsAnswered(false);
                setSelectedOption(null);
                setIsCorrect(false);
            } else {
                finishQuiz();
            }
        }, 1200);
    };

    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
    };

    const restartQuiz = () => {
        setSubmitDone(false);
        setIsSubmitting(false);
        loadNewQuiz();
    };

    // Computed
    const currentQuestion = questions[currentIndex] || null;
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const totalAnswered = answers.length;
    const correctCount = answers.filter(a => a.isCorrect).length;
    const wrongCount = answers.filter(a => !a.isCorrect).length;

    const mascotEmoji = isAnswered ? (isCorrect ? '🤩' : '😵') : '🤔';
    const resultEmoji = percentage === 100 ? '👑' : percentage >= 60 ? '🌌' : '☄️';
    const resultTitle = percentage === 100 ? 'SEMPURNA!' : percentage >= 60 ? 'MISI SUKSES!' : 'COBA LAGI!';

    // Cleanup
    useEffect(() => {
        return () => {
            if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
        };
    }, []);

    return {
        questions, currentQuestion, currentIndex, score, answers,
        gameState, isAnswered, selectedOption, isCorrect,
        showConfetti, isSubmitting, submitDone,
        hasResumeData, showResumeDialog, error,
        timer,
        totalQuestions, percentage, totalAnswered,
        correctCount, wrongCount,
        mascotEmoji, resultEmoji, resultTitle,
        handleAnswer, restartQuiz, resumeQuiz, startFresh, loadNewQuiz,
    };
}
