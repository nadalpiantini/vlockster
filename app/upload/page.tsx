'use client'

import { useState, useCallback } from 'react'
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

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile)
        if (!title) {
          setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''))
        }
      } else {
        setError('Por favor selecciona un archivo de video válido')
      }
    }
  }, [title])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Por favor selecciona un archivo')
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('visibility', visibility)

      // Simular progreso (en producción usarías XMLHttpRequest para progreso real)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al subir video')
      }

      const data = await response.json()

      // Redirigir al video subido
      setTimeout(() => {
        router.push(`/watch/${data.video.id}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir video')
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto max-w-3xl" role="main" aria-label="Subir nuevo video">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Subir Nuevo Video</CardTitle>
            <CardDescription>
              Comparte tu contenido con la comunidad de VLOCKSTER
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} aria-label="Formulario de subida de video">
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md text-sm" role="alert" aria-live="polite">
                  {error}
                </div>
              )}

              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                role="button"
                tabIndex={0}
                aria-label="Zona de arrastrar y soltar archivo de video"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    document.getElementById('file-upload')?.click()
                  }
                }}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Seleccionar archivo de video"
                />
                <div className="space-y-2">
                  {file ? (
                    <>
                      <p className="text-green-400 font-semibold">
                        ✓ {file.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl">📹</p>
                      <p className="font-semibold">
                        Arrastra tu video aquí o haz clic para seleccionar
                      </p>
                      <p className="text-sm text-gray-400">
                        Formatos soportados: MP4, MOV, AVI
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso de subida: ${progress}%`}>
                  <div className="flex justify-between text-sm">
                    <span>Subiendo...</span>
                    <span aria-live="polite">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2" role="presentation">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Título <span className="text-red-500" aria-label="Campo requerido">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Título del video"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={uploading}
                  aria-describedby="title-description"
                  aria-invalid={false}
                />
                <span id="title-description" className="sr-only">Ingresa un título descriptivo para tu video</span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={uploading}
                  rows={4}
                  aria-describedby="description-description"
                />
                <span id="description-description" className="sr-only">Opcional: Describe el contenido de tu video</span>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibilidad</Label>
                <select
                  id="visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  disabled={uploading}
                  aria-describedby="visibility-description"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onKeyDown={(e) => {
                    // Allow Escape to blur the select
                    if (e.key === 'Escape') {
                      ;(e.target as HTMLSelectElement).blur()
                    }
                  }}
                >
                  <option value="public">Público</option>
                  <option value="members">Solo Miembros</option>
                  <option value="backers">Solo Backers</option>
                </select>
                <p id="visibility-description" className="text-xs text-gray-400" role="status" aria-live="polite">
                  {visibility === 'public' && 'Visible para todos'}
                  {visibility === 'members' && 'Solo usuarios registrados'}
                  {visibility === 'backers' &&
                    'Solo para quienes han respaldado tus proyectos'}
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!file || !title || uploading}
                  aria-label={uploading ? 'Subiendo video...' : 'Subir video'}
                >
                  {uploading ? 'Subiendo...' : 'Subir Video'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  disabled={uploading}
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
