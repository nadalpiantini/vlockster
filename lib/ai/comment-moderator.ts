/**
 * Moderador de Comentarios con IA usando DeepSeek
 * 
 * QUÉ HACE:
 * - Analiza cada comentario en tiempo real
 * - Detecta: spam, toxicidad, hate speech, contenido inapropiado
 * - Clasifica severidad: safe, warning, moderate, severe
 * - Sugiere acción: approve, review, delete, ban
 */

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-d7872d14750148c0808e28fbd12d7014'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export type ModerationSeverity = 'safe' | 'warning' | 'moderate' | 'severe'
export type ModerationAction = 'approve' | 'review' | 'delete' | 'ban'

export interface ModerationResult {
  severity: ModerationSeverity
  action: ModerationAction
  reasons: string[]
  explanation: string
  confidence: number
}

interface ModerateCommentParams {
  comment_text: string
  author_id: string
  author_name: string
  context?: string
  author_history?: {
    total_comments?: number
    moderated_comments?: number
    warnings?: number
  }
}

export async function moderateComment(
  params: ModerateCommentParams
): Promise<ModerationResult> {
  const { comment_text, author_id, author_name, context = '', author_history } = params

  const historyText = author_history
    ? `Historial: ${author_history.total_comments || 0} comentarios, ${author_history.moderated_comments || 0} moderados, ${author_history.warnings || 0} advertencias`
    : 'Sin historial previo'

  const prompt = `Eres un moderador experto de contenido para VLOCKSTER, una plataforma de cine independiente con comunidad.

Analiza este comentario y determina:
1. SPAM: Enlaces sospechosos, mensajes repetitivos, promociones no autorizadas
2. TOXICIDAD: Lenguaje ofensivo, insultos, ataques personales
3. HATE SPEECH: Discriminación, racismo, sexismo, homofobia
4. CONTENIDO INAPROPIADO: Violencia gráfica, contenido sexual explícito
5. SCAM: Intentos de estafa, phishing, información falsa
6. OFF-TOPIC: Comentarios completamente fuera de tema

CLASIFICACIÓN DE SEVERIDAD:
- safe: Comentario apropiado, puede publicarse
- warning: Ligeramente inapropiado pero no grave
- moderate: Requiere revisión humana
- severe: Debe eliminarse inmediatamente

ACCIONES SUGERIDAS:
- approve: Publicar sin cambios
- review: Enviar a cola de moderadores humanos
- delete: Eliminar comentario
- ban: Eliminar y banear usuario (solo para severe + reincidencia)

IMPORTANTE:
- Sé estricto con hate speech y spam
- Permite críticas constructivas y opiniones diversas
- Considera contexto cultural y lenguaje coloquial
- No moderes por desacuerdo político/artístico legítimo

Retorna SOLO un JSON válido con este formato:
{
  "severity": "safe|warning|moderate|severe",
  "action": "approve|review|delete|ban",
  "reasons": ["razón1", "razón2"],
  "explanation": "Explicación detallada",
  "confidence": 0.0-1.0
}

Comentario: "${comment_text}"
Autor: ${author_name} (ID: ${author_id})
${historyText}
Contexto: ${context}

Analiza y retorna el JSON.`

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              'Eres un moderador experto. Analiza comentarios y retorna SOLO JSON válido con severidad, acción, razones, explicación y confianza.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Bajo para decisiones consistentes
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`DeepSeek API error: ${error}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content?.trim() || ''

    // Parsear JSON de la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]) as ModerationResult

        // Validar y normalizar
        if (!['safe', 'warning', 'moderate', 'severe'].includes(result.severity)) {
          result.severity = 'moderate'
        }
        if (!['approve', 'review', 'delete', 'ban'].includes(result.action)) {
          result.action = result.severity === 'severe' ? 'delete' : 'review'
        }

        return {
          severity: result.severity,
          action: result.action,
          reasons: Array.isArray(result.reasons) ? result.reasons : [result.explanation || 'Análisis automático'],
          explanation: result.explanation || '',
          confidence: typeof result.confidence === 'number' ? result.confidence : 0.5,
        }
      } catch (parseError) {
        console.error('Error parsing moderation JSON:', parseError)
      }
    }

    // Fallback: análisis básico
    const textLower = comment_text.toLowerCase()
    const spamKeywords = ['http://', 'https://', 'www.', 'gana dinero', 'click aquí']
    const toxicKeywords = ['idiota', 'estúpido', 'basura', 'mierda']
    const hateKeywords = ['odio', 'asco', 'desprecio']

    const hasSpam = spamKeywords.some((keyword) => textLower.includes(keyword))
    const hasToxic = toxicKeywords.some((keyword) => textLower.includes(keyword))
    const hasHate = hateKeywords.some((keyword) => textLower.includes(keyword))

    if (hasHate || (hasToxic && hasSpam)) {
      return {
        severity: 'severe',
        action: 'delete',
        reasons: ['Contenido inapropiado detectado'],
        explanation: 'El comentario contiene lenguaje inapropiado',
        confidence: 0.7,
      }
    }

    if (hasSpam) {
      return {
        severity: 'moderate',
        action: 'review',
        reasons: ['Posible spam'],
        explanation: 'El comentario puede contener spam',
        confidence: 0.6,
      }
    }

    if (hasToxic) {
      return {
        severity: 'warning',
        action: 'review',
        reasons: ['Lenguaje potencialmente ofensivo'],
        explanation: 'El comentario contiene lenguaje que puede ser ofensivo',
        confidence: 0.5,
      }
    }

    return {
      severity: 'safe',
      action: 'approve',
      reasons: [],
      explanation: 'Comentario apropiado',
      confidence: 0.8,
    }
  } catch (error) {
    console.error('Error moderating comment:', error)
    // En caso de error, ser conservador: enviar a revisión
    return {
      severity: 'moderate',
      action: 'review',
      reasons: ['Error en análisis automático'],
      explanation: 'No se pudo analizar completamente, requiere revisión',
      confidence: 0.3,
    }
  }
}

