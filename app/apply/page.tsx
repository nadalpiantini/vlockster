'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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

export default function ApplyPage() {
  const [pitchTitle, setPitchTitle] = useState('')
  const [pitchText, setPitchText] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Always open - allow application without auth
      // if (!user) {
      //   throw new Error('You must sign in to request creator access.')
      // }

      // Verificar si ya existe una solicitud pendiente
      const { data: existingRequest } = await supabase
        .from('creator_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single()

      if (existingRequest) {
        throw new Error('Ya tienes una solicitud pendiente de revisión')
      }

      // Crear la solicitud
      const { error: insertError } = await supabase
        .from('creator_requests')
        .insert({
          user_id: user.id,
          pitch_title: pitchTitle,
          pitch_text: pitchText,
          portfolio_url: portfolioUrl,
          status: 'pending',
        })

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar solicitud')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-green-500">
              ✓ Solicitud Enviada
            </CardTitle>
            <CardDescription>
              Tu solicitud ha sido enviada correctamente. El equipo de VLOCKSTER
              la revisará pronto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Serás redirigido al dashboard en unos segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto max-w-2xl" role="main" aria-label="Solicitar acceso de creator">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Solicitar Acceso de Creator</CardTitle>
            <CardDescription>
              Comparte tu visión y experiencia para unirte como creador en
              VLOCKSTER
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md text-sm" role="alert" aria-live="assertive" aria-atomic="true">
                  {error}
                </div>
              )}
              {loading && (
                <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
                  Enviando solicitud, por favor espera...
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="pitchTitle">
                  Título de tu Pitch <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pitchTitle"
                  type="text"
                  placeholder="Ej: Cineasta independiente con 5 años de experiencia"
                  value={pitchTitle}
                  onChange={(e) => setPitchTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pitchText">
                  Cuéntanos sobre ti <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="pitchText"
                  placeholder="¿Quién eres? ¿Qué tipo de contenido creas? ¿Por qué quieres unirte a VLOCKSTER?"
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  required
                  disabled={loading}
                  rows={8}
                />
                <p className="text-sm text-gray-300">
                  Describe tu experiencia, estilo cinematográfico, y qué te hace
                  único como creador.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioUrl">
                  Portfolio / Website <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="portfolioUrl"
                  type="url"
                  placeholder="https://tu-portfolio.com"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-sm text-gray-300">
                  Comparte un enlace a tu portfolio, Vimeo, YouTube, o sitio web
                  profesional.
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Proceso de Revisión</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Tu solicitud será revisada por nuestro equipo</li>
                  <li>• Recibirás una notificación con la decisión</li>
                  <li>• El proceso suele tomar 2-3 días hábiles</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                aria-label={loading ? 'Enviando solicitud de acceso como creator...' : 'Enviar solicitud de acceso como creator'}
                aria-busy={loading}
              >
                {loading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
              </Button>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  )
}
