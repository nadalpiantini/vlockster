import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

async function getActiveProjects() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select(
      `
      *,
      profiles:creator_id (
        name,
        public_profile_slug
      )
    `
    )
    .in('status', ['active', 'funded'])
    .order('created_at', { ascending: false })

  if (error) throw error
  return projects || []
}

export default async function ProjectsPage() {
  const projects = await getActiveProjects()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Proyectos en Crowdfunding</h1>
            <p className="text-gray-400">
              Apoya proyectos cinematográficos independientes
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Volver</Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 mb-4">
                No hay proyectos activos en este momento
              </p>
              <p className="text-sm text-gray-500">
                Los creadores pronto lanzarán nuevas campañas
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="line-clamp-2">
                          {project.title}
                        </CardTitle>
                        {project.status === 'funded' && (
                          <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-full">
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
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progreso</span>
                          <span className="font-semibold">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-400">
                            ${Number(project.current_amount).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            de ${Number(project.goal_amount).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-400">
                            {daysLeft}
                          </p>
                          <p className="text-xs text-gray-400">días restantes</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 text-center">
                        Por: {(project.profiles as any)?.name || 'Desconocido'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
