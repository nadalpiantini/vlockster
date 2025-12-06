import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { sanitizeText, sanitizeHtml } from './sanitize'
import { logger } from './logger'

/**
 * Maneja errores de validación Zod y retorna respuesta apropiada
 */
export function handleValidationError(error: ZodError) {
  const errors = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))

  logger.warn('Validation error', {
    errors: errors.map((e) => `${e.field}: ${e.message}`).join(', '),
  })

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
export function handleError(error: unknown, context?: string, additionalContext?: { userId?: string; endpoint?: string }) {
  const errorId = logger.error(
    `Error in ${context || 'API'}`,
    error,
    {
      ...additionalContext,
      endpoint: additionalContext?.endpoint || context,
    }
  )

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

