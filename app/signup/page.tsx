'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      if (data.user) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error signing up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* StreamLab Style Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,0,0,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,53,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,0,0,0.03)_50%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5" role="navigation" aria-label="Navegación principal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3 group" aria-label="VLOCKSTER - Ir al inicio">
              <div className="relative w-10 h-10">
                <Image
                  src="/items/vlockster_logo.jpeg"
                  alt="VLOCKSTER Logo"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                VLOCKSTER
              </span>
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Iniciar sesión"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content" className="w-full max-w-md relative z-10 mt-20" role="main" aria-label="Crear cuenta">
        <Card className="glass-card shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16">
                <Image
                  src="/vlockster_logo.png"
                  alt="VLOCKSTER Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass-card rounded-full mb-2">
              <Sparkles className="w-4 h-4 text-[#FF0000]" aria-hidden="true" />
              <span className="text-sm text-gray-300">Join the community</span>
            </div>
            <CardTitle className="text-3xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Join VLOCKSTER and discover the best independent cinema
            </CardDescription>
          </CardHeader>
          <form 
            onSubmit={handleSignup} 
            aria-label="Formulario de registro"
            onKeyDown={(e) => {
              // Allow Escape to clear form or navigate away
              if (e.key === 'Escape' && !loading) {
                setName('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setError(null)
              }
            }}
          >
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm" role="alert" aria-live="assertive" aria-atomic="true">
                  {error}
                </div>
              )}
              {loading && (
                <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
                  Creando cuenta, por favor espera...
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  aria-describedby="name-description"
                  aria-invalid={false}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-[#E50914] focus:ring-[#E50914]"
                />
                <span id="name-description" className="sr-only">Ingresa tu nombre completo</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                  aria-describedby="email-description"
                  aria-invalid={false}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-[#E50914] focus:ring-[#E50914]"
                />
                <span id="email-description" className="sr-only">Ingresa tu dirección de correo electrónico</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  aria-describedby="password-description"
                  aria-invalid={password.length > 0 && password.length < 8}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-[#E50914] focus:ring-[#E50914]"
                />
                <span id="password-description" className="sr-only">La contraseña debe tener al menos 8 caracteres</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  aria-describedby="confirmPassword-description"
                  aria-invalid={confirmPassword.length > 0 && password !== confirmPassword}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-[#E50914] focus:ring-[#E50914]"
                />
                <span id="confirmPassword-description" className="sr-only">Confirma tu contraseña ingresándola nuevamente</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 font-bold"
                disabled={loading}
                aria-label={loading ? 'Creando cuenta...' : 'Crear cuenta'}
                aria-busy={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
              <p className="text-sm text-gray-300 text-center">
                Already have an account?{' '}
                <Link href="/login" className="text-[#FF0000] hover:text-[#FF6B35] font-semibold transition-colors" aria-label="Iniciar sesión">
                  Sign in here
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
