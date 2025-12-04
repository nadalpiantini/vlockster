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

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const userProfile = user as UserProfile
  const isCreator = ['creator', 'admin'].includes(userProfile.role)
  const isAdmin = userProfile.role === 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenido, {userProfile.name || userProfile.email}
          </h1>
          <p className="text-gray-400">
            Rol: <span className="capitalize">{userProfile.role}</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Explorar Contenido</CardTitle>
              <CardDescription>
                Descubre películas y series independientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/watch">
                <Button className="w-full">Ir al Catálogo</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proyectos</CardTitle>
              <CardDescription>
                Financia proyectos cinematográficos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/projects">
                <Button className="w-full">Ver Proyectos</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comunidad</CardTitle>
              <CardDescription>
                Participa en discusiones y eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/community">
                <Button className="w-full">Ir a Comunidad</Button>
              </Link>
            </CardContent>
          </Card>

          {!isCreator && (
            <Card>
              <CardHeader>
                <CardTitle>¿Eres Creador?</CardTitle>
                <CardDescription>
                  Solicita acceso como creator para subir contenido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/apply">
                  <Button className="w-full" variant="outline">
                    Solicitar Acceso
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {isCreator && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Subir Video</CardTitle>
                  <CardDescription>
                    Comparte tu contenido con la comunidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/upload">
                    <Button className="w-full">Subir Contenido</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crear Proyecto</CardTitle>
                  <CardDescription>
                    Lanza una campaña de crowdfunding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/projects/create">
                    <Button className="w-full">Nuevo Proyecto</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mis Proyectos</CardTitle>
                  <CardDescription>
                    Gestiona tus campañas activas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/projects/my">
                    <Button className="w-full" variant="outline">
                      Ver Mis Proyectos
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
                  <CardTitle>Solicitudes de Creators</CardTitle>
                  <CardDescription>
                    Aprobar o rechazar solicitudes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/requests">
                    <Button className="w-full" variant="destructive">
                      Panel Admin
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>
                    Administrar usuarios y roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/users">
                    <Button className="w-full" variant="destructive">
                      Gestionar Usuarios
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reportes</CardTitle>
                  <CardDescription>
                    Revisar contenido reportado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/reports">
                    <Button className="w-full" variant="destructive">
                      Ver Reportes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Tus últimas interacciones en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center py-8">
              No hay actividad reciente para mostrar
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
