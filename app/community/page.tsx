import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/Pagination'
import { Users, MessageCircle, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const COMMUNITIES_PER_PAGE = 12

async function getCommunities(page: number = 1) {
  const supabase = await createClient()
  const from = (page - 1) * COMMUNITIES_PER_PAGE
  const to = from + COMMUNITIES_PER_PAGE - 1

  const { data: communities, error, count } = await supabase
    .from('communities')
    .select('*', { count: 'exact' })
    .eq('is_private', false)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    return { communities: [], total: 0, totalPages: 0, currentPage: page }
  }
  
  return {
    communities: communities || [],
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
                className="space-y-4"
                role="list"
                aria-label="Lista de comunidades"
              >
                {communities.map((community) => (
                  <Link
                    key={community.id}
                    href={`/community/${community.slug}`}
                    aria-label={`Unirse a la comunidad: ${community.name}`}
                  >
                    <div
                      className="bg-vlockster-gray-dark rounded-lg p-6 hover:ring-2 hover:ring-vlockster-red transition-all cursor-pointer"
                      role="listitem"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-vlockster-gray flex items-center justify-center">
                              <Users className="w-5 h-5 text-vlockster-red" />
                            </div>
                            <div>
                              <h3
                                className="text-xl font-bold text-vlockster-white"
                                aria-label={`Comunidad: ${community.name}`}
                              >
                                {community.name}
                              </h3>
                              <span
                                className="text-xs text-vlockster-gray-text"
                                role="status"
                                aria-label="Public community"
                              >
                                Public community
                              </span>
                            </div>
                          </div>
                          <p
                            className="text-vlockster-white-soft mt-3"
                            aria-label={`Descripción: ${community.description || 'Sin descripción'}`}
                          >
                            {community.description || 'No description'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-vlockster-gray-text">
                          <MessageCircle className="w-4 h-4" />
                          <TrendingUp className="w-4 h-4 text-vlockster-green" />
                        </div>
                      </div>
                    </div>
                  </Link>
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
