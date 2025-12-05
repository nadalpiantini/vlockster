import { describe, it, expect } from 'vitest'
import { sanitizeHtml, sanitizeText, sanitizeObject } from '@/lib/utils/sanitize'

describe('sanitizeText', () => {
  it('debe eliminar etiquetas HTML', () => {
    const input = '<script>alert("xss")</script>Hello'
    const result = sanitizeText(input)
    expect(result).not.toContain('<script>')
    expect(result).toContain('Hello')
  })

  it('debe eliminar caracteres especiales HTML', () => {
    const input = '<>&"\''
    const result = sanitizeText(input)
    expect(result).not.toContain('<')
    expect(result).not.toContain('>')
  })

  it('debe manejar strings vacíos', () => {
    expect(sanitizeText('')).toBe('')
  })

  it('debe manejar null/undefined', () => {
    expect(sanitizeText(null as any)).toBe('')
    expect(sanitizeText(undefined as any)).toBe('')
  })

  it('debe preservar texto normal', () => {
    const input = 'This is normal text'
    expect(sanitizeText(input)).toBe('This is normal text')
  })
})

describe('sanitizeHtml', () => {
  it('debe permitir etiquetas HTML seguras', () => {
    const input = '<p>Hello <strong>world</strong></p>'
    const result = sanitizeHtml(input)
    expect(result).toContain('<p>')
    expect(result).toContain('<strong>')
  })

  it('debe eliminar scripts', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('<script>')
  })

  it('debe eliminar eventos inline', () => {
    const input = '<p onclick="alert(1)">Hello</p>'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('onclick')
  })

  it('debe manejar strings vacíos', () => {
    expect(sanitizeHtml('')).toBe('')
  })

  it('debe manejar null/undefined', () => {
    expect(sanitizeHtml(null as any)).toBe('')
    expect(sanitizeHtml(undefined as any)).toBe('')
  })
})

describe('sanitizeObject', () => {
  it('debe sanitizar campos de texto especificados', () => {
    const obj = {
      title: '<script>alert(1)</script>Hello',
      description: 'Normal text',
      count: 42,
    }
    const result = sanitizeObject(obj, ['title', 'description'])
    expect(result.title).not.toContain('<script>')
    expect(result.description).toBe('Normal text')
    expect(result.count).toBe(42)
  })

  it('debe preservar campos no especificados', () => {
    const obj = {
      title: '<script>alert(1)</script>',
      other: 'Not sanitized',
    }
    const result = sanitizeObject(obj, ['title'])
    expect(result.title).not.toContain('<script>')
    expect(result.other).toBe('Not sanitized')
  })
})

