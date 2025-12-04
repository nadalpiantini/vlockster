import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('debe combinar clases correctamente', () => {
    const result = cn('class1', 'class2')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
  })

  it('debe manejar clases condicionales', () => {
    const result = cn('base', true && 'conditional')
    expect(result).toContain('base')
    expect(result).toContain('conditional')
  })

  it('debe ignorar valores falsy', () => {
    const result = cn('base', false && 'ignored', null, undefined)
    expect(result).toBe('base')
  })

  it('debe manejar arrays', () => {
    const result = cn(['class1', 'class2'])
    expect(result).toContain('class1')
    expect(result).toContain('class2')
  })
})

