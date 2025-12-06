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
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const REQUESTS_PER_PAGE = 10

type RequestWithProfile = {
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
}

async function getCreatorRequests(page: number = 1, status: 'pending' | 'reviewed' = 'pending') {
  const supabase = await createClient()
  const from = (page - 1) * REQUESTS_PER_PAGE
  const to = from + REQUESTS_PER_PAGE - 1

  let query = supabase
    .from('creator_requests')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status === 'pending') {
    query = query.eq('status', 'pending')
  } else {
    query = query.neq('status', 'pending')
  }

  const { data: requests, error, count } = await query

  if (error) {
    return { requests: [], total: 0, totalPages: 0, currentPage: page, error }
  }

  // Fetch profiles separately to avoid relationship ambiguity
  if (!requests || requests.length === 0) {
    return { requests: [], total: count || 0, totalPages: 0, currentPage: page }
  }

  const userIds = [...new Set(requests.map((r) => r.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email')
    .in('id', userIds)

  const profileMap = new Map(
    (profiles || []).map((p) => [p.id, { name: p.name, email: p.email }])
  )

  const requestsWithProfiles = requests.map((request) => ({
    ...request,
    profiles: profileMap.get(request.user_id) || null,
  })) as RequestWithProfile[]

  return {
    requests: requestsWithProfiles,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / REQUESTS_PER_PAGE),
    currentPage: page,
    error: null,
  }
}

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  await requireRole(['admin'])
  
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const status = (params.status as 'pending' | 'reviewed') || 'pending'
  
  const { requests, total, totalPages, currentPage, error } = await getCreatorRequests(page, status)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto max-w-6xl" role="main" aria-label="Panel de administración de solicitudes de creators">
        <h1 className="text-3xl font-bold mb-8">Solicitudes de Creators</h1>

        {error && (
          <Card className="mb-6" role="alert" aria-live="assertive">
            <CardContent className="py-4 text-red-200">
              Hubo un problema al cargar solicitudes. Intenta recargar la página.
            </CardContent>
          </Card>
        )}

        {status === 'pending' ? (
          <section className="mb-8" aria-labelledby="pending-heading">
            <h2 id="pending-heading" className="text-2xl font-semibold mb-4" aria-live="polite">
              Pendientes ({total})
            </h2>
            {requests.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-300" role="status" aria-label="No hay solicitudes pendientes">
                  No hay solicitudes pendientes
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4" role="list" aria-label="Lista de solicitudes pendientes">
                  {requests.map((request) => (
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
                            {request.portfolio_url ? (
                              <a
                                href={request.portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                                aria-label={`Portfolio del solicitante: ${request.portfolio_url}`}
                              >
                                {request.portfolio_url}
                              </a>
                            ) : (
                              <p className="text-gray-400" aria-label="Portfolio no disponible">
                                No disponible
                              </p>
                            )}
                          </div>
                          <AdminRequestActions requestId={request.id} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={`/admin/requests?status=${status}`}
                  />
                )}
              </>
            )}
          </section>
        ) : (
          <section aria-labelledby="reviewed-heading">
            <h2 id="reviewed-heading" className="text-2xl font-semibold mb-4" aria-live="polite">
              Historial ({total})
            </h2>
            {requests.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-300" role="status" aria-label="No hay solicitudes revisadas">
                  No hay solicitudes revisadas
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4" role="list" aria-label="Lista de solicitudes revisadas">
                  {requests.map((request) => (
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
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={`/admin/requests?status=${status}`}
                  />
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
