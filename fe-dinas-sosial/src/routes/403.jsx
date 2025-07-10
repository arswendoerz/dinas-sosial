import { createFileRoute } from '@tanstack/react-router'
import { MdSecurity, MdLock, MdWarning, MdHome, MdArrowBack } from 'react-icons/md'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const Route = createFileRoute('/403')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#f6f6f6]" style={{ backgroundColor: "#f6f6f6" }}>
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="relative">
          <div 
            className="w-32 h-32 mx-auto rounded-full flex items-center justify-center animate-pulse"
            style={{ backgroundColor: '#ff7f0e' }}
          >
            <MdSecurity 
              className="w-20 h-20 text-white animate-bounce"
            />
          </div>

          <div className="absolute -top-2 -right-2 animate-bounce delay-300">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#1f77b4' }}
            >
              <MdLock className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="absolute -bottom-2 -left-2 animate-bounce delay-700">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#ff7f0e' }}
            >
              <MdWarning className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 
              className="text-6xl font-bold animate-pulse"
              style={{ color: '#1f77b4' }}
            >
              403
            </h1>
            <h2 
              className="text-3xl font-semibold"
              style={{ color: '#ff7f0e' }}
            >
              Akses Ditolak
            </h2>
            <p className="text-gray-600 text-lg">
              Halaman yang Anda cari tidak dapat diakses
            </p>
          </div>

          <Alert className="border-2 animate-pulse" style={{ borderColor: "#ff7f0e" }}>
            <MdWarning className="h-4 w-4" style={{ color: "#ff7f0e" }} />
            <AlertDescription className="text-left">
              <strong>Peringatan:</strong> Anda tidak memiliki izin untuk mengakses halaman ini. 
              Silakan hubungi administrator atau kembali ke halaman utama.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
              style={{ backgroundColor: '#1f77b4' }}
              onClick={() => window.history.back()}
            >
              <MdArrowBack className="w-4 h-4" />
              Kembali
            </button>
            
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
              style={{ backgroundColor: '#ff7f0e' }}
              onClick={() => window.location.href = '/home  '}
            >
              <MdHome className="w-4 h-4" />
              Beranda
            </button>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-20 left-10 w-4 h-4 rounded-full animate-ping"
            style={{ backgroundColor: '#ff7f0e' }}
          />
          <div 
            className="absolute top-40 right-20 w-2 h-2 rounded-full animate-ping delay-500"
            style={{ backgroundColor: '#1f77b4' }}
          />
          <div 
            className="absolute bottom-32 left-20 w-3 h-3 rounded-full animate-ping delay-1000"
            style={{ backgroundColor: '#ff7f0e' }}
          />
          <div 
            className="absolute bottom-20 right-10 w-2 h-2 rounded-full animate-ping delay-700"
            style={{ backgroundColor: '#1f77b4' }}
          />
        </div>
      </div>
    </div>
  )
}