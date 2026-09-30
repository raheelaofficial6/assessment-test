/**
 * Extracts the amount from a price label such as "$29.99" or "Item total: $29.99".
 * @param {string | null} text
 * @returns {number}
 */
function parsePrice(text) {
  const match = text?.match(/\$(\d+(?:\.\d{1,2})?)/);
  if (!match) throw new Error(`Unable to parse price from "${text}"`);
  return Number(match[1]);
}

/**
 * Rounds to cents so money comparisons are free of floating-point noise.
 * @param {number} value
 * @returns {number}
 */
function toCents(value) {
  return Math.round(value * 100);
}

module.exports = { parsePrice, toCents };
