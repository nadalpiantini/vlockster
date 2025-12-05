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
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window.gtag
    delete (window as any).gtag
    // Reset environment
    delete process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('no debe registrar métricas en desarrollo por defecto', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(<WebVitals />)

    expect(mockOnCLS).not.toHaveBeenCalled()
    expect(mockOnFCP).not.toHaveBeenCalled()
    expect(mockOnLCP).not.toHaveBeenCalled()
    expect(mockOnTTFB).not.toHaveBeenCalled()
    expect(mockOnINP).not.toHaveBeenCalled()

    process.env.NODE_ENV = originalEnv
  })

  it('debe registrar métricas en producción', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    render(<WebVitals />)

    expect(mockOnCLS).toHaveBeenCalled()
    expect(mockOnFCP).toHaveBeenCalled()
    expect(mockOnLCP).toHaveBeenCalled()
    expect(mockOnTTFB).toHaveBeenCalled()
    expect(mockOnINP).toHaveBeenCalled()

    process.env.NODE_ENV = originalEnv
  })

  it('debe registrar métricas cuando NEXT_PUBLIC_ENABLE_WEB_VITALS está activado', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS = 'true'

    render(<WebVitals />)

    expect(mockOnCLS).toHaveBeenCalled()
    expect(mockOnFCP).toHaveBeenCalled()
    expect(mockOnLCP).toHaveBeenCalled()
    expect(mockOnTTFB).toHaveBeenCalled()
    expect(mockOnINP).toHaveBeenCalled()

    process.env.NODE_ENV = originalEnv
    delete process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS
  })

  it('debe enviar métricas a gtag cuando está disponible', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    
    const mockGtag = vi.fn()
    ;(window as any).gtag = mockGtag

    render(<WebVitals />)

    // Simular callback de métrica
    const mockMetric = {
      name: 'LCP',
      value: 2500,
      id: 'metric-123',
      rating: 'good' as const,
    }

    // Llamar al callback registrado
    const clsCallback = mockOnCLS.mock.calls[0][0]
    clsCallback(mockMetric)

    expect(mockGtag).toHaveBeenCalledWith('event', 'LCP', {
      value: 2500,
      metric_id: 'metric-123',
      metric_value: 2500,
      metric_rating: 'good',
    })

    process.env.NODE_ENV = originalEnv
  })

  it('debe redondear valores de métricas al enviar a gtag', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    
    const mockGtag = vi.fn()
    ;(window as any).gtag = mockGtag

    render(<WebVitals />)

    const mockMetric = {
      name: 'FCP',
      value: 1234.567,
      id: 'metric-456',
      rating: 'needs-improvement' as const,
    }

    const fcpCallback = mockOnFCP.mock.calls[0][0]
    fcpCallback(mockMetric)

    expect(mockGtag).toHaveBeenCalledWith('event', 'FCP', {
      value: 1235, // Redondeado
      metric_id: 'metric-456',
      metric_value: 1234.567,
      metric_rating: 'needs-improvement',
    })

    process.env.NODE_ENV = originalEnv
  })

  it('debe loggear métricas en desarrollo cuando está habilitado', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS = 'true'
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(<WebVitals />)

    const mockMetric = {
      name: 'CLS',
      value: 0.1,
      id: 'metric-789',
      rating: 'good' as const,
    }

    const clsCallback = mockOnCLS.mock.calls[0][0]
    clsCallback(mockMetric)

    expect(consoleSpy).toHaveBeenCalledWith('[Web Vitals] CLS:', {
      value: 0.1,
      rating: 'good',
      id: 'metric-789',
    })

    consoleSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
    delete process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS
  })

  it('no debe renderizar nada (componente sin UI)', () => {
    const { container } = render(<WebVitals />)
    
    expect(container.firstChild).toBeNull()
  })

  it('debe registrar todas las métricas Core Web Vitals', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    render(<WebVitals />)

    // Verificar que todas las métricas están registradas
    expect(mockOnCLS).toHaveBeenCalledTimes(1)
    expect(mockOnFCP).toHaveBeenCalledTimes(1)
    expect(mockOnLCP).toHaveBeenCalledTimes(1)
    expect(mockOnTTFB).toHaveBeenCalledTimes(1)
    expect(mockOnINP).toHaveBeenCalledTimes(1)

    process.env.NODE_ENV = originalEnv
  })
})
