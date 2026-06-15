/**
 * Deep equality comparison that is key-order independent.
 * Compares two values recursively, handling primitives, arrays, and objects.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns true if values are deeply equal, false otherwise
 *
 * @example
 * deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }) // true
 * deepEqual([1, 2, 3], [1, 2, 3]) // true
 * deepEqual({ a: { b: 1 } }, { a: { b: 2 } }) // false
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  // Same reference or primitive equality
  if (a === b) return true;

  // Type mismatch
  if (typeof a !== typeof b) return false;

  // Handle null
  if (a === null || b === null) return a === b;

  // Not an object (primitive that didn't match above)
  if (typeof a !== 'object') return a === b;

  // Array comparison
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    return a.every((item, index) => deepEqual(item, b[index]));
  }

  // One is array, other is not
  if (Array.isArray(a) || Array.isArray(b)) return false;

  // Object comparison (key-order independent)
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((key) => key in bObj && deepEqual(aObj[key], bObj[key]));
}
