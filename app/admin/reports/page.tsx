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

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Report = {
  id: string
  content_type: string
  content_id: string
  reason: string | null
  description: string | null
  created_at: string
  status: string
}

async function getReports(): Promise<Report[]> {
  const supabase = await createClient()

  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) return []
  return (reports || []) as Report[]
}

export default async function AdminReportsPage() {
  await requireRole(['admin'])

  const reports = await getReports()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reportes de Contenido</h1>
            <p className="text-gray-400">
              Revisa y modera contenido reportado por usuarios
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Volver al Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reportes Pendientes</CardTitle>
            <CardDescription>
              {reports.length} reporte{reports.length !== 1 ? 's' : ''}{' '}
              pendiente{reports.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No hay reportes pendientes
              </p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border border-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">
                          Tipo: {report.content_type}
                        </p>
                        <p className="text-sm text-gray-400">
                          Reportado el:{' '}
                          {new Date(report.created_at).toLocaleDateString(
                            'es-ES'
                          )}
                        </p>
                      </div>
                      <span className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-1 rounded-full">
                        Pendiente
                      </span>
                    </div>
                    {report.reason && (
                      <p className="text-gray-300 mt-2">
                        <strong>Razón:</strong> {report.reason}
                      </p>
                    )}
                    {report.description && (
                      <p className="text-gray-400 mt-2 text-sm">
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

