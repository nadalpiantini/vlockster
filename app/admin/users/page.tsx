import { requireRole } from '@/lib/utils/role-check'
import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type UserProfile = {
  id: string
  email: string
  name: string | null
  role: 'viewer' | 'creator' | 'moderator' | 'admin'
  created_at: string
}

async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return (users || []) as UserProfile[]
}

export default async function AdminUsersPage() {
  await requireRole(['admin'])

  const users = await getAllUsers()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Usuarios</h1>
            <p className="text-gray-400">
              Administra usuarios y roles de la plataforma
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Volver al Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios Registrados</CardTitle>
            <CardDescription>
              Total: {users.length} usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No hay usuarios registrados
              </p>
            ) : (
              <div className="space-y-4">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-4 border border-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{u.name || u.email}</p>
                      <p className="text-sm text-gray-400">{u.email}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        Rol: {u.role}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-red-900/50 text-red-300'
                            : u.role === 'creator'
                              ? 'bg-blue-900/50 text-blue-300'
                              : u.role === 'moderator'
                                ? 'bg-yellow-900/50 text-yellow-300'
                                : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

