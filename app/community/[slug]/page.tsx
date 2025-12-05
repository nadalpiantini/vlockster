'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/utils/logger'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Database } from '@/types/database.types'

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

  const loadData = useCallback(async () => {
    try {
      // Cargar usuario
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      setUser(currentUser)

      // Cargar comunidad
      type CommunityRow = Database['public']['Tables']['communities']['Row']
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select('*')
        .eq('slug', slug)
        .single()

      if (communityError || !communityData) {
        router.push('/community')
        return
      }

      setCommunity(communityData as unknown as Community)

      // Cargar posts (optimizado: agregar límite para paginación futura)
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('community_id', (communityData as CommunityRow).id)
        .order('created_at', { ascending: false })
        .limit(50) // Límite para evitar cargar demasiados posts

      if (!postsError && postsData) {
        setPosts(postsData as unknown as Post[])
      } else if (postsError) {
        logger.error('Error loading posts', postsError, {
          communitySlug: slug,
          endpoint: '/community/[slug]',
        })
      }
    } catch (err) {
      logger.error('Error loading community data', err, {
        communitySlug: slug,
        endpoint: '/community/[slug]',
      })
    } finally {
      setLoading(false)
    }
  }, [slug, router, supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

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
          community_id: community.id,
          title: newPostTitle,
          content: newPostContent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error creating post')
      }

      const data = await response.json()

      // Agregar el nuevo post a la lista
      setPosts([data.post, ...posts])

      // Resetear formulario
      setNewPostTitle('')
      setNewPostContent('')
      setShowNewPost(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating post')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!community) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main
        id="main-content"
        className="container mx-auto max-w-4xl"
        role="main"
        aria-label="Comunidad"
      >
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{community.name}</CardTitle>
                <CardDescription>
                  By: {community.profiles?.name || 'Unknown'}
                </CardDescription>
              </div>
              <Link href="/community">
                <Button variant="outline" size="sm">
                  Back
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
              <Button onClick={() => setShowNewPost(true)} className="w-full" aria-label="Crear nuevo post en esta comunidad">
                Create New Post
              </Button>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>New Post</CardTitle>
                </CardHeader>
                <form onSubmit={handleCreatePost} aria-label="Formulario de nuevo post">
                  <CardContent className="space-y-4">
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md text-sm" role="alert" aria-live="assertive" aria-atomic="true">
                        {error}
                      </div>
                    )}
                    <div>
                      <Input
                        type="text"
                        placeholder="Post title"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        required
                        disabled={creating}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Content..."
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
                        aria-label={creating ? 'Publicando post...' : 'Publicar post'}
                      >
                        {creating ? 'Publishing...' : 'Publish'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowNewPost(false)
                          setError(null)
                        }}
                        disabled={creating}
                        aria-label="Cancelar creación de post"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </Card>
            )}
          </div>
        )}

        {/* Posts */}
        <section aria-label="Posts de la comunidad" className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-300" aria-live="polite">
                No posts in this community yet
                {user && <p className="mt-2 text-gray-300">Be the first to post!</p>}
              </CardContent>
            </Card>
          ) : (
            <div role="list" aria-label="Lista de posts">
              {posts.map((post) => (
                <Link key={post.id} href={`/community/post/${post.id}`} aria-label={`Ver post: ${post.title}`}>
                  <Card className="hover:border-blue-500 transition-colors cursor-pointer" role="listitem">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        By: {post.profiles?.name || 'Unknown'} •{' '}
                        {new Date(post.created_at).toLocaleDateString('en-US')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 whitespace-pre-wrap mb-4 line-clamp-3">
                        {post.content}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-300">
                        <span>👍 {post.like_count || 0} likes</span>
                        <span>💬 {post.comment_count || 0} comments</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {!user && (
          <Card className="mt-6">
            <CardContent className="py-6 text-center">
              <p className="text-gray-300 mb-4">
                Sign in to participate in the community
              </p>
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
