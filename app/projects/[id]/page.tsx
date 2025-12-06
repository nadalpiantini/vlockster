import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Route } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/utils/role-check'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProjectRewardCard } from '@/components/ProjectRewardCard'
import { ProjectBackingCard } from '@/components/ProjectBackingCard'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type ProjectProfile = {
  name: string | null
  public_profile_slug: string | null
  bio: string | null
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto max-w-6xl" role="main" aria-label={`Proyecto: ${project.title}`}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6" role="article" aria-labelledby="project-title">
            {/* Project Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle id="project-title" className="text-3xl" aria-label={`Título del proyecto: ${project.title}`}>{project.title}</CardTitle>
                  {project.status === 'funded' && (
                    <span 
                      className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm"
                      role="status"
                      aria-label="Proyecto financiado exitosamente"
                    >
                      ✓ Financiado
                    </span>
                  )}
                </div>
                <CardDescription aria-label={`Creador: ${project.creator?.name || 'Desconocido'}`}>
                  Por: {project.creator?.name || 'Desconocido'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Video Preview */}
                {project.video_id && (
                  <div className="aspect-video bg-gray-950 mb-6 rounded-lg flex items-center justify-center">
                    <Link href={`/watch/${project.video_id}`} aria-label="Ver video del proyecto">
                      <Button variant="outline" size="lg" aria-label="Ver video del proyecto">
                        <span aria-hidden="true">▶</span> Ver Video del Proyecto
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Sobre este proyecto
                  </h3>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card>
              <CardHeader>
                <CardTitle>Recompensas</CardTitle>
                <CardDescription>
                  Apoya el proyecto y recibe recompensas exclusivas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rewards.length === 0 ? (
                  <p className="text-gray-300 text-center py-4" aria-live="polite">
                    Este proyecto aún no tiene recompensas definidas
                  </p>
                ) : (
                  rewards.map((reward: Reward) => (
                    <ProjectRewardCard
                      key={reward.id}
                      reward={reward}
                      projectId={project.id}
                      projectStatus={project.status}
                      user={user ? { id: user.id, email: user.email || '', name: user.name, role: user.role as 'viewer' | 'creator' | 'moderator' | 'admin' } : null}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6" role="complementary" aria-label="Información de financiamiento">
            {/* Progress Card */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div role="group" aria-label="Monto recaudado">
                  <p className="text-3xl font-bold text-blue-400" aria-label={`Monto recaudado: $${Number(project.current_amount).toLocaleString()}`}>
                    ${Number(project.current_amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-300" aria-label={`Meta: $${Number(project.goal_amount).toLocaleString()}`}>
                    de ${Number(project.goal_amount).toLocaleString()} objetivo
                  </p>
                </div>

                <div 
                  className="w-full bg-gray-700 rounded-full h-3" 
                  role="progressbar" 
                  aria-valuenow={progress} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                  aria-label={`Progreso de financiamiento: ${progress.toFixed(0)}%`}
                >
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                    aria-hidden="true"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center pt-2" role="group" aria-label="Estadísticas del proyecto">
                  <div>
                    <p className="text-2xl font-bold" aria-label={`Porcentaje financiado: ${progress.toFixed(0)}%`}>{progress.toFixed(0)}%</p>
                    <p className="text-xs text-gray-300">financiado</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" aria-label={`Días restantes: ${Math.max(0, daysLeft)}`}>{Math.max(0, daysLeft)}</p>
                    <p className="text-xs text-gray-300">días restantes</p>
                  </div>
                </div>

                <ProjectBackingCard
                  projectId={project.id}
                  projectStatus={project.status}
                  goalAmount={Number(project.goal_amount)}
                  user={user ? { id: user.id, email: user.email || '', name: user.name, role: user.role as 'viewer' | 'creator' | 'moderator' | 'admin' } : null}
                />

                {project.status === 'funded' && (
                  <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-lg text-center" role="status" aria-label="Proyecto financiado exitosamente">
                    <p className="text-green-300 font-semibold">
                      ¡Proyecto Financiado!
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      Este proyecto alcanzó su meta
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Creator Card */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre el Creador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-lg" aria-label={`Creador: ${project.creator?.name || 'Desconocido'}`}>
                    {project.creator?.name || 'Desconocido'}
                  </p>
                  {project.creator?.bio && (
                    <p className="text-sm text-gray-300 mt-2" aria-label={`Biografía: ${project.creator.bio}`}>
                      {project.creator.bio}
                    </p>
                  )}
                </div>
                {project.creator?.public_profile_slug && (
                  <Link 
                    href={`/c/${project.creator.public_profile_slug}` as Route}
                    aria-label={`Ver perfil de ${project.creator?.name || 'creador'}`}
                  >
                    <Button className="w-full" variant="outline" aria-label={`Ver perfil del creador ${project.creator.name || ''}`}>
                      Ver Perfil del Creador
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
