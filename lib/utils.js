/**
 * Merge class names (lightweight clsx alternative)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Slugify a string for use in URLs
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Format a number with Indian number system (e.g. 1,23,456)
 */
export function formatINR(num) {
  return Number(num).toLocaleString('en-IN');
}

/**
 * Calculate discount percentage
 */
export function discountPct(price, originalPrice) {
  const p = parseFloat(String(price).replace(/[₹,]/g, ''));
  const o = parseFloat(String(originalPrice).replace(/[₹,]/g, ''));
  if (!p || !o || o <= p) return null;
  return Math.round((1 - p / o) * 100);
}

/**
 * Truncate text to a given length
 */
export function truncate(str, len = 80) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len).trim() + '…' : str;
}

/**
 * Format a Firestore Timestamp or Date for display
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
