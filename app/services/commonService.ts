import { Step } from '@/types/stepTypes';
import { API_BASE, API_STEPS } from '@/const/api';

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

/**
 * Fetches the configuration for steps from the API.
 * Makes a network request to retrieve the data and returns the parsed result.
 * Throws an error if the fetch operation fails.
 *
 * @return {Promise<Step[]>} A promise that resolves to an array of Step objects.
 */
async function fetchStepsConfig(): Promise<Step[]> {
  const response = await fetch(`${API_BASE}${API_STEPS}`);
  if (!response.ok) {
    throw new Error('Failed to fetch steps config');
  }
  return await response.json();
}

export { formatTime, fetchStepsConfig };
