import { Section } from '@/types/clientShellTypes';
import { SECTIONS } from '@/constants/clientShellConst';

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
 * Checks if the provided value is a valid section.
 *
 * @param {string | null} val - The value to be checked.
 * @return {boolean} Returns true if the value is a valid section, otherwise false.
 */
function isSection(val: string | null): val is Section {
  return !!val && SECTIONS.includes(val as Section);
}

/**
 * Clean a cookie by setting it to expire immediately
 * @param name
 */
function cleanCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export { formatTime, isSection, cleanCookie };
