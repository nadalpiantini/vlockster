import { notFound } from 'next/navigation'
import Link from 'next/link'
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

type ProjectProfile = {
  name: string | null
  public_profile_slug: string | null
  bio: string | null
} | null

async function getProject(id: string) {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !project) return null

  // Fetch creator profile separately
  if (project.creator_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, public_profile_slug, bio')
      .eq('id', project.creator_id)
      .single()

    if (profile) {
      ;(project as any).creator = profile
    }
  }

  return project as typeof project & { creator: ProjectProfile }
}

async function getProjectRewards(projectId: string) {
  const supabase = await createClient()

  const { data: rewards, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('project_id', projectId)
    .order('amount', { ascending: true })

  if (error) return []
  return rewards || []
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
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-3xl">{project.title}</CardTitle>
                  {project.status === 'funded' && (
                    <span className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm">
                      ✓ Financiado
                    </span>
                  )}
                </div>
                <CardDescription>
                  Por: {(project.creator as any)?.name || 'Desconocido'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Video Preview */}
                {project.video_id && (
                  <div className="aspect-video bg-gray-950 mb-6 rounded-lg flex items-center justify-center">
                    <Link href={`/watch/${project.video_id}`}>
                      <Button variant="outline" size="lg">
                        ▶ Ver Video del Proyecto
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
                  <p className="text-gray-400 text-center py-4">
                    Este proyecto aún no tiene recompensas definidas
                  </p>
                ) : (
                  rewards.map((reward) => (
                    <ProjectRewardCard
                      key={reward.id}
                      reward={reward}
                      projectId={project.id}
                      projectStatus={project.status}
                      user={user}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-3xl font-bold text-blue-400">
                    ${Number(project.current_amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    de ${Number(project.goal_amount).toLocaleString()} objetivo
                  </p>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center pt-2">
                  <div>
                    <p className="text-2xl font-bold">{progress.toFixed(0)}%</p>
                    <p className="text-xs text-gray-400">financiado</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.max(0, daysLeft)}</p>
                    <p className="text-xs text-gray-400">días restantes</p>
                  </div>
                </div>

                <ProjectBackingCard
                  projectId={project.id}
                  projectStatus={project.status}
                  goalAmount={Number(project.goal_amount)}
                  user={user}
                />

                {project.status === 'funded' && (
                  <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-lg text-center">
                    <p className="text-green-300 font-semibold">
                      ¡Proyecto Financiado!
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
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
                  <p className="font-semibold text-lg">
                    {project.profiles?.name || 'Desconocido'}
                  </p>
                  {(project.creator as any)?.bio && (
                    <p className="text-sm text-gray-400 mt-2">
                      {(project.creator as any).bio}
                    </p>
                  )}
                </div>
                {(project.creator as any)?.public_profile_slug && (
                  <Link
                    href={`/c/${(project.creator as any).public_profile_slug}`}
                  >
                    <Button className="w-full" variant="outline">
                      Ver Perfil del Creador
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
