import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, type UserProfile } from '@/lib/utils/role-check'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BrandHeader } from '@/components/BrandHeader'
import { RecommendationsSection } from '@/components/RecommendationsSection'
import { CreatorAnalytics } from '@/components/CreatorAnalytics'
import { NotificationsBell } from '@/components/NotificationsBell'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  // Auth check: Redirects to login if authentication is enabled
  // if (!user) {
  //   redirect('/login')
  // }

  // Si no hay usuario, usar valores por defecto
  const userProfile = (user || {
    name: 'Invitado',
    email: 'guest@vlockster.com',
    role: 'viewer',
  }) as UserProfile
  const isCreator = ['creator', 'admin'].includes(userProfile.role)
  const isAdmin = userProfile.role === 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation Header */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <BrandHeader />
          <NotificationsBell />
        </div>
      </nav>

      <main id="main-content" className="container mx-auto px-4 py-8" role="main" aria-label="Dashboard principal">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenido, {userProfile.name || userProfile.email || 'Invitado'}
          </h1>
          <p className="text-gray-300">
            Rol: <span className="capitalize">{userProfile.role || 'viewer'}</span>
            {!user && (
              <span className="ml-2 text-yellow-400 text-sm">
                (Modo invitado - Login deshabilitado temporalmente)
              </span>
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <section aria-labelledby="quick-actions-heading" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <h2 id="quick-actions-heading" className="sr-only">Acciones rápidas</h2>
          <Card>
            <CardHeader>
              <CardTitle>Explore Content</CardTitle>
              <CardDescription>
                Discover independent films and series
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/watch" aria-label="Ir al catálogo de videos">
                <Button className="w-full">Go to Catalog</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Fund film projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/projects" aria-label="Ver proyectos de crowdfunding">
                <Button className="w-full">View Projects</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community</CardTitle>
              <CardDescription>
                Participate in discussions and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/community" aria-label="Ir a comunidades">
                <Button className="w-full">Go to Community</Button>
              </Link>
            </CardContent>
          </Card>

          {!isCreator && (
            <Card>
              <CardHeader>
                <CardTitle>Are You a Creator?</CardTitle>
                <CardDescription>
                  Request creator access to upload content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/apply" aria-label="Solicitar acceso como creador">
                  <Button className="w-full" variant="outline">
                    Request Access
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {isCreator && (
            <>
              <Card>
                <CardHeader>
              <CardTitle>Upload Video</CardTitle>
              <CardDescription>
                Share your content with the community
              </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/upload" aria-label="Subir nuevo video">
                    <Button className="w-full">Upload Content</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Create Project</CardTitle>
                  <CardDescription>
                    Launch a crowdfunding campaign
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/projects/create" aria-label="Crear nuevo proyecto de crowdfunding">
                    <Button className="w-full">New Project</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Projects</CardTitle>
                  <CardDescription>
                    Manage your active campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/projects/my" aria-label="Ver mis proyectos de crowdfunding">
                    <Button className="w-full" variant="outline">
                      View My Projects
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Statistics for your videos and projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/my-analytics" aria-label="Ver analytics detallados">
                    <Button className="w-full" variant="outline">
                      View Analytics
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {isAdmin && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Creator Requests</CardTitle>
                  <CardDescription>
                    Approve or reject requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/requests" aria-label="Panel de administración - Solicitudes de creators">
                    <Button className="w-full" variant="destructive">
                      Admin Panel
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage users and roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/users" aria-label="Gestionar usuarios y roles">
                    <Button className="w-full" variant="destructive">
                      Manage Users
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    Review reported content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/reports" aria-label="Ver reportes de moderación">
                    <Button className="w-full" variant="destructive">
                      View Reports
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </section>

        {/* Recommendations Section */}
        <section className="mb-8" aria-labelledby="recommendations-heading">
          <RecommendationsSection />
        </section>

        {/* Analytics for Creators */}
        {isCreator && (
          <section className="mb-8" aria-labelledby="analytics-heading">
            <CreatorAnalytics />
          </section>
        )}

        {/* Recent Activity */}
        <section aria-labelledby="recent-activity-heading">
          <Card>
            <CardHeader>
              <CardTitle id="recent-activity-heading">Actividad Reciente</CardTitle>
              <CardDescription>
                Tus últimas interacciones en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center py-8" role="status" aria-live="polite" aria-atomic="true">
                No hay actividad reciente para mostrar
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
