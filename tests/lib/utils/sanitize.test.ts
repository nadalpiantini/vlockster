import { describe, it, expect } from 'vitest'
import { sanitizeInput, sanitizeHTML } from '@/lib/utils/sanitize'

describe('sanitizeInput', () => {
  it('debe eliminar etiquetas HTML', () => {
    const input = '<script>alert("xss")</script>Hello'
    const result = sanitizeInput(input)
    expect(result).toBe('Hello')
  })

  it('debe escapar caracteres especiales', () => {
    const input = '<>&"\''
    const result = sanitizeInput(input)
    expect(result).not.toContain('<')
    expect(result).not.toContain('>')
  })

  it('debe manejar strings vacíos', () => {
    expect(sanitizeInput('')).toBe('')
  })

  it('debe manejar null/undefined', () => {
    expect(sanitizeInput(null as any)).toBe('')
    expect(sanitizeInput(undefined as any)).toBe('')
  })

  it('debe preservar texto normal', () => {
    const input = 'This is normal text'
    expect(sanitizeInput(input)).toBe('This is normal text')
  })
})

describe('sanitizeHTML', () => {
  it('debe permitir etiquetas HTML seguras', () => {
    const input = '<p>Hello <strong>world</strong></p>'
    const result = sanitizeHTML(input)
    expect(result).toContain('<p>')
    expect(result).toContain('<strong>')
  })

  it('debe eliminar scripts', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>'
    const result = sanitizeHTML(input)
    expect(result).not.toContain('<script>')
  })

  it('debe eliminar eventos inline', () => {
    const input = '<p onclick="alert(1)">Hello</p>'
    const result = sanitizeHTML(input)
    expect(result).not.toContain('onclick')
  })

  it('debe manejar strings vacíos', () => {
    expect(sanitizeHTML('')).toBe('')
  })

  it('debe manejar null/undefined', () => {
    expect(sanitizeHTML(null as any)).toBe('')
    expect(sanitizeHTML(undefined as any)).toBe('')
  })
})

