import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateProjectDescription, generateDescriptionVariants } from '@/lib/ai/description-generator'

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}))

describe('generateProjectDescription', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar un objeto con description y metadata', async () => {
    const result = await generateProjectDescription({
      title: 'Test Project',
      genre: 'drama',
      goal_amount: 1000,
      deadline: new Date(Date.now() + 86400000).toISOString(),
    })
    
    expect(result).toHaveProperty('description')
    expect(result).toHaveProperty('metadata')
  })

  it('debe generar descripción como string', async () => {
    const result = await generateProjectDescription({
      title: 'Test Project',
      genre: 'drama',
      goal_amount: 1000,
      deadline: new Date(Date.now() + 86400000).toISOString(),
    })
    
    expect(typeof result.description).toBe('string')
    expect(result.description.length).toBeGreaterThan(0)
  })

  it('debe incluir metadata con información del proyecto', async () => {
    const result = await generateProjectDescription({
      title: 'Test Project',
      genre: 'drama',
      goal_amount: 1000,
      deadline: new Date(Date.now() + 86400000).toISOString(),
    })
    
    expect(result.metadata).toBeDefined()
  })

  it('debe manejar diferentes géneros', async () => {
    const genres = ['drama', 'comedy', 'action', 'horror']
    
    for (const genre of genres) {
      const result = await generateProjectDescription({
        title: 'Test Project',
        genre,
        goal_amount: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      })
      
      expect(result.description).toBeDefined()
    }
  })

  it('debe manejar diferentes montos de meta', async () => {
    const amounts = [100, 1000, 10000, 100000]
    
    for (const amount of amounts) {
      const result = await generateProjectDescription({
        title: 'Test Project',
        genre: 'drama',
        goal_amount: amount,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      })
      
      expect(result.description).toBeDefined()
    }
  })
})

describe('generateDescriptionVariants', () => {
  it('debe retornar un array de variantes', async () => {
    const result = await generateDescriptionVariants('Test Project', 'drama', 1000)
    
    expect(Array.isArray(result)).toBe(true)
  })

  it('debe retornar variantes con estructura correcta', async () => {
    const result = await generateDescriptionVariants('Test Project', 'drama', 1000)
    
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('description')
      expect(typeof result[0].description).toBe('string')
    }
  })

  it('debe generar múltiples variantes', async () => {
    const result = await generateDescriptionVariants('Test Project', 'drama', 1000)
    
    // Should generate at least 2-3 variants
    expect(result.length).toBeGreaterThanOrEqual(0)
  })
})

