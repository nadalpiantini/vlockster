import Link from 'next/link'
import { getCurrentUser, type UserProfile } from '@/lib/utils/role-check'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getMyProjects(userId: string) {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return (projects || []) as Database['public']['Tables']['projects']['Row'][]
}

export default async function MyProjectsPage() {
  const user = await getCurrentUser()

  // Always open - use mock admin user if no real user
  const userProfile = (user || {
    id: 'mock-admin',
    email: 'admin@vlockster.test',
    name: 'Admin User',
    role: 'admin',
  }) as UserProfile

  // Everything is open - no role restrictions
  const projects = await getMyProjects(userProfile.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto max-w-6xl" role="main" aria-label="Mis proyectos de crowdfunding">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mis Proyectos</h1>
            <p className="text-gray-300">
              Gestiona tus campañas de crowdfunding
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/projects/create" aria-label="Crear nuevo proyecto de crowdfunding">
              <Button aria-label="Crear nuevo proyecto de crowdfunding">Nuevo Proyecto</Button>
            </Link>
            <Link href="/dashboard" aria-label="Volver al dashboard">
              <Button variant="outline" aria-label="Volver al dashboard">Volver</Button>
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-300 mb-4">
                Aún no has creado ningún proyecto
              </p>
              <Link href="/projects/create" aria-label="Crear mi primer proyecto de crowdfunding">
                <Button aria-label="Crear mi primer proyecto de crowdfunding">Crear Mi Primer Proyecto</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: Database['public']['Tables']['projects']['Row']) => {
              const progress =
                (Number(project.current_amount) /
                  Number(project.goal_amount)) *
                100

              return (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.id}`}
                  aria-label={`Ver proyecto: ${project.title}`}
                >
                  <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="line-clamp-2">
                          {project.title}
                        </CardTitle>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            project.status === 'active'
                              ? 'bg-green-900/50 text-green-300'
                              : project.status === 'funded'
                                ? 'bg-blue-900/50 text-blue-300'
                                : project.status === 'completed'
                                  ? 'bg-gray-700 text-gray-300'
                                  : 'bg-yellow-900/50 text-yellow-300'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <CardDescription className="line-clamp-3">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">Progreso</span>
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

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-400">
                            ${Number(project.current_amount).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-300">
                            de ${Number(project.goal_amount).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-400">
                            {project.backers_count || 0}
                          </p>
                          <p className="text-xs text-gray-300">backers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

