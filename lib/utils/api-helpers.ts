import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { sanitizeText, sanitizeHtml } from './sanitize'

/**
 * Maneja errores de validación Zod y retorna respuesta apropiada
 */
export function handleValidationError(error: ZodError) {
  const errors = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))

  return NextResponse.json(
    {
      error: 'Error de validación',
      details: errors,
    },
    { status: 400 }
  )
}

/**
 * Maneja errores genéricos de forma segura
 */
export function handleError(error: unknown, context?: string) {
  const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // En desarrollo, loggear el error completo
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'API'}] Error:`, error)
  } else {
    // En producción, solo loggear el ID
    console.error(`[${context || 'API'}] Error ID: ${errorId}`)
  }

  return NextResponse.json(
    {
      error: 'Error interno del servidor',
      errorId: process.env.NODE_ENV === 'development' ? undefined : errorId,
    },
    { status: 500 }
  )
}

/**
 * Sanitiza contenido de texto antes de guardar
 */
export function sanitizeContent(content: string, allowHtml = false): string {
  return allowHtml ? sanitizeHtml(content) : sanitizeText(content)
}

/**
 * Valida y sanitiza un objeto con campos de texto
 */
export function validateAndSanitize<T extends Record<string, any>>(
  data: T,
  textFields: (keyof T)[]
): T {
  const sanitized = { ...data }
  for (const field of textFields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeText(sanitized[field] as string) as T[keyof T]
    }
  }
  return sanitized
}

