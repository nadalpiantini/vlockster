import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/Pagination'
import { Users, MessageCircle, TrendingUp } from 'lucide-react'
import { CommunityCategory } from '@/components/CommunityCategory'
import type { Database } from '@/types/database.types'

type Community = Database['public']['Tables']['communities']['Row']
type CommunityWithStats = Community & { view_count: number }

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const COMMUNITIES_PER_PAGE = 12

async function getCommunities(page: number = 1) {
  const supabase = await createClient()
  const from = (page - 1) * COMMUNITIES_PER_PAGE
  const to = from + COMMUNITIES_PER_PAGE - 1

  const { data: communities, error, count } = await supabase
    .from('communities')
    .select(`
      id,
      name,
      description,
      slug,
      is_private,
      member_count,
      post_count,
      created_at
    `, { count: 'exact' })
    .eq('is_private', false)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    return { communities: [], total: 0, totalPages: 0, currentPage: page }
  }

  // Para cada comunidad, obtener conteo de vistas (simulado por ahora)
  const communitiesWithStats = (communities || []).map((community: Community) => ({
    ...community,
    view_count: Math.floor(Math.random() * 1000) + 100 // Simulated view count
  }))

  return {
    communities: communitiesWithStats as CommunityWithStats[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / COMMUNITIES_PER_PAGE),
    currentPage: page,
  }
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const { communities, total, totalPages, currentPage } = await getCommunities(page)

  // Type assertion for type safety
  const communitiesWithStats = communities as CommunityWithStats[]

  return (
    <div className="min-h-screen bg-vlockster-black text-vlockster-white">
      <main
        id="main-content"
        className="container mx-auto px-4"
        role="main"
        aria-label="Comunidades"
      >
        {/* Hero Header */}
        <div className="py-12 border-b border-vlockster-gray">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-vlockster-red flex items-center justify-center">
                  <Users className="w-6 h-6 text-vlockster-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-vlockster-white">
                    Comunidad
                  </h1>
                  <p className="text-vlockster-gray-text">
                    Únete a conversaciones sobre cine independiente
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-vlockster-gray-text">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-vlockster-red" />
                  <span>{total} comunidades activas</span>
                </div>
              </div>
            </div>

            <Link href="/dashboard" aria-label="Volver al dashboard">
              <Button
                variant="outline"
                className="border-vlockster-gray hover:bg-vlockster-gray-dark"
              >
                Back
              </Button>
            </Link>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="py-12 max-w-4xl mx-auto">
          {communities.length === 0 ? (
            <div className="bg-vlockster-gray-dark rounded-lg p-12 text-center">
              <Users className="w-16 h-16 text-vlockster-gray-text mx-auto mb-4" />
              <p className="text-vlockster-white-soft text-lg mb-2">
                No communities created yet
              </p>
              <p className="text-sm text-vlockster-gray-text">
                Creators will launch discussion spaces soon
              </p>
            </div>
          ) : (
            <>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                role="list"
                aria-label="Lista de comunidades"
              >
                {communitiesWithStats.map((community: CommunityWithStats) => (
                  <CommunityCategory
                    key={community.id}
                    id={community.slug}
                    name={community.name}
                    description={community.description || 'No description'}
                    postCount={community.post_count || 0}
                    memberCount={community.member_count || 0}
                    viewCount={community.view_count}
                    isPrivate={community.is_private || false}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/community"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
