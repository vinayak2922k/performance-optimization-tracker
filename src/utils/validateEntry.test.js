import { describe, it, expect } from 'vitest'
import { validateEntry } from './validateEntry'

describe('validateEntry', () => {
  describe('valid entries', () => {
    it('returns an empty errors object for a completely valid entry', () => {
      const validData = {
        name: 'Database Query Time',
        metric: 'query_duration_ms',
        score: 85,
        notes: 'Monitored across all read replicas under standard load.',
      }
      const errors = validateEntry(validData)
      expect(errors).toEqual({})
      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('accepts name at minimum boundary length of 2 characters', () => {
      const validData = {
        name: 'AB',
        metric: 'cpu',
        score: 50,
      }
      const errors = validateEntry(validData)
      expect(errors.name).toBeUndefined()
    })

    it('accepts name at maximum boundary length of 50 characters', () => {
      const validData = {
        name: 'A'.repeat(50),
        metric: 'memory',
        score: 75,
      }
      const errors = validateEntry(validData)
      expect(errors.name).toBeUndefined()
    })

    it('accepts score at lower boundary of 0', () => {
      const validData = {
        name: 'Error Rate',
        metric: 'http_5xx',
        score: 0,
      }
      const errors = validateEntry(validData)
      expect(errors.score).toBeUndefined()
    })

    it('accepts score at upper boundary of 100', () => {
      const validData = {
        name: 'Uptime Percentage',
        metric: 'availability',
        score: 100,
      }
      const errors = validateEntry(validData)
      expect(errors.score).toBeUndefined()
    })

    it('accepts floating point score between 0 and 100', () => {
      const validData = {
        name: 'Throughput',
        metric: 'rps',
        score: 99.5,
      }
      const errors = validateEntry(validData)
      expect(errors.score).toBeUndefined()
    })

    it('accepts entry without notes (optional field)', () => {
      const validData = {
        name: 'Memory Leak Check',
        metric: 'heap_used_mb',
        score: 60,
      }
      const errors = validateEntry(validData)
      expect(errors.notes).toBeUndefined()
      expect(errors).toEqual({})
    })

    it('accepts notes at maximum boundary length of 200 characters', () => {
      const validData = {
        name: 'Disk IOPS',
        metric: 'iops_write',
        score: 90,
        notes: 'X'.repeat(200),
      }
      const errors = validateEntry(validData)
      expect(errors.notes).toBeUndefined()
    })
  })

  describe('name validation', () => {
    it('returns error when name is missing or undefined', () => {
      const errors = validateEntry({
        metric: 'cpu_usage',
        score: 50,
      })
      expect(errors.name).toBeDefined()
      expect(typeof errors.name).toBe('string')
    })

    it('returns error when name is null', () => {
      const errors = validateEntry({
        name: null,
        metric: 'cpu_usage',
        score: 50,
      })
      expect(errors.name).toBeDefined()
    })

    it('returns error when name is empty string', () => {
      const errors = validateEntry({
        name: '',
        metric: 'cpu_usage',
        score: 50,
      })
      expect(errors.name).toBeDefined()
    })

    it('returns error when name is whitespace-only', () => {
      const errors = validateEntry({
        name: '   ',
        metric: 'cpu_usage',
        score: 50,
      })
      expect(errors.name).toBeDefined()
    })

    it('returns error when name is shorter than 2 characters', () => {
      const errors = validateEntry({
        name: 'A',
        metric: 'cpu_usage',
        score: 50,
      })
      expect(errors.name).toBeDefined()
    })

    it('returns error when name is longer than 50 characters', () => {
      const errors = validateEntry({
        name: 'A'.repeat(51),
        metric: 'cpu_usage',
        score: 50,
      })
      expect(errors.name).toBeDefined()
    })

    it('returns error when name is not a string', () => {
      const errors = validateEntry({
        name: 12345,
        metric: 'cpu_usage',
        score: 50,
      })
      expect(errors.name).toBeDefined()
    })
  })

  describe('metric validation', () => {
    it('returns error when metric is missing or undefined', () => {
      const errors = validateEntry({
        name: 'Network Latency',
        score: 80,
      })
      expect(errors.metric).toBeDefined()
      expect(typeof errors.metric).toBe('string')
    })

    it('returns error when metric is null', () => {
      const errors = validateEntry({
        name: 'Network Latency',
        metric: null,
        score: 80,
      })
      expect(errors.metric).toBeDefined()
    })

    it('returns error when metric is empty string', () => {
      const errors = validateEntry({
        name: 'Network Latency',
        metric: '',
        score: 80,
      })
      expect(errors.metric).toBeDefined()
    })

    it('returns error when metric is whitespace-only', () => {
      const errors = validateEntry({
        name: 'Network Latency',
        metric: '    ',
        score: 80,
      })
      expect(errors.metric).toBeDefined()
    })

    it('returns error when metric is not a string', () => {
      const errors = validateEntry({
        name: 'Network Latency',
        metric: 999,
        score: 80,
      })
      expect(errors.metric).toBeDefined()
    })
  })

  describe('score validation', () => {
    it('returns error when score is string "abc"', () => {
      const errors = validateEntry({
        name: 'Cache Hit Ratio',
        metric: 'hit_ratio',
        score: 'abc',
      })
      expect(errors.score).toBeDefined()
      expect(typeof errors.score).toBe('string')
    })

    it('returns error when score is missing or undefined', () => {
      const errors = validateEntry({
        name: 'Cache Hit Ratio',
        metric: 'hit_ratio',
      })
      expect(errors.score).toBeDefined()
    })

    it('returns error when score is null', () => {
      const errors = validateEntry({
        name: 'Cache Hit Ratio',
        metric: 'hit_ratio',
        score: null,
      })
      expect(errors.score).toBeDefined()
    })

    it('returns error when score is NaN', () => {
      const errors = validateEntry({
        name: 'Cache Hit Ratio',
        metric: 'hit_ratio',
        score: NaN,
      })
      expect(errors.score).toBeDefined()
    })

    it('returns error when score is less than 0', () => {
      const errors = validateEntry({
        name: 'Cache Hit Ratio',
        metric: 'hit_ratio',
        score: -1,
      })
      expect(errors.score).toBeDefined()
    })

    it('returns error when score is greater than 100', () => {
      const errors = validateEntry({
        name: 'Cache Hit Ratio',
        metric: 'hit_ratio',
        score: 101,
      })
      expect(errors.score).toBeDefined()
    })

    it('returns error when score is boolean or non-numeric object', () => {
      const errors = validateEntry({
        name: 'Cache Hit Ratio',
        metric: 'hit_ratio',
        score: true,
      })
      expect(errors.score).toBeDefined()
    })
  })

  describe('notes validation', () => {
    it('returns error when notes exceeds 200 characters', () => {
      const errors = validateEntry({
        name: 'Thread Count',
        metric: 'active_threads',
        score: 75,
        notes: 'N'.repeat(201),
      })
      expect(errors.notes).toBeDefined()
      expect(typeof errors.notes).toBe('string')
    })

    it('accepts notes when empty string', () => {
      const errors = validateEntry({
        name: 'Thread Count',
        metric: 'active_threads',
        score: 75,
        notes: '',
      })
      expect(errors.notes).toBeUndefined()
    })

    it('returns error when notes is non-string type', () => {
      const errors = validateEntry({
        name: 'Thread Count',
        metric: 'active_threads',
        score: 75,
        notes: 12345,
      })
      expect(errors.notes).toBeDefined()
    })
  })

  describe('malformed cases and root input handling', () => {
    it('handles null input safely and returns errors for required fields', () => {
      const errors = validateEntry(null)
      expect(errors).toBeDefined()
      expect(errors.name).toBeDefined()
      expect(errors.metric).toBeDefined()
      expect(errors.score).toBeDefined()
    })

    it('handles undefined input safely and returns errors for required fields', () => {
      const errors = validateEntry(undefined)
      expect(errors).toBeDefined()
      expect(errors.name).toBeDefined()
      expect(errors.metric).toBeDefined()
      expect(errors.score).toBeDefined()
    })

    it('handles empty object input and returns errors for all missing required fields', () => {
      const errors = validateEntry({})
      expect(errors.name).toBeDefined()
      expect(errors.metric).toBeDefined()
      expect(errors.score).toBeDefined()
    })

    it('returns multiple errors when all fields are invalid simultaneously', () => {
      const errors = validateEntry({
        name: 'A',
        metric: '',
        score: 'abc',
        notes: 'X'.repeat(250),
      })
      expect(errors.name).toBeDefined()
      expect(errors.metric).toBeDefined()
      expect(errors.score).toBeDefined()
      expect(errors.notes).toBeDefined()
    })
  })
})
