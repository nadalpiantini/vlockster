import Link from 'next/link'
import Image from 'next/image'

export function DemoHeader() {
  return (
    <header className="bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5" style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/ui-demos" className="flex items-center gap-3 group">
            <Image
              src="/items/vlockster_logo.png"
              alt="VLOCKSTER"
              width={180}
              height={45}
              className="object-contain h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span className="font-display text-2xl font-bold text-white hidden sm:block" style={{ letterSpacing: '-0.01em' }}>
              VLOCKSTER
            </span>
          </Link>
          <Link 
            href="/" 
            className="text-sm text-gray-400 hover:text-white transition-colors font-sans"
          >
            ← Home
          </Link>
        </div>
      </div>
    </header>
  )
}

