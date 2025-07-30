/**
 * Converts a time duration from seconds into a string formatted as minutes and seconds (MM:SS).
 *
 * @param {number} secs - The time duration in seconds to be formatted.
 * @return {string} A string representing the formatted time in MM:SS format.
 */
function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export { formatTime };
