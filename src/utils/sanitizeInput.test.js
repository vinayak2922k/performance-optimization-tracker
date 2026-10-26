import { describe, it, expect } from 'vitest'
import { sanitizeInput } from './sanitizeInput'

describe('sanitizeInput', () => {
  describe('whitespace trimming', () => {
    it('trims leading and trailing spaces', () => {
      expect(sanitizeInput('   hello world   ')).toBe('hello world')
    })

    it('trims tabs, newlines, and carriage returns', () => {
      expect(sanitizeInput('\n\t  performance metrics  \r\n')).toBe('performance metrics')
    })

    it('preserves valid internal whitespace', () => {
      expect(sanitizeInput('cpu   usage')).toBe('cpu   usage')
    })

    it('returns an empty string when given only whitespace', () => {
      expect(sanitizeInput('     \t\n  ')).toBe('')
    })
  })

  describe('stripping/escaping <script> tags', () => {
    it('neutralizes basic script tags and contents', () => {
      const input = '<script>alert("xss")</script>'
      const result = sanitizeInput(input)
      expect(result).not.toMatch(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi)
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('</script>')
    })

    it('neutralizes script tags with attributes and external sources', () => {
      const input = '<script src="https://evil.example.com/payload.js"></script>'
      const result = sanitizeInput(input)
      expect(result).not.toContain('<script')
      expect(result).not.toContain('evil.example.com')
    })

    it('neutralizes uppercase and mixed-case script tags', () => {
      const input = '<SCRIPT>alert(1)</SCRIPT>'
      const result = sanitizeInput(input)
      expect(result.toLowerCase()).not.toContain('<script>')
      expect(result.toLowerCase()).not.toContain('</script>')
    })

    it('handles nested or malformed script tags', () => {
      const input = '<scr<script>ipt>alert(1)</script>'
      const result = sanitizeInput(input)
      expect(result.toLowerCase()).not.toContain('<script')
      expect(result.toLowerCase()).not.toContain('</script>')
    })
  })

  describe('stripping/escaping HTML tags', () => {
    it('removes or escapes standard HTML formatting tags', () => {
      const input = '<b>Bold</b> and <i>Italic</i>'
      const result = sanitizeInput(input)
      expect(result).not.toMatch(/<[bi]>/i)
      expect(result).not.toMatch(/<\/[bi]>/i)
    })

    it('neutralizes structural tags like <div>, <p>, and <span>', () => {
      const input = '<div class="content"><p>Sample text</p></div>'
      const result = sanitizeInput(input)
      expect(result).not.toContain('<div')
      expect(result).not.toContain('<p>')
      expect(result).not.toContain('</p>')
      expect(result).not.toContain('</div>')
    })

    it('neutralizes self-closing tags like <img>, <br />, and <hr />', () => {
      const input = 'Break line<br/>and image<img src="avatar.png" />'
      const result = sanitizeInput(input)
      expect(result).not.toContain('<br/>')
      expect(result).not.toContain('<img')
    })
  })

  describe('stripping/escaping javascript: URLs', () => {
    it('neutralizes standalone javascript: URIs', () => {
      const input = 'javascript:alert(1)'
      const result = sanitizeInput(input)
      expect(result.toLowerCase()).not.toContain('javascript:')
    })

    it('neutralizes javascript: in anchor href attributes', () => {
      const input = '<a href="javascript:alert(\'pwned\')">Click me</a>'
      const result = sanitizeInput(input)
      expect(result.toLowerCase()).not.toContain('javascript:')
      expect(result).not.toMatch(/href\s*=\s*["']?javascript:/i)
    })

    it('neutralizes case variations and whitespace tricks in javascript: protocol', () => {
      const input = 'JaVaScRiPt:void(0)'
      const result = sanitizeInput(input)
      expect(result.toLowerCase()).not.toContain('javascript:')
    })
  })

  describe('stripping/escaping event-handler attributes', () => {
    it('neutralizes onerror attributes on image tags', () => {
      const input = '<img src="invalid-url" onerror="alert(\'XSS\')" />'
      const result = sanitizeInput(input)
      expect(result).not.toMatch(/onerror\s*=/i)
    })

    it('neutralizes onclick and onload attributes', () => {
      const input = '<button onclick="evilFunction()">Click</button><body onload="evil()">'
      const result = sanitizeInput(input)
      expect(result).not.toMatch(/onclick\s*=/i)
      expect(result).not.toMatch(/onload\s*=/i)
    })

    it('neutralizes mouse and focus event handlers like onmouseover and onfocus', () => {
      const input = '<input onfocus="stealData()" onmouseover="track()" />'
      const result = sanitizeInput(input)
      expect(result).not.toMatch(/onfocus\s*=/i)
      expect(result).not.toMatch(/onmouseover\s*=/i)
    })
  })

  describe('malformed cases and XSS payloads', () => {
    it('returns empty string when input is null', () => {
      expect(sanitizeInput(null)).toBe('')
    })

    it('returns empty string when input is undefined', () => {
      expect(sanitizeInput(undefined)).toBe('')
    })

    it('returns empty string when input is an empty string', () => {
      expect(sanitizeInput('')).toBe('')
    })

    it('handles numeric input safely by converting or returning string', () => {
      expect(sanitizeInput(12345)).toBe('12345')
    })

    it('handles boolean input safely without throwing', () => {
      expect(typeof sanitizeInput(false)).toBe('string')
    })

    it('handles object input safely without throwing an exception', () => {
      expect(typeof sanitizeInput({})).toBe('string')
    })

    it('neutralizes classic breakout XSS payload', () => {
      const payload = '"><script>alert("XSS")</script>'
      const result = sanitizeInput(payload)
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('</script>')
    })

    it('neutralizes SVG onload XSS payload', () => {
      const payload = '<svg onload="alert(document.cookie)">'
      const result = sanitizeInput(payload)
      expect(result).not.toMatch(/onload\s*=/i)
      expect(result).not.toContain('<svg')
    })

    it('neutralizes iframe injection payload', () => {
      const payload = '<iframe src="javascript:alert(1)"></iframe>'
      const result = sanitizeInput(payload)
      expect(result).not.toContain('<iframe')
      expect(result.toLowerCase()).not.toContain('javascript:')
    })

    it('neutralizes style tag injection vector', () => {
      const payload = '<style>body { display: none; }</style>'
      const result = sanitizeInput(payload)
      expect(result).not.toContain('<style>')
      expect(result).not.toContain('</style>')
    })
  })

  describe('preservation of safe content', () => {
    it('preserves clean alphanumeric text, punctuation, and trimmed boundaries', () => {
      const clean = '  Response time was 250ms (p99). Performance looks great!  '
      expect(sanitizeInput(clean)).toBe('Response time was 250ms (p99). Performance looks great!')
    })
  })
})
