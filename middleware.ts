import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // No usar Supabase aquí. Edge runtime no soporta Supabase JS.
  // Next 15 + Supabase recomienda NO autenticar desde middleware.
  // La autenticación se maneja en Server Components y Route Handlers.
  return NextResponse.next()
}

// Opcional: proteger rutas que requieren sesión
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
