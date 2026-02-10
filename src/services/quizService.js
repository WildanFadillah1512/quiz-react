/**
 * Decode HTML entities in a string
 */
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

/**
 * Shuffle an array (Fisher-Yates)
 */
function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Transform raw API result into our internal format
 * Handles both "multiple" and "boolean" types automatically
 */
function transformQuestion(raw) {
    const question = decodeHTML(raw.question);
    const correctAnswer = decodeHTML(raw.correct_answer);
    const incorrectAnswers = raw.incorrect_answers.map(a => decodeHTML(a));

    // Combine and shuffle options
    // For boolean, this will result in [True, False] or [False, True]
    const allOptions = shuffleArray([correctAnswer, ...incorrectAnswers]);
    const correctIndex = allOptions.indexOf(correctAnswer);

    return {
        question,
        options: allOptions,
        correctIndex,
        category: decodeHTML(raw.category),
        difficulty: raw.difficulty,
        type: raw.type, // Store type to handle UI layout if needed
    };
}

/**
 * Fetch questions from OpenTDB API
 * No fallback data as per request
 */
export async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=31');
    if (!response.ok) throw new Error('API response not ok');

    const data = await response.json();
    if (data.response_code !== 0 || !data.results || data.results.length === 0) {
        throw new Error('Invalid API response or no results');
    }

    return data.results.map(transformQuestion);
}
