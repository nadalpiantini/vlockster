import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { WebVitals } from '@/components/WebVitals'

// Mock web-vitals
vi.mock('web-vitals', () => ({
  onCLS: vi.fn((callback) => {
    callback({ name: 'CLS', value: 0.1, id: 'test-cls', rating: 'good' })
  }),
  onFCP: vi.fn((callback) => {
    callback({ name: 'FCP', value: 1000, id: 'test-fcp', rating: 'good' })
  }),
  onLCP: vi.fn((callback) => {
    callback({ name: 'LCP', value: 2000, id: 'test-lcp', rating: 'good' })
  }),
  onTTFB: vi.fn((callback) => {
    callback({ name: 'TTFB', value: 500, id: 'test-ttfb', rating: 'good' })
  }),
  onINP: vi.fn((callback) => {
    callback({ name: 'INP', value: 100, id: 'test-inp', rating: 'good' })
  }),
}))

describe('WebVitals', () => {
  const originalEnv = process.env.NODE_ENV
  const originalWindow = global.window

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.gtag
    global.window = {
      ...originalWindow,
      gtag: vi.fn(),
    } as any
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    global.window = originalWindow as any
  })

  it('should not render anything (returns null)', () => {
    const { container } = render(<WebVitals />)
    expect(container.firstChild).toBeNull()
  })

  it('should call web vitals functions in production', () => {
    process.env.NODE_ENV = 'production'
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = require('web-vitals')
    
    render(<WebVitals />)
    
    expect(onCLS).toHaveBeenCalled()
    expect(onFCP).toHaveBeenCalled()
    expect(onLCP).toHaveBeenCalled()
    expect(onTTFB).toHaveBeenCalled()
    expect(onINP).toHaveBeenCalled()
  })

  it('should call web vitals when NEXT_PUBLIC_ENABLE_WEB_VITALS is true', () => {
    process.env.NODE_ENV = 'development'
    process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS = 'true'
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = require('web-vitals')
    
    render(<WebVitals />)
    
    expect(onCLS).toHaveBeenCalled()
    expect(onFCP).toHaveBeenCalled()
    expect(onLCP).toHaveBeenCalled()
    expect(onTTFB).toHaveBeenCalled()
    expect(onINP).toHaveBeenCalled()
  })
})

