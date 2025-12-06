'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Reward {
  id: string
  title: string
  description: string
  amount: number
  limit: number | null
}

export default function CreateProjectPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [videoId, setVideoId] = useState('')
  const [rewards, setRewards] = useState<Reward[]>([])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const router = useRouter()

  const addReward = () => {
    const newReward: Reward = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      amount: 0,
      limit: null,
    }
    setRewards([...rewards, newReward])
  }

  const updateReward = (id: string, field: keyof Reward, value: string | number | null) => {
    setRewards(
      rewards.map((reward) =>
        reward.id === id ? { ...reward, [field]: value } : reward
      )
    )
  }

  const removeReward = (id: string) => {
    setRewards(rewards.filter((reward) => reward.id !== id))
  }

  const handleGenerateDescription = async () => {
    if (!title || !goalAmount || !deadline) {
      setError('Por favor completa título, meta y deadline antes de generar la descripción')
      return
    }

    setGeneratingDescription(true)
    setError(null)

    try {
      const response = await fetch('/api/projects/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          genre: 'Drama', // Por ahora fijo, puedes agregar selector de género después
          goal_amount: parseFloat(goalAmount),
          deadline,
          rewards: rewards.map((r) => ({
            amount: r.amount,
            title: r.title || '',
            description: r.description,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error generando descripción')
      }

      const data = await response.json()
      if (data.description) {
        setDescription(data.description)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando descripción')
    } finally {
      setGeneratingDescription(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCreating(true)

    try {
      // Validar recompensas
      const validRewards = rewards.filter(
        (r) => r.title && r.description && r.amount > 0
      )

      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          goal_amount: parseFloat(goalAmount),
          deadline,
          video_id: videoId || null,
          rewards: validRewards.map((r) => ({
            title: r.title,
            description: r.description,
            amount: r.amount,
            limit: r.limit,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear proyecto')
      }

      const data = await response.json()
      router.push(`/projects/${data.project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear proyecto')
    } finally {
      setCreating(false)
    }
  }

  // Calcular fecha mínima (mañana)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto max-w-4xl" role="main" aria-label="Crear proyecto de crowdfunding">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Crear Proyecto de Crowdfunding</CardTitle>
            <CardDescription>
              Lanza tu campaña y financia tu próximo proyecto cinematográfico
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} aria-label="Formulario de creación de proyecto">
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md text-sm" role="alert" aria-live="assertive" aria-atomic="true">
                  {error}
                </div>
              )}
              {creating && (
                <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
                  Creando proyecto, por favor espera...
                </div>
              )}

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title" aria-describedby="title-help-text">
                  Título del Proyecto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Ej: Cortometraje Experimental sobre..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  aria-required="true"
                  aria-describedby="title-help-text"
                  disabled={creating}
                />
                <p id="title-help-text" className="text-xs text-gray-400" role="definition">
                  Proporciona un título atractivo y descriptivo para tu proyecto
                </p>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" aria-describedby="description-help-text">
                    Descripción <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={generatingDescription || creating || !title || !goalAmount || !deadline}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    aria-describedby="description-help-text"
                  >
                    {generatingDescription ? (
                      <>
                        <span className="animate-spin mr-2" aria-label="Cargando">⏳</span>
                        Generando...
                      </>
                    ) : (
                      <>
                        ✨ Generar con IA
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe tu proyecto: sinopsis, equipo, plan de producción... O haz clic en 'Generar con IA' para crear una descripción automática"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={creating}
                  rows={6}
                  aria-describedby="description-help-text"
                  aria-required="true"
                />
                <p id="description-help-text" className="text-xs text-gray-400" role="definition">
                  Describe tu proyecto: sinopsis, equipo, plan de producción... O haz clic en 'Generar con IA' para crear una descripción automática
                </p>
                {generatingDescription && (
                  <p className="text-xs text-gray-300" role="status" aria-live="polite" aria-busy="true">
                    La IA está creando una descripción convincente para tu proyecto...
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Meta de Financiamiento */}
                <div className="space-y-2">
                  <Label htmlFor="goalAmount" aria-describedby="goalAmount-help-text">
                    Meta (USD) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="5000"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    required
                    aria-required="true"
                    aria-describedby="goalAmount-help-text"
                    disabled={creating}
                  />
                  <p id="goalAmount-help-text" className="text-xs text-gray-400" role="definition">
                    Cantidad en dólares estadounidenses que deseas recaudar
                  </p>
                </div>

                {/* Fecha Límite */}
                <div className="space-y-2">
                  <Label htmlFor="deadline" aria-describedby="deadline-help-text">
                    Fecha Límite <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    min={minDate}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    aria-required="true"
                    aria-describedby="deadline-help-text"
                    disabled={creating}
                  />
                  <p id="deadline-help-text" className="text-xs text-gray-400" role="definition">
                    Fecha límite para alcanzar tu meta de financiamiento
                  </p>
                </div>
              </div>

              {/* Video ID (Opcional) */}
              <div className="space-y-2">
                <Label htmlFor="videoId" aria-describedby="videoId-help-text">
                  ID del Video (Opcional)
                </Label>
                <Input
                  id="videoId"
                  type="text"
                  placeholder="Si has subido un pitch video, pega su ID aquí"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  disabled={creating}
                  aria-describedby="videoId-help-text"
                />
                <p id="videoId-help-text" className="text-xs text-gray-400" role="definition">
                  Puedes subir un video primero en /upload y luego pegar su ID aquí
                </p>
              </div>

              {/* Recompensas */}
              <div className="space-y-4" role="group" aria-labelledby="rewards-label">
                <div className="flex justify-between items-center">
                  <Label id="rewards-label" className="text-lg">Recompensas</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addReward}
                    disabled={creating}
                    aria-label="Agregar nueva recompensa"
                  >
                    <span aria-hidden="true">+</span> Agregar Recompensa
                  </Button>
                </div>

                {rewards.length === 0 ? (
                  <div role="status" aria-live="polite">
                    <p className="text-sm text-gray-300 text-center py-4">
                      Agrega recompensas para incentivar a los backers
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4" role="list" aria-label="Lista de recompensas">
                    {rewards.map((reward, index) => (
                      <Card key={reward.id} role="listitem" aria-label={`Recompensa ${index + 1}`}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">
                              Recompensa #{index + 1}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeReward(reward.id)}
                              disabled={creating}
                              aria-label={`Eliminar recompensa ${index + 1}`}
                            >
                              <span aria-hidden="true">✕</span>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor={`reward-title-${reward.id}`} aria-describedby={`reward-title-${reward.id}-help`}>
                                Título
                              </Label>
                              <Input
                                id={`reward-title-${reward.id}`}
                                type="text"
                                placeholder="Ej: Agradecimiento en Créditos"
                                value={reward.title}
                                onChange={(e) =>
                                  updateReward(reward.id, 'title', e.target.value)
                                }
                                disabled={creating}
                                aria-describedby={`reward-title-${reward.id}-help`}
                              />
                              <p id={`reward-title-${reward.id}-help`} className="text-xs text-gray-400" role="definition">
                                Título de la recompensa que verán los backers
                              </p>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`reward-amount-${reward.id}`} aria-describedby={`reward-amount-${reward.id}-help`}>
                                Monto ($)
                              </Label>
                              <Input
                                id={`reward-amount-${reward.id}`}
                                type="number"
                                min="1"
                                placeholder="10"
                                value={reward.amount || ''}
                                onChange={(e) =>
                                  updateReward(
                                    reward.id,
                                    'amount',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                disabled={creating}
                                aria-describedby={`reward-amount-${reward.id}-help`}
                              />
                              <p id={`reward-amount-${reward.id}-help`} className="text-xs text-gray-400" role="definition">
                                Cantidad en dólares que el backer debe pagar para recibir esta recompensa
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`reward-description-${reward.id}`} aria-describedby={`reward-description-${reward.id}-help`}>
                              Descripción
                            </Label>
                            <Textarea
                              id={`reward-description-${reward.id}`}
                              placeholder="Describe qué recibirá el backer..."
                              value={reward.description}
                              onChange={(e) =>
                                updateReward(reward.id, 'description', e.target.value)
                              }
                              disabled={creating}
                              rows={2}
                              aria-describedby={`reward-description-${reward.id}-help`}
                            />
                            <p id={`reward-description-${reward.id}-help`} className="text-xs text-gray-400" role="definition">
                              Descripción detallada de qué recibirá el backer a cambio
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`reward-limit-${reward.id}`} aria-describedby={`reward-limit-${reward.id}-help`}>
                              Límite (Opcional)
                            </Label>
                            <Input
                              id={`reward-limit-${reward.id}`}
                              type="number"
                              min="1"
                              placeholder="Sin límite"
                              value={reward.limit || ''}
                              onChange={(e) =>
                                updateReward(
                                  reward.id,
                                  'limit',
                                  e.target.value ? parseInt(e.target.value) : null
                                )
                              }
                              disabled={creating}
                              aria-describedby={`reward-limit-${reward.id}-help`}
                            />
                            <p id={`reward-limit-${reward.id}-help`} className="text-xs text-gray-400" role="definition">
                              Número máximo de veces que se puede reclamar esta recompensa (dejar vacío para ilimitado)
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4" role="group" aria-label="Acciones del formulario">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={creating}
                  aria-label="Crear proyecto"
                >
                  {creating ? (
                    <>
                      <span className="animate-spin mr-2" aria-label="Cargando">⏳</span>
                      Creando Proyecto...
                    </>
                  ) : (
                    'Crear Proyecto'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  disabled={creating}
                  aria-label="Cancelar y volver al dashboard"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  )
}
