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
    if (page === 1) return basePath
    return `${basePath}?page=${page}`
  }

  return (
    <nav
      className="flex justify-center items-center gap-2 mt-8"
      aria-label="Navegación de páginas"
      role="navigation"
    >
      <Link
        href={(currentPage === 1 ? '#' : getPageUrl(currentPage - 1)) as Route}
        aria-label="Página anterior"
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : 0}
        onClick={(e) => {
          if (currentPage === 1) {
            e.preventDefault()
          }
        }}
        onKeyDown={(e) => {
          if (currentPage === 1 && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
          }
        }}
      >
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          aria-label="Ir a página anterior"
        >
          Anterior
        </Button>
      </Link>

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

      <Link
        href={(currentPage === totalPages ? '#' : getPageUrl(currentPage + 1)) as Route}
        aria-label="Página siguiente"
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : 0}
        onClick={(e) => {
          if (currentPage === totalPages) {
            e.preventDefault()
          }
        }}
        onKeyDown={(e) => {
          if (currentPage === totalPages && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
          }
        }}
      >
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          aria-label="Ir a página siguiente"
        >
          Siguiente
        </Button>
      </Link>

      <span className="text-sm text-gray-400 ml-4" aria-live="polite">
        Página {currentPage} de {totalPages}
      </span>
    </nav>
  )
}

