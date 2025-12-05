import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { WebVitals } from '@/components/WebVitals'

// Mock web-vitals
const mockOnCLS = vi.fn()
const mockOnFCP = vi.fn()
const mockOnLCP = vi.fn()
const mockOnTTFB = vi.fn()
const mockOnINP = vi.fn()

vi.mock('web-vitals', () => ({
  onCLS: (callback: any) => mockOnCLS(callback),
  onFCP: (callback: any) => mockOnFCP(callback),
  onLCP: (callback: any) => mockOnLCP(callback),
  onTTFB: (callback: any) => mockOnTTFB(callback),
  onINP: (callback: any) => mockOnINP(callback),
}))

describe('WebVitals', () => {
  const originalGtag = (window as any).gtag
  const originalConsoleLog = console.log

  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    ;(window as any).gtag = undefined
    console.log = vi.fn()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    ;(window as any).gtag = originalGtag
    console.log = originalConsoleLog
  })

  it('no debe medir en desarrollo por defecto', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_ENABLE_WEB_VITALS', undefined as any)

    render(<WebVitals />)

    expect(mockOnCLS).not.toHaveBeenCalled()
    expect(mockOnFCP).not.toHaveBeenCalled()
    expect(mockOnLCP).not.toHaveBeenCalled()
    expect(mockOnTTFB).not.toHaveBeenCalled()
    expect(mockOnINP).not.toHaveBeenCalled()
  })

  it('debe medir en producción', () => {
    vi.stubEnv('NODE_ENV', 'production')

    render(<WebVitals />)

    expect(mockOnCLS).toHaveBeenCalled()
    expect(mockOnFCP).toHaveBeenCalled()
    expect(mockOnLCP).toHaveBeenCalled()
    expect(mockOnTTFB).toHaveBeenCalled()
    expect(mockOnINP).toHaveBeenCalled()
  })

  it('debe medir cuando NEXT_PUBLIC_ENABLE_WEB_VITALS está activo', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_ENABLE_WEB_VITALS', 'true')

    render(<WebVitals />)

    expect(mockOnCLS).toHaveBeenCalled()
    expect(mockOnFCP).toHaveBeenCalled()
    expect(mockOnLCP).toHaveBeenCalled()
    expect(mockOnTTFB).toHaveBeenCalled()
    expect(mockOnINP).toHaveBeenCalled()
  })

  it('debe enviar métricas a gtag si está disponible', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const mockGtag = vi.fn()
    ;(window as any).gtag = mockGtag

    render(<WebVitals />)

    // Simular callback de métrica
    const metricCallback = mockOnCLS.mock.calls[0][0]
    metricCallback({
      name: 'CLS',
      value: 0.1,
      id: 'test-id',
      rating: 'good',
    })

    expect(mockGtag).toHaveBeenCalledWith('event', 'CLS', {
      value: 0,
      metric_id: 'test-id',
      metric_value: 0.1,
      metric_rating: 'good',
    })
  })

  it('debe loggear métricas en desarrollo cuando está habilitado', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_ENABLE_WEB_VITALS', 'true')

    render(<WebVitals />)

    const metricCallback = mockOnCLS.mock.calls[0][0]
    metricCallback({
      name: 'CLS',
      value: 0.1,
      id: 'test-id',
      rating: 'good',
    })

    expect(console.log).toHaveBeenCalledWith(
      '[Web Vitals] CLS:',
      expect.objectContaining({
        value: 0.1,
        rating: 'good',
        id: 'test-id',
      })
    )
  })

  it('debe redondear valores al enviar a gtag', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const mockGtag = vi.fn()
    ;(window as any).gtag = mockGtag

    render(<WebVitals />)

    const metricCallback = mockOnLCP.mock.calls[0][0]
    metricCallback({
      name: 'LCP',
      value: 1234.567,
      id: 'test-id',
      rating: 'good',
    })

    expect(mockGtag).toHaveBeenCalledWith('event', 'LCP', {
      value: 1235, // Redondeado
      metric_id: 'test-id',
      metric_value: 1234.567,
      metric_rating: 'good',
    })
  })

  it('no debe renderizar nada (componente sin UI)', () => {
    const { container } = render(<WebVitals />)
    expect(container.firstChild).toBeNull()
  })
})
