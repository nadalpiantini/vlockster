import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn utility', () => {
  it('debe combinar clases correctamente', () => {
    const result = cn('class1', 'class2')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
  })

  it('debe manejar clases condicionales', () => {
    const result = cn('base', true && 'conditional', false && 'hidden')
    expect(result).toContain('base')
    expect(result).toContain('conditional')
    expect(result).not.toContain('hidden')
  })

  it('debe filtrar valores falsy', () => {
    const result = cn('class1', null, undefined, false, 'class2')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
    expect(result).not.toContain('null')
    expect(result).not.toContain('undefined')
  })

  it('debe manejar arrays de clases', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
    expect(result).toContain('class3')
  })
})
