export const SECTION_LIMITS = {
    reading: 10 * 60,    // 10 minutes, in seconds
    listening: 10 * 60,  // 10 minutes
    writing: 15 * 60,    // 15 minutes
    speaking: 15 * 60    // 15 minutes
};

export const TOTAL_LIMIT = Object.values(SECTION_LIMITS).reduce((a, b) => a + b, 0);