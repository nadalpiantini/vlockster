'use client'

import Link from 'next/link'
import type { Route } from 'next'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number): string => {
    // Handle basePath with existing query params
    const url = new URL(basePath, 'http://localhost')
    if (page === 1) {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', page.toString())
    }
    // Extract pathname and search
    const path = url.pathname + (url.search ? url.search : '')
    return path
  }

  return (
    <nav
      className="flex justify-center items-center gap-2 mt-8"
      aria-label="Navegación de páginas"
      role="navigation"
    >
      {currentPage === 1 ? (
        <Button
          variant="outline"
          size="sm"
          disabled
          aria-label="Página anterior no disponible"
          aria-disabled="true"
        >
          Anterior
        </Button>
      ) : (
        <Link href={getPageUrl(currentPage - 1) as Route} aria-label="Página anterior">
          <Button variant="outline" size="sm" aria-label="Ir a página anterior">
            Anterior
          </Button>
        </Link>
      )}

      <div className="flex gap-1" role="list">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number
          if (totalPages <= 5) {
            pageNum = i + 1
          } else if (currentPage <= 3) {
            pageNum = i + 1
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i
          } else {
            pageNum = currentPage - 2 + i
          }

          return (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum) as Route}
              aria-label={`Ir a página ${pageNum}`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              <Button
                variant={pageNum === currentPage ? 'default' : 'outline'}
                size="sm"
                aria-label={`Página ${pageNum}${pageNum === currentPage ? ', página actual' : ''}`}
              >
                {pageNum}
              </Button>
            </Link>
          )
        })}
      </div>

      {currentPage === totalPages ? (
        <Button
          variant="outline"
          size="sm"
          disabled
          aria-label="Página siguiente no disponible"
          aria-disabled="true"
        >
          Siguiente
        </Button>
      ) : (
        <Link href={getPageUrl(currentPage + 1) as Route} aria-label="Página siguiente">
          <Button variant="outline" size="sm" aria-label="Ir a página siguiente">
            Siguiente
          </Button>
        </Link>
      )}

      <span className="text-sm text-gray-300 ml-4" aria-live="polite">
        Página {currentPage} de {totalPages}
      </span>
    </nav>
  )
}
