/**
 * Formats a Big-O complexity string cleanly.
 * If the string already starts with O( / o( and ends with ), it normalizes it to O(...)
 * and removes any accidental nested O(O(...)).
 * If not already wrapped in O(...), safely wraps it in O(...).
 *
 * Examples:
 * - "O(n)" -> "O(n)"
 * - "O(O(n))" -> "O(n)"
 * - "n" -> "O(n)"
 * - "O(1)" -> "O(1)"
 * - "1" -> "O(1)"
 * - "O(m*n)" -> "O(m*n)"
 * - "o(n)" -> "O(n)"
 * - "" / undefined -> ""
 */
export function formatComplexity(comp?: string | null): string {
  if (!comp) return '';
  const trimmed = comp.trim();
  if (!trimmed) return '';

  // If already starts with O( or o( and ends with )
  if (/^[oO]\(.*\)$/.test(trimmed)) {
    let clean = trimmed;
    // Strip accidental redundant outer O(...) layers e.g. O(O(n)) -> O(n)
    while (/^[oO]\s*\(\s*([oO]\s*\(.*\))\s*\)$/.test(clean)) {
      clean = clean.replace(/^[oO]\s*\(\s*([oO]\s*\(.*\))\s*\)$/, (_match, inner) => inner);
    }
    // Ensure uppercase O
    if (clean.startsWith('o(')) {
      clean = 'O(' + clean.slice(2);
    }
    return clean;
  }

  // If raw inner expression like "n", "1", "m*n", "log n", wrap in O(...)
  return `O(${trimmed})`;
}
