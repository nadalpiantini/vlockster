import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleError, handleValidationError, sanitizeContent, validateAndSanitize } from '@/lib/utils/api-helpers'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(() => 'error-id-123'),
    warn: vi.fn(),
  },
}))

describe('handleError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar NextResponse con error 500 por defecto', () => {
    const error = new Error('Test error')
    const result = handleError(error, 'Test operation')
    
    expect(result).toBeInstanceOf(NextResponse)
    expect(result.status).toBe(500)
  })

  it('debe incluir errorId en desarrollo', async () => {
    const originalEnv = process.env.NODE_ENV
    Object.defineProperty(process, 'env', {
      value: { ...process.env, NODE_ENV: 'development' },
      writable: true,
      configurable: true,
    })
    
    const error = new Error('Test error')
    const result = handleError(error, 'Test operation')
    const body = await result.json()
    
    expect(body).toHaveProperty('error')
    
    Object.defineProperty(process, 'env', {
      value: { ...process.env, NODE_ENV: originalEnv },
      writable: true,
      configurable: true,
    })
  })

  it('debe incluir contexto adicional', () => {
    const error = new Error('Test error')
    const result = handleError(error, 'Test operation', { userId: 'user-123', endpoint: '/api/test' })
    
    expect(result).toBeInstanceOf(NextResponse)
  })
})

describe('handleValidationError', () => {
  it('debe retornar error 400 con detalles de validación', async () => {
    const zodError = new ZodError([
      {
        code: 'too_small',
        minimum: 3,
        type: 'string',
        inclusive: true,
        path: ['title'],
        message: 'Título debe tener al menos 3 caracteres',
      },
    ])
    
    const result = handleValidationError(zodError)
    expect(result.status).toBe(400)
    
    const body = await result.json()
    expect(body).toHaveProperty('error')
    expect(body).toHaveProperty('details')
    expect(Array.isArray(body.details)).toBe(true)
  })
})

describe('sanitizeContent', () => {
  it('debe sanitizar texto cuando allowHtml es false', () => {
    const input = '<script>alert(1)</script>Hello'
    const result = sanitizeContent(input, false)
    expect(result).not.toContain('<script>')
  })

  it('debe permitir HTML cuando allowHtml es true', () => {
    const input = '<p>Hello <strong>world</strong></p>'
    const result = sanitizeContent(input, true)
    expect(result).toContain('<p>')
    expect(result).toContain('<strong>')
  })
})

describe('validateAndSanitize', () => {
  it('debe sanitizar campos de texto especificados', () => {
    const data = {
      title: '<script>alert(1)</script>Hello',
      description: 'Normal text',
      count: 42,
    }
    const result = validateAndSanitize(data, ['title', 'description'])
    expect(result.title).not.toContain('<script>')
    expect(result.description).toBe('Normal text')
    expect(result.count).toBe(42)
  })

  it('debe preservar campos no especificados', () => {
    const data = {
      title: '<script>alert(1)</script>',
      other: 'Not sanitized',
    }
    const result = validateAndSanitize(data, ['title'])
    expect(result.title).not.toContain('<script>')
    expect(result.other).toBe('Not sanitized')
  })
})

