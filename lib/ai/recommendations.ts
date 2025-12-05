/**
 * Sistema de Recomendaciones Inteligentes con IA
 * 
 * QUÉ HACE:
 * - Analiza historial de visualización del usuario
 * - Genera recomendaciones personalizadas de videos y proyectos
 * - Considera: género, creator, popularidad, novedad
 * - Explica por qué cada recomendación
 */

import { logger } from '@/lib/utils/logger'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-d7872d14750148c0808e28fbd12d7014'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export interface Recommendation {
  id: string
  type: 'video' | 'project'
  title: string
  description: string
  reason: string
  confidence_score: number
}

export interface RecommendationsResponse {
  recommendations: Recommendation[]
  insights: string
}

interface UserHistory {
  videos_viewed: Array<{
    video_id: string
    title: string
    genre: string
    creator_id: string
    watched_seconds: number
  }>
  projects_backed: Array<{
    project_id: string
    title: string
    genre: string
    creator_id: string
    amount: number
  }>
  preferred_genres: Array<[string, number]>
  total_watch_time: number
}

export async function generateRecommendations(
  userHistory: UserHistory,
  availableContent: {
    videos: Array<{
      id: string
      title: string
      description: string
      genre: string
      creator_id: string
      view_count: number
      created_at: string
    }>
    projects: Array<{
      id: string
      title: string
      description: string | null
      category: string | null
      creator_id: string
      goal_amount: number
      current_amount: number | null
      deadline: string
    }>
  }
): Promise<RecommendationsResponse> {
  const prompt = `Eres un experto en recomendaciones de contenido para VLOCKSTER, una plataforma de cine independiente.

Analiza el historial del usuario y genera 10 recomendaciones personalizadas.

HISTORIAL DEL USUARIO:
- Videos vistos: ${userHistory.videos_viewed.length}
- Videos: ${JSON.stringify(userHistory.videos_viewed.slice(0, 10))}
- Proyectos apoyados: ${userHistory.projects_backed.length}
- Proyectos: ${JSON.stringify(userHistory.projects_backed.slice(0, 10))}
- Géneros preferidos: ${JSON.stringify(userHistory.preferred_genres)}
- Tiempo total de visualización: ${userHistory.total_watch_time} minutos

CONTENIDO DISPONIBLE:
Videos: ${JSON.stringify(availableContent.videos.slice(0, 20).map((v) => ({ ...v, genre: v.genre || 'unknown' })))}
Proyectos: ${JSON.stringify(availableContent.projects.slice(0, 15).map((p) => ({ ...p, genre: p.category || 'unknown', total_raised: p.current_amount })))}

INSTRUCCIONES:
1. Analiza los patrones en el historial: géneros preferidos, creators seguidos, tipos de contenido
2. Selecciona 10 items del catálogo disponible que sean relevantes (mix de videos y proyectos)
3. Para cada recomendación, explica POR QUÉ la recomiendas (género similar, mismo creator, etc.)
4. Prioriza: relevancia personal > novedad > popularidad
5. Incluye mix de videos y proyectos de crowdfunding

Retorna SOLO un JSON válido con este formato:
{
  "recommendations": [
    {
      "id": "video123",
      "type": "video",
      "title": "Título",
      "description": "Descripción corta",
      "reason": "Te recomendamos este video porque...",
      "confidence_score": 0.85
    }
  ],
  "insights": "Basado en tu historial, te gustan los dramas independientes..."
}`

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
              'Eres un experto en recomendaciones. Analiza historial y genera recomendaciones personalizadas. Retorna SOLO JSON válido.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error('Error generando recomendaciones')
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content?.trim() || ''

    // Parsear JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as RecommendationsResponse
      } catch (parseError) {
        logger.error('Error parsing recommendations JSON', parseError, {
          function: 'generateRecommendations',
          step: 'parse_json',
        })
      }
    }

    // Fallback: recomendaciones básicas
    return {
      recommendations: availableContent.videos.slice(0, 5).map((v) => ({
        id: v.id,
        type: 'video' as const,
        title: v.title,
        description: v.description || '',
        reason: 'Basado en tu historial de visualización',
        confidence_score: 0.6,
      })),
      insights: 'Recomendaciones basadas en contenido popular',
    }
  } catch (error) {
    logger.error('Error generating recommendations', error, {
      function: 'generateRecommendations',
    })
    throw error
  }
}

