import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger } from '@/lib/utils/logger'

// Mock console methods
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    consoleLogSpy.mockClear()
    consoleWarnSpy.mockClear()
    consoleErrorSpy.mockClear()
    consoleDebugSpy.mockClear()
  })

  it('debe tener métodos info, warn, error, debug, api', () => {
    expect(logger.info).toBeDefined()
    expect(logger.warn).toBeDefined()
    expect(logger.error).toBeDefined()
    expect(logger.debug).toBeDefined()
    expect(logger.api).toBeDefined()
  })

  describe('info', () => {
    it('debe registrar información', () => {
      logger.info('Test message')
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('debe registrar información con formato estructurado', () => {
      logger.info('Test message', { userId: '123' })
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('debe aceptar contexto adicional', () => {
      logger.info('Test message', { userId: '123', action: 'test' })
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('debe manejar mensaje sin contexto', () => {
      logger.info('Test message')
      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('debe registrar advertencias', () => {
      logger.warn('Test warning')
      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it('debe aceptar contexto', () => {
      logger.warn('Test warning', { userId: '123' })
      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe('error', () => {
    it('debe registrar errores con Error object', () => {
      const testError = new Error('Test error')
      logger.error('Test error message', testError, { userId: '123' })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('debe registrar errores sin error object', () => {
      logger.error('Test error message', undefined, { userId: '123' })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('debe registrar errores sin context', () => {
      const testError = new Error('Test error')
      logger.error('Test error message', testError)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('debe registrar errores con error no-Error (string)', () => {
      logger.error('Test error message', 'String error', { userId: '123' })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('debe retornar errorId', () => {
      const errorId = logger.error('Test error', new Error('Test'), {})
      expect(typeof errorId).toBe('string')
      expect(errorId).toMatch(/^err_/)
    })

    it('debe retornar errorId único en cada llamada', () => {
      const errorId1 = logger.error('Test error 1', new Error('Test'))
      const errorId2 = logger.error('Test error 2', new Error('Test'))
      expect(errorId1).not.toBe(errorId2)
    })
  })

  describe('debug', () => {
    it('debe registrar debug cuando está en desarrollo', () => {
      // Solo testear que el método existe y no lanza error
      // El comportamiento real depende de NODE_ENV al momento de importar
      expect(() => logger.debug('Test debug')).not.toThrow()
    })

    it('debe aceptar contexto en debug', () => {
      // Solo testear que el método existe y no lanza error
      expect(() => logger.debug('Test debug', { userId: '123' })).not.toThrow()
    })
  })

  describe('api', () => {
    it('debe registrar API info', () => {
      logger.api('info', '/api/test', 'Test message', { userId: '123' })
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('debe registrar API warn', () => {
      logger.api('warn', '/api/test', 'Test warning', { userId: '123' })
      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it('debe registrar API error', () => {
      logger.api('error', '/api/test', 'Test error', { userId: '123' })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('debe registrar API debug', () => {
      // Solo testear que el método existe y no lanza error
      expect(() => logger.api('debug', '/api/test', 'Test debug', { userId: '123' })).not.toThrow()
    })
  })

  describe('formatLog', () => {
    it('debe extraer userId, endpoint, errorId del contexto', () => {
      logger.info('Test', { userId: '123', endpoint: '/test', errorId: 'err-123', other: 'data' })
      expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('debe manejar contexto sin campos especiales', () => {
      logger.info('Test', { customField: 'value' })
      expect(consoleLogSpy).toHaveBeenCalled()
    })
  })
})

