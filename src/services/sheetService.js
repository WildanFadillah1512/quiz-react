const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL;

/**
 * Save quiz result to SheetDB
 */
export async function saveResult(data) {
    try {
        const response = await fetch(SHEETDB_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: [data] }),
        });

        if (!response.ok) throw new Error('Failed to save result');

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('SheetDB save error:', error);
        throw error;
    }
}

/**
 * Get all leaderboard data from SheetDB
 */
export async function getLeaderboard() {
    try {
        const response = await fetch(SHEETDB_URL);
        if (!response.ok) throw new Error('Failed to fetch leaderboard');

        const data = await response.json();

        // Sort by score descending
        return data.sort((a, b) => Number(b.score) - Number(a.score));
    } catch (error) {
        console.error('SheetDB fetch error:', error);
        return [];
    }
}

/**
 * Get quiz history for a specific email
 */
export async function getHistory(email) {
    try {
        const response = await fetch(`${SHEETDB_URL}/search?email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error('Failed to fetch history');

        const data = await response.json();
        return data.sort((a, b) => Number(b.score) - Number(a.score));
    } catch (error) {
        console.error('SheetDB history error:', error);
        return [];
    }
}
