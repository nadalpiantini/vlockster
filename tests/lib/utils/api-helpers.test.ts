import { describe, it, expect, vi } from 'vitest'
import { handleError, sanitizeResponse } from '@/lib/utils/api-helpers'
import { NextResponse } from 'next/server'

describe('handleError', () => {
  it('debe retornar NextResponse con error 500 por defecto', () => {
    const error = new Error('Test error')
    const result = handleError(error, 'Test operation')
    
    expect(result).toBeInstanceOf(NextResponse)
    expect(result.status).toBe(500)
  })

  it('debe incluir el mensaje de error en la respuesta', async () => {
    const error = new Error('Test error message')
    const result = handleError(error, 'Test operation')
    const body = await result.json()
    
    expect(body).toHaveProperty('error')
    expect(body.error).toContain('Test error message')
  })

  it('debe incluir el nombre de la operación en el mensaje', async () => {
    const error = new Error('Test error')
    const result = handleError(error, 'Create user')
    const body = await result.json()
    
    expect(body.error).toContain('Create user')
  })

  it('debe manejar errores sin mensaje', async () => {
    const error = new Error()
    const result = handleError(error, 'Test operation')
    const body = await result.json()
    
    expect(body).toHaveProperty('error')
  })
})

describe('sanitizeResponse', () => {
  it('debe sanitizar strings en objetos', () => {
    const data = {
      title: '<script>alert(1)</script>Hello',
      description: 'Normal text',
    }
    const result = sanitizeResponse(data)
    
    expect(result.title).not.toContain('<script>')
    expect(result.description).toBe('Normal text')
  })

  it('debe sanitizar arrays de strings', () => {
    const data = {
      tags: ['<script>alert(1)</script>', 'normal tag'],
    }
    const result = sanitizeResponse(data)
    
    expect(result.tags[0]).not.toContain('<script>')
    expect(result.tags[1]).toBe('normal tag')
  })

  it('debe preservar números y booleanos', () => {
    const data = {
      count: 42,
      active: true,
    }
    const result = sanitizeResponse(data)
    
    expect(result.count).toBe(42)
    expect(result.active).toBe(true)
  })

  it('debe manejar objetos anidados', () => {
    const data = {
      user: {
        name: '<script>alert(1)</script>',
        email: 'test@example.com',
      },
    }
    const result = sanitizeResponse(data)
    
    expect(result.user.name).not.toContain('<script>')
    expect(result.user.email).toBe('test@example.com')
  })

  it('debe manejar null y undefined', () => {
    const data = {
      value: null,
      other: undefined,
    }
    const result = sanitizeResponse(data)
    
    expect(result.value).toBeNull()
    expect(result.other).toBeUndefined()
  })
})

