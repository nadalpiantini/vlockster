import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/SearchBar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/Pagination'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto" role="main" aria-label="Proyectos de crowdfunding">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Proyectos en Crowdfunding</h1>
              <p className="text-gray-300">
                Apoya proyectos cinematográficos independientes
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-full md:w-auto max-w-md">
                <SearchBar />
              </div>
              <Link href="/dashboard" aria-label="Volver al dashboard">
                <Button variant="outline" aria-label="Volver al dashboard">Volver</Button>
              </Link>
            </div>
          </div>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-300 mb-4">
                No hay proyectos activos en este momento
              </p>
              <p className="text-sm text-gray-300">
                Los creadores pronto lanzarán nuevas campañas
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Lista de proyectos">
              {projects.map((project) => {
              const progress =
                (Number(project.current_amount) /
                  Number(project.goal_amount)) *
                100
              const daysLeft = project.deadline
                ? Math.ceil(
                    (new Date(project.deadline).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0

              return (
                <Link key={project.id} href={`/projects/${project.id}`} aria-label={`Ver proyecto: ${project.title}`}>
                  <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full" role="listitem">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="line-clamp-2">
                          {project.title}
                        </CardTitle>
                        {project.status === 'funded' && (
                          <span 
                            className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-full"
                            role="status"
                            aria-label="Proyecto financiado exitosamente"
                          >
                            Financiado
                          </span>
                        )}
                      </div>
                      <CardDescription className="line-clamp-3">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso de financiamiento: ${progress.toFixed(0)}%`}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">Progreso</span>
                          <span className="font-semibold" aria-live="polite">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2" role="presentation">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-center" role="group" aria-label="Estadísticas del proyecto">
                        <div>
                          <p className="text-2xl font-bold text-blue-400" aria-label={`Monto recaudado: $${Number(project.current_amount).toLocaleString()}`}>
                            ${Number(project.current_amount).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-300">
                            de ${Number(project.goal_amount).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-400" aria-label={`Días restantes: ${daysLeft}`}>
                            {daysLeft}
                          </p>
                          <p className="text-xs text-gray-300">días restantes</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 text-center">
                        Por: {(project as Project & { creator: Profile | null }).creator?.name || 'Desconocido'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
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
      </main>
    </div>
  )
}
