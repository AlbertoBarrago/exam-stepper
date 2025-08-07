const SECTION_LIMITS = {
  reading: 20 * 60,
  listening: 20 * 60,
  writing: 35 * 60,
  speaking: 15 * 60,
};

const TOTAL_LIMIT = Object.values(SECTION_LIMITS).reduce((a, b) => a + b, 0);

export { SECTION_LIMITS, TOTAL_LIMIT };
