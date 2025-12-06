'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/utils/logger'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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

interface Comment {
  id: string
  content: string
  created_at: string
  like_count: number
  parent_comment_id: string | null
  profiles: {
    name: string
    avatar_url: string | null
  }
}

export default function PostDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const loadData = useCallback(async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      setUser(currentUser)

      // Cargar post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(
          `
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `
        )
        .eq('id', id)
        .single()

      if (postError || !postData) {
        router.push('/community')
        return
      }

      setPost(postData as unknown as Post)

      // Cargar comentarios
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(
          `
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `
        )
        .eq('post_id', id)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: true })

      if (!commentsError && commentsData) {
        setComments(commentsData as unknown as Comment[])
      } else if (commentsError) {
        logger.error('Error loading comments', commentsError, {
          postId: id,
          endpoint: '/community/post/[id]',
        })
      }
    } catch (err) {
      logger.error('Error loading post data', err, {
        postId: id,
        endpoint: '/community/post/[id]',
      })
    } finally {
      setLoading(false)
    }
  }, [id, router, supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleCreateComment(e: React.FormEvent) {
    e.preventDefault()
    if (!post || !user || !newComment.trim()) return

    setCreating(true)
    setError(null)

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post.id,
          content: newComment,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error creating comment')
      }

      const data = await response.json()
      setComments([...comments, data.comment])
      setNewComment('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating comment')
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

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto max-w-4xl" role="main" aria-label="Post de comunidad">
        <Link href="/community">
          <Button variant="outline" className="mb-6">
            ← Back to Communities
          </Button>
        </Link>

        {/* Post */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <CardDescription>
              By: {post.profiles?.name || 'Unknown'} •{' '}
              {new Date(post.created_at).toLocaleDateString('en-US')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 whitespace-pre-wrap mb-4">
              {post.content}
            </p>
            <div className="flex gap-4 text-sm text-gray-300">
              <span>👍 {post.like_count || 0} likes</span>
              <span>💬 {post.comment_count || 0} comments</span>
            </div>
          </CardContent>
        </Card>

        {/* Create Comment */}
        {user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Write Comment</CardTitle>
            </CardHeader>
            <form onSubmit={handleCreateComment}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <Textarea
                  placeholder="Write your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  disabled={creating}
                  rows={4}
                />
                <Button type="submit" disabled={!newComment.trim() || creating}>
                  {creating ? 'Publishing...' : 'Publish Comment'}
                </Button>
              </CardContent>
            </form>
          </Card>
        )}

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Comments ({comments.length})
          </h2>
          {comments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-300">
                No comments yet
                {user && <p className="mt-2 text-gray-300">Be the first to comment!</p>}
              </CardContent>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader>
                  <CardDescription>
                    {comment.profiles?.name || 'Unknown'} •{' '}
                    {new Date(comment.created_at).toLocaleDateString('en-US')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  <div className="mt-2 text-sm text-gray-300">
                    👍 {comment.like_count || 0} likes
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {!user && (
          <Card className="mt-6">
            <CardContent className="py-6 text-center">
              <p className="text-gray-300 mb-4">
                Sign in to comment
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

