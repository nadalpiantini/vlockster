import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Route } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/utils/role-check'
import { Button } from '@/components/ui/button'
import { RewardTier } from '@/components/RewardTier'
import { Calendar, Target, Users, User, Clock, Film } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type ProjectProfile = {
  name: string | null
  public_profile_slug: string | null
  bio: string | null
  avatar_url: string | null
} | null

type ProjectRow = Database['public']['Tables']['projects']['Row']

async function getProject(id: string) {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !project) return null

  const projectTyped = project as ProjectRow

  // Fetch creator profile separately
  if (projectTyped.creator_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, public_profile_slug, bio')
      .eq('id', projectTyped.creator_id)
      .single()

    if (profile) {
      ;(projectTyped as ProjectRow & { creator: ProjectProfile }).creator = profile as ProjectProfile
    }
  }

  return projectTyped as ProjectRow & { creator: ProjectProfile }
}

type Reward = {
  id: string
  title: string
  description: string | null
  amount: number
  limit: number | null
  backers_count: number
  delivery_date: string | null
}

type RewardRow = Database['public']['Tables']['rewards']['Row']

async function getProjectRewards(projectId: string): Promise<Reward[]> {
  const supabase = await createClient()

  const { data: rewards, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('project_id', projectId)
    .order('amount', { ascending: true })

  if (error) return []
  return (rewards || []).map((reward: RewardRow) => ({
    id: reward.id,
    title: reward.title,
    description: reward.description ?? null,
    amount: reward.amount,
    limit: reward.limit_quantity ?? null,
    backers_count: reward.backers_count ?? 0,
    delivery_date: reward.delivery_date ?? null,
  }))
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProject(id)
  const user = await getCurrentUser()

  if (!project) {
    notFound()
  }

  const rewards = await getProjectRewards(id)

  const progress =
    (Number(project.current_amount) / Number(project.goal_amount)) * 100
  const daysLeft = project.deadline
    ? Math.ceil(
        (new Date(project.deadline).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0

  const progressValue = (Number(project.current_amount) / Number(project.goal_amount)) * 100
  const daysLeftValue = project.deadline
    ? Math.ceil(
        (new Date(project.deadline).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8">
      <main id="main-content" className="container mx-auto max-w-6xl px-4" role="main" aria-label={`Proyecto: ${project.title}`}>
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <Link href="/" className="text-red-600 hover:underline">Inicio</Link> /{' '}
          <Link href="/projects" className="text-red-600 hover:underline">Proyectos</Link> /{' '}
          <span className="text-gray-500">{project.title}</span>
        </nav>

        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Banner */}
          <div className="h-48 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
            {project.video_id ? (
              <Link href={`/watch/${project.video_id}`} className="text-white text-center">
                <Film className="w-16 h-16 mx-auto mb-2" />
                <p className="text-xl font-bold">Ver Video del Proyecto</p>
              </Link>
            ) : (
              <div className="text-white text-center">
                <Film className="w-16 h-16 mx-auto mb-2" />
                <p className="text-xl font-bold">{project.title}</p>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <h1 id="project-title" className="text-3xl font-bold text-gray-900 mb-2" aria-label={`Título del proyecto: ${project.title}`}>{project.title}</h1>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>por {project.creator?.name || 'Creador anónimo'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{project.created_at ? format(new Date(project.created_at), 'd MMM yyyy', { locale: es }) : ''}</span>
                  </div>
                </div>
              </div>
              {project.status === 'funded' && (
                <span
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
                  role="status"
                  aria-label="Proyecto financiado exitosamente"
                >
                  ✓ Financiado
                </span>
              )}
            </div>

            {/* Project Description */}
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-b border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">${Number(project.current_amount).toLocaleString()}</div>
                <div className="text-gray-600">Recaudado</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{project.backers_count || 0}</div>
                <div className="text-gray-600">Backers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{daysLeftValue > 0 ? daysLeftValue : 0}</div>
                <div className="text-gray-600">Días restantes</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="py-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Progreso</span>
                <span>{progressValue.toFixed(1)}% de ${Number(project.goal_amount).toLocaleString()}</span>
              </div>
              <div
                className="w-full bg-gray-200 rounded-full h-4"
                role="progressbar"
                aria-valuenow={progressValue}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progreso de financiamiento: ${progressValue.toFixed(1)}%`}
              >
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progressValue, 100)}%` }}
                  aria-hidden="true"
                />
              </div>

              <div className="mt-4">
                <Link href="#rewards" className="block w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-center rounded-lg font-bold text-lg hover:from-red-700 hover:to-red-800 transition-colors">
                  APOYA ESTE PROYECTO
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6" role="article" aria-labelledby="project-title">
            {/* Rewards Section */}
            <section id="rewards" aria-labelledby="rewards-title">
              <h2 id="rewards-title" className="text-2xl font-bold text-gray-900 mb-6">Recompensas</h2>

              {rewards.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-500 text-lg" aria-live="polite">
                    Este proyecto aún no tiene recompensas definidas
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {rewards.map((reward: Reward) => {
                    const limit = reward.limit
                    const remaining = limit ? limit - (reward.backers_count || 0) : null
                    const isSoldOut = limit && (reward.backers_count || 0) >= limit

                    return (
                      <RewardTier
                        key={reward.id}
                        id={reward.id}
                        title={reward.title}
                        description={reward.description || ''}
                        amount={reward.amount}
                        limit={limit || undefined}
                        backersCount={reward.backers_count}
                        deliveryDate={reward.delivery_date ? format(new Date(reward.delivery_date!), 'MMM yyyy', { locale: es }) : undefined}
                        isAvailable={project.status === 'active' && !isSoldOut}
                      />
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6" role="complementary" aria-label="Información de financiamiento">
            {/* Creator Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sobre el Creador</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  {project.creator?.avatar_url ? (
                    <img
                      src={project.creator.avatar_url}
                      alt={project.creator.name || 'Creador'}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{project.creator?.name || 'Creador anónimo'}</p>
                  <p className="text-sm text-gray-500">Creador</p>
                </div>
              </div>
              {project.creator?.bio && (
                <p className="text-gray-600 text-sm" aria-label={`Biografía: ${project.creator.bio}`}>
                  {project.creator.bio}
                </p>
              )}
              {project.creator?.public_profile_slug && (
                <Link
                  href={`/c/${project.creator.public_profile_slug}` as Route}
                  className="block mt-4 w-full py-2 bg-gray-100 text-center rounded hover:bg-gray-200 transition-colors"
                  aria-label={`Ver perfil de ${project.creator?.name || 'creador'}`}
                >
                  Ver Perfil Completo
                </Link>
              )}
            </div>

            {/* Project Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Detalles del Proyecto</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Objetivo</span>
                  <span className="font-semibold">${Number(project.goal_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recaudado</span>
                  <span className="font-semibold">${Number(project.current_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Backers</span>
                  <span className="font-semibold">{project.backers_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoría</span>
                  <span className="font-semibold">{project.category || 'Cine'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha límite</span>
                  <span className="font-semibold">{format(new Date(project.deadline), 'd MMM yyyy', { locale: es })}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
