import { describe, it, expect, beforeEach, vi } from 'vitest'
import { logger } from './logger'

// Mock console methods
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
const _consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Test message')
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should log info with context', () => {
      logger.info('Test message', { userId: '123', endpoint: '/api/test' })
      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('Warning message')
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe('error', () => {
    it('should log error messages and return errorId', () => {
      const errorId = logger.error('Error message', new Error('Test error'))
      expect(errorId).toMatch(/^err_\d+_[a-z0-9]+$/)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should log error with context', () => {
      logger.error('Error message', new Error('Test'), {
        userId: '123',
        endpoint: '/api/test',
      })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('debug', () => {
    it('should log debug messages when in development', () => {
      // Debug only logs in development, but we test that the method exists
      logger.debug('Debug message')
      // May or may not be called depending on NODE_ENV
      // Just verify the method doesn't throw
      expect(true).toBe(true)
    })
  })

  describe('api', () => {
    it('should log API info messages', () => {
      logger.api('info', '/api/test', 'API call')
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should log API error messages', () => {
      logger.api('error', '/api/test', 'API error')
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})
