/**
 * Generador de Descripciones con IA usando DeepSeek
 * 
 * QUÉ HACE:
 * - Genera descripción convincente para proyectos de crowdfunding
 * - Optimiza para conversión (motivar backings)
 * - Crea múltiples variantes para elegir
 * - Sugiere mejoras en recompensas y metas
 */

import { logger } from '@/lib/utils/logger'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-d7872d14750148c0808e28fbd12d7014'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

interface GenerateDescriptionParams {
  title: string
  genre: string
  goal_amount: number
  deadline: string
  rewards?: Array<{
    amount: number
    title: string
    description?: string
  }>
  additional_info?: string
}

interface GenerateDescriptionResponse {
  description: string
  variants?: string[]
  suggestions?: string[]
  tags?: string[]
}

export async function generateProjectDescription(
  params: GenerateDescriptionParams
): Promise<GenerateDescriptionResponse> {
  const { title, genre, goal_amount, deadline, rewards = [], additional_info = '' } = params

  // Formatear recompensas para el prompt
  const rewardsText = rewards.length > 0
    ? rewards
        .map((r) => `- $${r.amount}: ${r.title}${r.description ? ` - ${r.description}` : ''}`)
        .join('\n')
    : 'Sin recompensas definidas aún'

  const prompt = `Eres un experto copywriter especializado en campañas de crowdfunding para proyectos de cine independiente en VLOCKSTER.

Tu tarea es crear una descripción convincente que:
- Emocione a potenciales backers
- Explique claramente el proyecto
- Destaque el valor único
- Motive a apoyar financieramente
- Sea auténtica y no exagerada

ESTRUCTURA DE LA DESCRIPCIÓN:
1. Hook inicial (1-2 frases que capten atención)
2. Presentación del proyecto (qué es, quién lo hace)
3. Por qué es importante/único
4. Qué se financiará específicamente
5. Impacto esperado
6. Llamada a la acción

TONO: Profesional pero apasionado, auténtico, motivador
LONGITUD: 300-500 palabras

Genera una descripción convincente para este proyecto:

Título: ${title}
Género: ${genre}
Meta de financiamiento: $${goal_amount}
Deadline: ${deadline}
Recompensas:
${rewardsText}
${additional_info ? `Información adicional: ${additional_info}` : ''}

Genera la descripción completa. Retorna SOLO la descripción, sin explicaciones adicionales.`

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
              'Eres un experto copywriter. Genera descripciones convincentes para proyectos de crowdfunding de cine independiente. Sé profesional, auténtico y motivador.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`DeepSeek API error: ${error}`)
    }

    const data = await response.json()
    const description = data.choices[0]?.message?.content?.trim() || ''

    if (!description) {
      throw new Error('No se pudo generar la descripción')
    }

    return {
      description,
    }
  } catch (error) {
    logger.error('Error generating description', error, {
      function: 'generateDescription',
    })
    throw error
  }
}

export async function generateDescriptionVariants(
  title: string,
  genre: string,
  goal_amount: number
): Promise<string[]> {
  const prompt = `Genera 3 variantes diferentes de descripción para este proyecto de crowdfunding.
Cada variante debe tener un enfoque diferente:
- Variante 1: Enfoque emocional/personal (conecta con el corazón)
- Variante 2: Enfoque profesional/técnico (destaca calidad y expertise)
- Variante 3: Enfoque comunitario/impacto social (destaca el impacto en la comunidad)

Título: ${title}
Género: ${genre}
Meta: $${goal_amount}

Retorna las 3 variantes separadas por "---VARIANTE---".`

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
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error('Error generando variantes')
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content?.trim() || ''

    // Dividir por separador
    const variants = text.split('---VARIANTE---').map((v: string) => v.trim()).filter((v: string) => v.length > 0)

    return variants.length > 0 ? variants : [text]
  } catch (error) {
    logger.error('Error generating variants', error, {
      function: 'generateDescriptionVariants',
    })
    return []
  }
}

export async function generateProjectTags(
  title: string,
  description: string,
  genre: string
): Promise<string[]> {
  const prompt = `Genera 5-10 tags relevantes para búsqueda basados en:
- Título del proyecto: ${title}
- Descripción: ${description.substring(0, 500)}
- Género: ${genre}

Los tags deben ser: específicos, relevantes, variados.
Retorna SOLO los tags separados por comas, sin explicaciones.`

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
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      throw new Error('Error generando tags')
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content?.trim() || ''

    // Parsear tags (separados por comas)
    const tags = text
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0)
      .slice(0, 10)

    return tags
  } catch (error) {
    logger.error('Error generating tags', error, {
      function: 'generateProjectTags',
    })
    return []
  }
}

