import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MdSecurity, MdLock, MdWarning, MdHome, MdArrowBack } from 'react-icons/md'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export const Route = createFileRoute('/403')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out-cubic',
      once: true,
      mirror: false
    })

    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 300)
    }, 5000)

    return () => clearInterval(glitchInterval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="h-full w-full flex items-center justify-center relative overflow-hidden bg-opacity-100">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="text-9xl font-black opacity-5 select-none transform -rotate-12"
          style={{ 
            fontSize: '40rem',
            color: '#ff7f0e',
            zIndex: 1
          }}
        >
          403
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse opacity-30"
            style={{
              backgroundColor: i % 2 === 0 ? '#ff7f0e' : '#1F3A93',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div 
        className="absolute pointer-events-none w-96 h-96 rounded-full opacity-5 transition-all duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(255,127,14,0.2) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div className="max-w-lg w-full space-y-8 text-center relative z-10 px-6">
        <div className="relative" data-aos="zoom-in-up" data-aos-delay="100">
          <div 
            className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 ${glitchActive ? 'animate-pulse' : ''}`}
            style={{ 
              backgroundColor: '#ff7f0e',
              boxShadow: '0 0 50px rgba(255,127,14,0.5), inset 0 0 50px rgba(255,255,255,0.1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-spin-slow"></div>
            <MdSecurity 
              className={`w-24 h-24 text-white relative z-10 transition-all duration-300 ${glitchActive ? 'animate-bounce' : 'animate-pulse'}`}
              style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}
            />
          </div>

          {/* Orbiting elements */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ 
                  backgroundColor: '#1F3A93',
                  boxShadow: '0 0 20px rgba(31,58,147,0.5)'
                }}
                data-aos="fade-down" 
                data-aos-delay="500"
              >
                <MdLock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ 
                  backgroundColor: '#ff7f0e',
                  boxShadow: '0 0 20px rgba(255,127,14,0.5)'
                }}
                data-aos="fade-up" 
                data-aos-delay="700"
              >
                <MdWarning className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 animate-ping">
            <div className="w-full h-full rounded-full border-2 border-orange-500 opacity-20"></div>
          </div>
          <div className="absolute inset-0 animate-ping" style={{ animationDelay: '1s' }}>
            <div className="w-full h-full rounded-full border-2 border-blue-500 opacity-20"></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h1 
              className={`text-8xl font-black relative transition-all duration-300 ${glitchActive ? 'animate-pulse' : ''}`}
              style={{ 
                color: '#1F3A93',
                textShadow: '0 0 30px rgba(31,58,147,0.5)'
              }}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              403
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </h1>
            <h2 
              className="text-4xl font-bold"
              style={{ 
                color: '#ff7f0e',
                textShadow: '0 0 20px rgba(255,127,14,0.5)'
              }}
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Akses Ditolak
            </h2>
            <p className="text-gray-600 text-xl font-medium" data-aos="fade-up" data-aos-delay="500">
              Halaman yang Anda cari tidak dapat diakses
            </p>
          </div>

          <Alert 
            className="border-2 backdrop-blur-sm relative overflow-hidden" 
            style={{ 
              borderColor: "#ff7f0e",
              background: 'rgba(255,127,14,0.1)',
              boxShadow: '0 8px 32px rgba(255,127,14,0.2)'
            }}
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-shimmer"></div>
            <MdWarning className="h-5 w-5 relative z-10" style={{ color: "#ff7f0e" }} />
            <AlertDescription className="text-left text-gray-700 relative z-10">
              <strong className="text-orange-600">Peringatan:</strong> Anda tidak memiliki izin untuk mengakses halaman ini. 
              Silakan hubungi administrator atau kembali ke halaman utama.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="700">
            <button
              className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl transform"
              style={{ 
                backgroundColor: '#1F3A93',
                boxShadow: '0 8px 32px rgba(31,58,147,0.3)'
              }}
              onClick={() => navigate({ to: '/dashboard/bid-resos'})}
              data-aos="fade-right"
              data-aos-delay="800"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <MdArrowBack className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Kembali</span>
            </button>
            
            <button
              className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl transform"
              style={{ 
                backgroundColor: '#ff7f0e',
                boxShadow: '0 8px 32px rgba(255,127,14,0.3)'
              }}
              onClick={() => navigate({ to: '/home' })}
              data-aos="fade-left"
              data-aos-delay="900"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <MdHome className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Beranda</span>
            </button>
          </div>
        </div>

        {/* floating decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { top: '15%', left: '10%', size: 'w-6 h-6', delay: '1000', color: '#ff7f0e' },
            { top: '25%', right: '15%', size: 'w-3 h-3', delay: '1200', color: '#1F3A93' },
            { bottom: '30%', left: '20%', size: 'w-4 h-4', delay: '1400', color: '#ff7f0e' },
            { bottom: '15%', right: '10%', size: 'w-5 h-5', delay: '1600', color: '#1F3A93' },
            { top: '50%', left: '5%', size: 'w-2 h-2', delay: '1800', color: '#ff7f0e' },
            { top: '60%', right: '5%', size: 'w-3 h-3', delay: '2000', color: '#1F3A93' }
          ].map((dot, index) => (
            <div
              key={index}
              className={`absolute ${dot.size} rounded-full animate-ping`}
              style={{
                backgroundColor: dot.color,
                boxShadow: `0 0 20px ${dot.color}`,
                ...Object.fromEntries(
                  Object.entries(dot).filter(([key]) => ['top', 'bottom', 'left', 'right'].includes(key))
                )
              }}
              data-aos="fade-in"
              data-aos-delay={dot.delay}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}