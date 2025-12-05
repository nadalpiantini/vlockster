'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals'

/**
 * Componente para medir y reportar Web Vitals
 * Implementa Core Web Vitals para performance monitoring
 */
export function WebVitals() {
  useEffect(() => {
    // Solo medir en producción o cuando se solicite explícitamente
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS === 'true') {
      const reportMetric = (metric: {
        name: string
        value: number
        id: string
        rating: 'good' | 'needs-improvement' | 'poor'
      }) => {
        // Enviar a Vercel Analytics (si está configurado)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          ;(window as any).gtag('event', metric.name, {
            value: Math.round(metric.value),
            metric_id: metric.id,
            metric_value: metric.value,
            metric_rating: metric.rating,
          })
        }

        // Log en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Web Vitals] ${metric.name}:`, {
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
          })
        }
      }

      // Medir Core Web Vitals
      onCLS(reportMetric) // Cumulative Layout Shift
      onFCP(reportMetric) // First Contentful Paint
      onLCP(reportMetric) // Largest Contentful Paint
      onTTFB(reportMetric) // Time to First Byte
      onINP(reportMetric) // Interaction to Next Paint (reemplaza FID)
    }
  }, [])

  return null // Componente sin UI
}

