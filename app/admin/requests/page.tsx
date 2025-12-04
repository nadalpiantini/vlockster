import { requireRole } from '@/lib/utils/role-check'
import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AdminRequestActions } from '@/components/AdminRequestActions'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getCreatorRequests() {
  const supabase = await createClient()

  const { data: requests, error } = await supabase
    .from('creator_requests')
    .select(
      `
      *,
      profiles:user_id (
        name,
        email
      )
    `
    )
    .order('created_at', { ascending: false })

  if (error) throw error
  return (requests || []) as Array<{
    id: string
    user_id: string
    pitch_title: string
    pitch_text: string
    portfolio_url: string | null
    status: string
    created_at: string
    reviewed_by: string | null
    reviewed_at: string | null
    rejection_reason: string | null
    profiles: { name: string; email: string } | null
  }>
}


export default async function AdminRequestsPage() {
  await requireRole(['admin'])
  const requests = await getCreatorRequests()

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const reviewedRequests = requests.filter((r) => r.status !== 'pending')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Solicitudes de Creators</h1>

        {/* Solicitudes Pendientes */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Pendientes ({pendingRequests.length})
          </h2>
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-400">
                No hay solicitudes pendientes
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <CardTitle>{request.pitch_title}</CardTitle>
                    <CardDescription>
                      Solicitante: {(request.profiles as any)?.name || 'N/A'} (
                      {(request.profiles as any)?.email})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Pitch:</h4>
                        <p className="text-gray-300 whitespace-pre-wrap">
                          {request.pitch_text}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Portfolio:</h4>
                        <a
                          href={request.portfolio_url || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {request.portfolio_url}
                        </a>
                      </div>
                      <AdminRequestActions requestId={request.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Solicitudes Revisadas */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Historial ({reviewedRequests.length})
          </h2>
          {reviewedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-400">
                No hay solicitudes revisadas
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviewedRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{request.pitch_title}</span>
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          request.status === 'approved'
                            ? 'bg-green-900/50 text-green-300'
                            : 'bg-red-900/50 text-red-300'
                        }`}
                      >
                        {request.status === 'approved'
                          ? 'Aprobada'
                          : 'Rechazada'}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Solicitante: {(request.profiles as any)?.name || 'N/A'}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
