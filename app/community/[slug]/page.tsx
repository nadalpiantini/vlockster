'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Community {
  id: string
  name: string
  description: string
  slug: string
  owner_id: string
  profiles: {
    name: string
  }
}

interface Post {
  id: string
  title: string
  content: string
  created_at: string
  like_count: number
  comment_count: number
  profiles: {
    name: string
    avatar_url: string | null
  }
}

export default function CommunityDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  type User = {
    id: string
    email?: string
    user_metadata?: {
      name?: string
    }
  } | null

  const [community, setCommunity] = useState<Community | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [slug])

  async function loadData() {
    try {
      // Cargar usuario
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      setUser(currentUser)

      // Cargar comunidad
      const { data: communityData, error: communityError } = await (supabase
        .from('communities') as any)
        .select('*')
        .eq('slug', slug)
        .single()

      if (communityError || !communityData) {
        router.push('/community')
        return
      }

      setCommunity(communityData as Community)

      // Cargar posts
      const { data: postsData, error: postsError } = await (supabase
        .from('posts') as any)
        .select('*')
        .eq('community_id', (communityData as Community).id)
        .order('created_at', { ascending: false })

      if (!postsError && postsData) {
        setPosts(postsData)
      }
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault()
    if (!community || !user) return

    setCreating(true)
    setError(null)

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          community_id: (community as any).id,
          title: newPostTitle,
          content: newPostContent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear post')
      }

      const data = await response.json()

      // Agregar el nuevo post a la lista
      setPosts([data.post, ...posts])

      // Resetear formulario
      setNewPostTitle('')
      setNewPostContent('')
      setShowNewPost(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear post')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!community) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{community.name}</CardTitle>
                <CardDescription>
                  Por: {(community as any).owner?.name || 'Desconocido'}
                </CardDescription>
              </div>
              <Link href="/community">
                <Button variant="outline" size="sm">
                  Volver
                </Button>
              </Link>
            </div>
          </CardHeader>
          {community.description && (
            <CardContent>
              <p className="text-gray-300">{community.description}</p>
            </CardContent>
          )}
        </Card>

        {/* Botón Crear Post */}
        {user && (
          <div className="mb-6">
            {!showNewPost ? (
              <Button onClick={() => setShowNewPost(true)} className="w-full">
                Crear Nuevo Post
              </Button>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Nuevo Post</CardTitle>
                </CardHeader>
                <form onSubmit={handleCreatePost}>
                  <CardContent className="space-y-4">
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    <div>
                      <Input
                        type="text"
                        placeholder="Título del post"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        required
                        disabled={creating}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Contenido..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        required
                        disabled={creating}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={!newPostTitle || !newPostContent || creating}
                      >
                        {creating ? 'Publicando...' : 'Publicar'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowNewPost(false)
                          setError(null)
                        }}
                        disabled={creating}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </Card>
            )}
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-400">
                No hay posts en esta comunidad aún
                {user && <p className="mt-2">¡Sé el primero en publicar!</p>}
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Link key={post.id} href={`/community/post/${post.id}`}>
                <Card className="hover:border-blue-500 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      Por: {post.profiles?.name || 'Desconocido'} •{' '}
                      {new Date(post.created_at).toLocaleDateString('es-ES')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 whitespace-pre-wrap mb-4 line-clamp-3">
                      {post.content}
                    </p>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>👍 {post.like_count || 0} likes</span>
                    <span>💬 {post.comment_count || 0} comentarios</span>
                  </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {!user && (
          <Card className="mt-6">
            <CardContent className="py-6 text-center">
              <p className="text-gray-400 mb-4">
                Inicia sesión para participar en la comunidad
              </p>
              <Link href="/login">
                <Button>Iniciar Sesión</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
