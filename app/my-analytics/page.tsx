import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/utils/role-check'
import { CreatorAnalytics } from '@/components/CreatorAnalytics'
import { BrandHeader } from '@/components/BrandHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function MyAnalyticsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const isCreator = ['creator', 'admin'].includes(user.role)

  if (!isCreator) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation Header */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <BrandHeader />
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <main id="main-content" className="container mx-auto px-4 py-8" role="main">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mis Analytics</h1>
          <p className="text-gray-400">
            Estadísticas detalladas de tus videos, proyectos y engagement
          </p>
        </div>

        <CreatorAnalytics />
      </main>
    </div>
  )
}
