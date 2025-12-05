import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger } from '@/lib/utils/logger'

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe tener métodos info, warn, error, debug', () => {
    expect(logger.info).toBeDefined()
    expect(logger.warn).toBeDefined()
    expect(logger.error).toBeDefined()
    expect(logger.debug).toBeDefined()
  })

  it('debe poder registrar información', () => {
    expect(() => logger.info('Test message')).not.toThrow()
  })

  it('debe poder registrar advertencias', () => {
    expect(() => logger.warn('Test warning')).not.toThrow()
  })

  it('debe poder registrar errores', () => {
    expect(() => logger.error('Test error', new Error('Test'))).not.toThrow()
  })

  it('debe poder registrar debug', () => {
    expect(() => logger.debug('Test debug')).not.toThrow()
  })

  it('debe aceptar contexto adicional', () => {
    expect(() => logger.info('Test message', { userId: '123', action: 'test' })).not.toThrow()
  })

  it('debe retornar errorId en producción', () => {
    const errorId = logger.error('Test error', new Error('Test'), {})
    expect(typeof errorId).toBe('string')
  })
})

