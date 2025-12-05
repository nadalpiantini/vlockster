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
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  // Fetch profiles separately to avoid relationship ambiguity
  if (!requests || requests.length === 0) {
    return []
  }

  const userIds = [...new Set(requests.map((r) => r.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email')
    .in('id', userIds)

  const profileMap = new Map(
    (profiles || []).map((p) => [p.id, { name: p.name, email: p.email }])
  )

  return requests.map((request) => ({
    ...request,
    profiles: profileMap.get(request.user_id) || null,
  })) as Array<{
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
      <main id="main-content" className="container mx-auto max-w-6xl" role="main" aria-label="Panel de administración de solicitudes de creators">
        <h1 className="text-3xl font-bold mb-8">Solicitudes de Creators</h1>

        {/* Solicitudes Pendientes */}
        <section className="mb-8" aria-labelledby="pending-heading">
          <h2 id="pending-heading" className="text-2xl font-semibold mb-4" aria-live="polite">
            Pendientes ({pendingRequests.length})
          </h2>
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-400" role="status" aria-label="No hay solicitudes pendientes">
                No hay solicitudes pendientes
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4" role="list" aria-label="Lista de solicitudes pendientes">
              {pendingRequests.map((request) => (
                <Card key={request.id} role="listitem" aria-label={`Solicitud: ${request.pitch_title} de ${request.profiles?.name || 'N/A'}`}>
                  <CardHeader>
                    <CardTitle aria-label={`Título del pitch: ${request.pitch_title}`}>{request.pitch_title}</CardTitle>
                    <CardDescription aria-label={`Solicitante: ${request.profiles?.name || 'N/A'}, Email: ${request.profiles?.email || 'N/A'}`}>
                      Solicitante: {request.profiles?.name || 'N/A'} (
                      {request.profiles?.email})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Pitch:</h4>
                        <p className="text-gray-300 whitespace-pre-wrap" aria-label={`Contenido del pitch: ${request.pitch_text}`}>
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
                          aria-label={`Portfolio del solicitante: ${request.portfolio_url || 'No disponible'}`}
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
        </section>

        {/* Solicitudes Revisadas */}
        <section aria-labelledby="reviewed-heading">
          <h2 id="reviewed-heading" className="text-2xl font-semibold mb-4" aria-live="polite">
            Historial ({reviewedRequests.length})
          </h2>
          {reviewedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-400" role="status" aria-label="No hay solicitudes revisadas">
                No hay solicitudes revisadas
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4" role="list" aria-label="Lista de solicitudes revisadas">
              {reviewedRequests.map((request) => (
                <Card key={request.id} role="listitem" aria-label={`Solicitud ${request.status === 'approved' ? 'aprobada' : 'rechazada'}: ${request.pitch_title}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span aria-label={`Título: ${request.pitch_title}`}>{request.pitch_title}</span>
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          request.status === 'approved'
                            ? 'bg-green-900/50 text-green-300'
                            : 'bg-red-900/50 text-red-300'
                        }`}
                        role="status"
                        aria-label={`Estado: ${request.status === 'approved' ? 'Aprobada' : 'Rechazada'}`}
                      >
                        {request.status === 'approved'
                          ? 'Aprobada'
                          : 'Rechazada'}
                      </span>
                    </CardTitle>
                    <CardDescription aria-label={`Solicitante: ${request.profiles?.name || 'N/A'}`}>
                      Solicitante: {request.profiles?.name || 'N/A'}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
