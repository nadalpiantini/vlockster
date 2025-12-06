import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/Pagination'
import { CampaignCard } from '@/components/ui/CampaignCard'
import { Film, TrendingUp } from 'lucide-react'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const PROJECTS_PER_PAGE = 12

type Project = Database['public']['Tables']['projects']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

async function getActiveProjects(page: number = 1) {
  const supabase = await createClient()
  const from = (page - 1) * PROJECTS_PER_PAGE
  const to = from + PROJECTS_PER_PAGE - 1

  const { data: projects, error, count } = await supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .in('status', ['active', 'funded'])
    .order('created_at', { ascending: false })
    .range(from, to)

  // Fetch creator profiles separately if needed
  const projectsArray = (projects || []) as Project[]
  if (projectsArray.length > 0) {
    const creatorIds = [...new Set(projectsArray.map((p) => p.creator_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, public_profile_slug')
      .in('id', creatorIds)

    if (profiles) {
      const profileMap = new Map((profiles as Profile[]).map((p) => [p.id, p]))
      projectsArray.forEach((project) => {
        ;(project as Project & { creator: Profile | null }).creator = profileMap.get(project.creator_id) || null
      })
    }
  }

  if (error) throw error
  return {
    projects: projectsArray,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / PROJECTS_PER_PAGE),
    currentPage: page,
  }
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const { projects, total, totalPages, currentPage } = await getActiveProjects(page)

  return (
    <div className="min-h-screen bg-vlockster-black text-vlockster-white">
      <main
        id="main-content"
        className="container mx-auto px-4"
        role="main"
        aria-label="Proyectos de crowdfunding"
      >
        {/* Hero Header */}
        <div className="py-12 border-b border-vlockster-gray">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-vlockster-red flex items-center justify-center">
                  <Film className="w-6 h-6 text-vlockster-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-vlockster-white">
                    Proyectos
                  </h1>
                  <p className="text-vlockster-gray-text">
                    Apoya proyectos de cine independiente
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-vlockster-gray-text">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-vlockster-green" />
                  <span>{total} proyectos activos</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-auto max-w-md">
                <SearchBar />
              </div>
              <Link href="/dashboard" aria-label="Volver al dashboard">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-vlockster-gray hover:bg-vlockster-gray-dark"
                  aria-label="Back to dashboard"
                >
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="py-12">
          {projects.length === 0 ? (
            <div className="bg-vlockster-gray-dark rounded-lg p-12 text-center">
              <Film className="w-16 h-16 text-vlockster-gray-text mx-auto mb-4" />
              <p className="text-vlockster-white-soft text-lg mb-2">
                No active projects at the moment
              </p>
              <p className="text-sm text-vlockster-gray-text">
                Creators will launch new campaigns soon
              </p>
            </div>
          ) : (
            <>
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                role="list"
                aria-label="Lista de proyectos"
              >
                {projects.map((project) => {
                  const daysLeft = project.deadline
                    ? Math.ceil(
                        (new Date(project.deadline).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 0

                  return (
                    <CampaignCard
                      key={project.id}
                      id={project.id}
                      title={project.title}
                      creator={
                        (project as Project & { creator: Profile | null })
                          .creator?.name || 'Unknown'
                      }
                      thumbnail={
                        '/placeholder-project.jpg'
                      }
                      current={Number(project.current_amount)}
                      goal={Number(project.goal_amount)}
                      backers={project.backers_count || 0}
                      daysLeft={daysLeft}
                      category={project.category || undefined}
                      featured={project.status === 'funded'}
                    />
                  )
                })}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/projects"
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
