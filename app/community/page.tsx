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

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getCommunities() {
  const supabase = await createClient()

  // Query simple sin relaciones para evitar errores RLS
  const { data: communities, error } = await supabase
    .from('communities')
    .select('*')
    .eq('is_private', false)
    .order('created_at', { ascending: false })

  if (error) {
    // Log error but don't throw - return empty array instead
    // In production, use logger here
    return []
  }
  return communities || []
}

export default async function CommunityPage() {
  const communities = await getCommunities()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto max-w-4xl" role="main" aria-label="Comunidades">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Comunidades</h1>
            <p className="text-gray-300">
              Únete a discusiones sobre cine independiente
            </p>
          </div>
          <Link href="/dashboard" aria-label="Volver al dashboard">
            <Button variant="outline">Volver</Button>
          </Link>
        </div>

        {communities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-300 mb-4">
                Aún no hay comunidades creadas
              </p>
              <p className="text-sm text-gray-300">
                Los creadores pronto lanzarán espacios de discusión
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4" role="list" aria-label="Lista de comunidades">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={`/community/${community.slug}`}
                aria-label={`Unirse a la comunidad: ${community.name}`}
              >
                <Card className="hover:border-blue-500 transition-colors cursor-pointer" role="listitem">
                  <CardHeader>
                    <CardTitle aria-label={`Comunidad: ${community.name}`}>{community.name}</CardTitle>
                    <CardDescription>
                      <span role="status" aria-label="Comunidad pública">Comunidad pública</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300" aria-label={`Descripción: ${community.description || 'Sin descripción'}`}>
                      {community.description || 'Sin descripción'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
