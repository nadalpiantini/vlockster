import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos de Uso - VLOCKSTER',
  description: 'Términos y condiciones de uso de la plataforma VLOCKSTER',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <main role="main">
          <h1 className="text-4xl font-bold mb-8">Términos de Uso</h1>
          <p className="text-gray-400 mb-8">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">1. Aceptación de los Términos</h2>
            <p className="text-gray-300 leading-relaxed">
              Al acceder y utilizar VLOCKSTER, aceptas cumplir con estos Términos de Uso.
              Si no estás de acuerdo con alguna parte de estos términos, no debes usar
              nuestra plataforma.
            </p>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">2. Uso de la Plataforma</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                VLOCKSTER es una plataforma que permite a los usuarios ver contenido de
                streaming, financiar proyectos de crowdfunding y participar en comunidades.
              </p>
              <p>
                Te comprometes a usar la plataforma de manera legal y ética, respetando
                los derechos de otros usuarios y creadores.
              </p>
            </div>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">3. Contenido del Usuario</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Eres responsable del contenido que subes a la plataforma. Asegúrate de
                tener todos los derechos necesarios sobre el contenido que compartes.
              </p>
              <p>
                No debes subir contenido que sea ilegal, difamatorio, acosador, o que
                viole los derechos de propiedad intelectual de terceros.
              </p>
            </div>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">4. Pagos y Reembolsos</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Los pagos realizados a través de la plataforma son procesados por PayPal.
                Los términos de reembolso dependen de cada proyecto individual y se
                especifican en la página del proyecto.
              </p>
              <p>
                VLOCKSTER no garantiza el éxito de ningún proyecto de crowdfunding.
              </p>
            </div>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">5. Propiedad Intelectual</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Todo el contenido de la plataforma, incluyendo pero no limitado a
                textos, gráficos, logos, y software, es propiedad de VLOCKSTER o sus
                licenciantes.
              </p>
              <p>
                El contenido subido por usuarios sigue siendo propiedad de los usuarios,
                pero otorgas a VLOCKSTER una licencia para usar, mostrar y distribuir
                dicho contenido en la plataforma.
              </p>
            </div>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">6. Limitación de Responsabilidad</h2>
            <p className="text-gray-300 leading-relaxed">
              VLOCKSTER se proporciona &quot;tal cual&quot; sin garantías de ningún tipo. No nos
              hacemos responsables de daños directos, indirectos, incidentales o
              consecuentes resultantes del uso de la plataforma.
            </p>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">7. Modificaciones</h2>
            <p className="text-gray-300 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Te notificaremos de cambios significativos. El uso continuado de la
              plataforma después de los cambios constituye tu aceptación de los nuevos
              términos.
            </p>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">8. Contacto</h2>
            <p className="text-gray-300 leading-relaxed">
              Si tienes preguntas sobre estos términos, puedes contactarnos a través de
              nuestro sistema de soporte en la plataforma.
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

