import { Section } from '@/types/clientShellTypes';
import { SECTIONS } from '@/constants/main';

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
 * Type guard that checks if a value is a valid Section.
 *
 * @param {unknown} val - The value to check (accepts any type for more robust validation)
 * @returns {boolean} True if the value is a valid Section, false otherwise
 */
function isSection(val: unknown): val is Section {
  if (typeof val !== 'string') {
    return false;
  }

  return SECTIONS.includes(val as Section);
}

/**
 * Safely converts a value to a Section type if valid, or returns null
 */
function toSectionOrNull(val: unknown): Section | null {
  return isSection(val) ? val : null;
}

/**
 * Clean a cookie by setting it to expire immediately
 * @param name
 */
function cleanCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export { formatTime, isSection, cleanCookie, toSectionOrNull };
