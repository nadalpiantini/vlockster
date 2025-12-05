import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad - VLOCKSTER',
  description: 'Política de privacidad y protección de datos de VLOCKSTER',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <main id="main-content" role="main" aria-label="Política de privacidad">
          <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
          <p className="text-gray-300 mb-8">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">1. Información que Recopilamos</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Recopilamos información que nos proporcionas directamente, incluyendo:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Información de cuenta (nombre, email, contraseña)</li>
                <li>Información de perfil (bio, avatar, preferencias)</li>
                <li>Contenido que subes (videos, posts, comentarios)</li>
                <li>Información de transacciones (backings, pagos)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">2. Cómo Usamos tu Información</h2>
            <div className="space-y-4 text-gray-300">
              <p>Usamos tu información para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Procesar transacciones y pagos</li>
                <li>Comunicarnos contigo sobre tu cuenta y servicios</li>
                <li>Enviar notificaciones y actualizaciones</li>
                <li>Analizar el uso de la plataforma para mejoras</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">3. Compartir Información</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                No vendemos tu información personal. Podemos compartir información en
                las siguientes circunstancias:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Con proveedores de servicios que nos ayudan a operar (Supabase, Cloudflare, PayPal)</li>
                <li>Cuando sea requerido por ley o para proteger nuestros derechos</li>
                <li>Con tu consentimiento explícito</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">4. Tus Derechos (GDPR/CCPA)</h2>
            <div className="space-y-4 text-gray-300">
              <p>Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Acceso:</strong> Solicitar una copia de tus datos personales
                </li>
                <li>
                  <strong>Rectificación:</strong> Corregir información incorrecta
                </li>
                <li>
                  <strong>Eliminación:</strong> Solicitar la eliminación de tu cuenta y datos
                </li>
                <li>
                  <strong>Portabilidad:</strong> Exportar tus datos en formato estructurado
                </li>
                <li>
                  <strong>Oposición:</strong> Oponerte al procesamiento de tus datos
                </li>
              </ul>
              <p className="mt-4">
                Puedes ejercer estos derechos contactándonos a través de la plataforma
                o visitando{' '}
                <Link href="/dashboard" className="text-blue-400 hover:underline" as="/dashboard">
                  Dashboard
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">5. Cookies y Tecnologías Similares</h2>
            <p className="text-gray-300 leading-relaxed">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia,
              analizar el uso de la plataforma y personalizar contenido. Puedes gestionar
              tus preferencias de cookies en la configuración de tu navegador.
            </p>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">6. Seguridad</h2>
            <p className="text-gray-300 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger
              tu información. Sin embargo, ningún método de transmisión por internet es
              100% seguro.
            </p>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">7. Retención de Datos</h2>
            <p className="text-gray-300 leading-relaxed">
              Conservamos tu información mientras tu cuenta esté activa o según sea
              necesario para proporcionar servicios. Puedes solicitar la eliminación
              de tu cuenta en cualquier momento.
            </p>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">8. Cambios a esta Política</h2>
            <p className="text-gray-300 leading-relaxed">
              Podemos actualizar esta política ocasionalmente. Te notificaremos de
              cambios significativos. La fecha de &quot;Última actualización&quot; indica cuándo
              se revisó por última vez.
            </p>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">9. Contacto</h2>
            <p className="text-gray-300 leading-relaxed">
              Si tienes preguntas sobre esta política de privacidad o sobre cómo
              manejamos tus datos, contáctanos a través de nuestro sistema de soporte.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 transition"
              aria-label="Volver al inicio"
            >
              ← Volver al inicio
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}

