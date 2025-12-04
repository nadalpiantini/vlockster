import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitiza contenido HTML para prevenir XSS
 * Permite solo tags básicos de formato
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  })
}

/**
 * Sanitiza texto plano (elimina HTML completamente)
 */
export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}

/**
 * Sanitiza un objeto con campos de texto
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  textFields: (keyof T)[]
): T {
  const sanitized = { ...obj }
  for (const field of textFields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeText(sanitized[field] as string) as T[keyof T]
    }
  }
  return sanitized
}

