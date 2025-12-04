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

  const { data: communities, error } = await (supabase
    .from('communities') as any)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return communities || []
}

export default async function CommunityPage() {
  const communities = await getCommunities()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Comunidades</h1>
            <p className="text-gray-400">
              Únete a discusiones sobre cine independiente
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Volver</Button>
          </Link>
        </div>

        {communities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 mb-4">
                Aún no hay comunidades creadas
              </p>
              <p className="text-sm text-gray-500">
                Los creadores pronto lanzarán espacios de discusión
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {communities.map((community: any) => (
              <Link
                key={community.id}
                href={`/community/${community.slug}`}
              >
                <Card className="hover:border-blue-500 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>{community.name}</CardTitle>
                    <CardDescription>
                      Por: {community.owner?.name || 'Desconocido'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      {community.description || 'Sin descripción'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
