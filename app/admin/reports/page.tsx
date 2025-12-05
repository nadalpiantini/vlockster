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
import { AdminReportActions } from '@/components/AdminReportActions'
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const REPORTS_PER_PAGE = 20

type Report = {
  id: string
  content_type: string
  content_id: string
  reason: string | null
  description: string | null
  created_at: string
  status: string
}

async function getReports(page: number = 1) {
  const supabase = await createClient()
  const from = (page - 1) * REPORTS_PER_PAGE
  const to = from + REPORTS_PER_PAGE - 1

  const { data: reports, error, count } = await supabase
    .from('reports')
    .select('*', { count: 'exact' })
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    return { reports: [], total: 0, totalPages: 0, currentPage: page }
  }
  
  return {
    reports: (reports || []) as Report[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / REPORTS_PER_PAGE),
    currentPage: page,
  }
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  await requireRole(['admin'])

  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const { reports, total, totalPages, currentPage } = await getReports(page)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <main id="main-content" className="container mx-auto max-w-6xl" role="main" aria-label="Panel de administración de reportes">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reportes de Contenido</h1>
            <p className="text-gray-300">
              Revisa y modera contenido reportado por usuarios
            </p>
          </div>
          <Link href="/dashboard" aria-label="Volver al dashboard">
            <Button variant="outline">Volver al Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reportes Pendientes</CardTitle>
            <CardDescription aria-live="polite">
              {total} reporte{total !== 1 ? 's' : ''}{' '}
              pendiente{total !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-gray-300 text-center py-8" role="status" aria-label="No hay reportes pendientes">
                No hay reportes pendientes
              </p>
            ) : (
              <>
                <div className="space-y-4" role="list" aria-label="Lista de reportes pendientes">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 border border-gray-700 rounded-lg"
                      role="listitem"
                      aria-label={`Reporte de ${report.content_type} reportado el ${new Date(report.created_at).toLocaleDateString('es-ES')}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold" aria-label={`Tipo de contenido: ${report.content_type}`}>
                            Tipo: {report.content_type}
                          </p>
                          <p className="text-sm text-gray-300" aria-label={`Fecha de reporte: ${new Date(report.created_at).toLocaleDateString('es-ES')}`}>
                            Reportado el:{' '}
                            {new Date(report.created_at).toLocaleDateString(
                              'es-ES'
                            )}
                          </p>
                        </div>
                        <span 
                          className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-1 rounded-full"
                          role="status"
                          aria-label="Estado: Pendiente"
                        >
                          Pendiente
                        </span>
                      </div>
                      {report.reason && (
                        <p className="text-gray-300 mt-2" aria-label={`Razón del reporte: ${report.reason}`}>
                          <strong>Razón:</strong> {report.reason}
                        </p>
                      )}
                      {report.description && (
                        <p className="text-gray-300 mt-2 text-sm" aria-label={`Descripción del reporte: ${report.description}`}>
                          {report.description}
                        </p>
                      )}
                      <div className="mt-4">
                        <AdminReportActions
                          reportId={report.id}
                          contentType={report.content_type}
                          contentId={report.content_id}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/admin/reports"
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

