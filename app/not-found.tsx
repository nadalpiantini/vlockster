import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>404 - Página no encontrada</CardTitle>
          <CardDescription>
            La página que buscas no existe o ha sido movida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button className="w-full">Volver al inicio</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

