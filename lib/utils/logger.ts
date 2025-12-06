/**
 * Sistema de logging estructurado para VLOCKSTER
 * Reemplaza console.log/error con logging estructurado y seguro
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  message: string
  context?: LogContext
  timestamp: string
  errorId?: string
  userId?: string
  endpoint?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  /**
   * Genera un ID único para errores
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Formatea el log entry
   */
  private formatLog(level: LogLevel, message: string, context?: LogContext): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
    }

    if (context) {
      // Extraer campos comunes
      if (context.userId) entry.userId = String(context.userId)
      if (context.endpoint) entry.endpoint = String(context.endpoint)
      if (context.errorId) entry.errorId = String(context.errorId)

      // Agregar contexto adicional
      entry.context = { ...context }
      delete entry.context.userId
      delete entry.context.endpoint
      delete entry.context.errorId
    }

    return entry
  }

  /**
   * Log de información general
   */
  info(message: string, context?: LogContext): void {
    const entry = this.formatLog('info', message, context)

    if (this.isDevelopment) {
      console.log(`[INFO] ${entry.timestamp}`, message, context || '')
    } else {
      // En producción, enviar a servicio de logging (ej: Vercel Logs, Datadog, etc.)
      console.log(JSON.stringify(entry))
    }
  }

  /**
   * Log de advertencias
   */
  warn(message: string, context?: LogContext): void {
    const entry = this.formatLog('warn', message, context)

    if (this.isDevelopment) {
      console.warn(`[WARN] ${entry.timestamp}`, message, context || '')
    } else {
      console.warn(JSON.stringify(entry))
    }
  }

  /**
   * Log de errores - Maneja información sensible de forma segura
   * Retorna el errorId para uso en respuestas de API
   */
  error(message: string, error?: unknown, context?: LogContext): string {
    const errorId = this.generateErrorId()
    const entry = this.formatLog('error', message, {
      ...context,
      errorId,
    })

    if (this.isDevelopment) {
      // En desarrollo, mostrar todo
      console.error(`[ERROR] ${entry.timestamp} [${errorId}]`, message)
      if (error) {
        console.error('Error details:', error)
      }
      if (context) {
        console.error('Context:', context)
      }
    } else {
      // En producción, solo información segura
      const safeError = error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            // No incluir stack trace en producción
          }
        : String(error)

      entry.context = {
        ...entry.context,
        error: safeError,
      }

      console.error(JSON.stringify(entry))
    }

    // Retornar errorId para que el handler pueda incluirlo en la respuesta
    return errorId
  }

  /**
   * Log de debug (solo en desarrollo)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.isDevelopment) return

    const entry = this.formatLog('debug', message, context)
    console.debug(`[DEBUG] ${entry.timestamp}`, message, context || '')
  }

  /**
   * Log de operaciones de API
   */
  api(level: LogLevel, endpoint: string, message: string, context?: LogContext): void {
    const _entry = this.formatLog(level, message, {
      ...context,
      endpoint,
    })

    const logMessage = `[API] ${endpoint} - ${message}`

    switch (level) {
      case 'info':
        this.info(logMessage, { endpoint, ...context })
        break
      case 'warn':
        this.warn(logMessage, { endpoint, ...context })
        break
      case 'error':
        this.error(logMessage, undefined, { endpoint, ...context })
        break
      case 'debug':
        this.debug(logMessage, { endpoint, ...context })
        break
    }
  }
}

// Exportar instancia singleton
export const logger = new Logger()

// Exportar tipos para uso externo
export type { LogLevel, LogContext, LogEntry }

