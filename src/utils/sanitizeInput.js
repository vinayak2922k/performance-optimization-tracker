/**
 * Sanitizes user input string by stripping dangerous HTML tags, executable scripts,
 * javascript: pseudo-protocols, and inline event handlers to prevent XSS attacks.
 *
 * @param {unknown} input - The raw input to sanitize.
 * @returns {string} The sanitized text string.
 */
export function sanitizeInput(input, options = {}) {
  const { trim = true } = typeof options === 'boolean' ? { trim: options } : options

  // Return empty string for nullish values
  if (input === null || input === undefined) {
    return ''
  }

  // Safely convert primitives to strings; ignore non-primitive objects to prevent exceptions
  let str
  if (typeof input === 'string') {
    str = input
  } else if (typeof input === 'number' || typeof input === 'boolean') {
    str = String(input)
  } else {
    return ''
  }

  let prev

  // 1. Strip <script> and <style> tags along with their inner contents.
  // A loop handles nested or iteratively constructed tags (e.g. <scr<script>ipt>).
  do {
    prev = str
    str = str.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    str = str.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
  } while (str !== prev)

  // 2. Strip any remaining or unclosed script/style opening and closing tags.
  do {
    prev = str
    str = str.replace(/<\/?(?:script|style)\b[^>]*>?/gi, '')
  } while (str !== prev)

  // 3. Neutralize 'javascript:' URI schemes, including spaced or mixed-case evasion attempts.
  do {
    prev = str
    str = str.replace(/j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi, '')
  } while (str !== prev)

  // 4. Strip inline DOM event handlers (e.g. onclick=, onerror=, onload=)
  str = str.replace(/on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]*)/gi, '')

  // 5. Strip all remaining HTML tags (standard, structural, and self-closing tags)
  do {
    prev = str
    str = str.replace(/<[^>]+>/g, '')
  } while (str !== prev)

  // 6. Trim leading/trailing whitespace if requested while keeping internal whitespace intact
  return trim ? str.trim() : str
}

export default sanitizeInput
