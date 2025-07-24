  import { createFileRoute, useNavigate } from '@tanstack/react-router'
  import { useEffect, useState } from 'react'
  import AOS from 'aos'
  import 'aos/dist/aos.css'

  export const Route = createFileRoute('/403')({
    component: RouteComponent,
  })

  function RouteComponent() {
    const navigate = useNavigate()
    const [glitchActive, setGlitchActive] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

    const handleBackToMenu = () => {
      navigate({ to: '/home' })
    }

    return (  
      <div
        className="h-full w-full flex items-center justify-center bg-opacity-100"
        data-aos="fade"
      >
        <div
          className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col border border-gray-200"
          data-aos="zoom-in"
          data-aos-duration="600"
        >
          <div
            className="relative bg-[#1F3A93] text-white py-3 text-center rounded-t-2xl overflow-hidden"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            <div className="absolute top-0 left-0 w-20 h-20 bg-[#1f77b4] opacity-30 rounded-full -translate-x-1/4 -translate-y-1/2"></div>
            <div className="absolute top-6 left-20 w-6 h-6 bg-[#1f77b4] opacity-40 rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#1f77b4] opacity-20 rounded-full translate-x-1/3 translate-y-1/3"></div>
            <div className="absolute bottom-10 right-16 w-8 h-8 bg-[#1f77b4] opacity-40 rounded-full"></div>

            <div className="relative z-10 mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full">
                <svg
                  className="w-10 h-10 text-[#1F3A93]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.7C16,17.4 15.4,18 14.7,18H9.2C8.6,18 8,17.4 8,16.8V12.8C8,12.1 8.4,11.5 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9 10.2,10V11.5H13.8V10C13.8,9 12.8,8.2 12,8.2Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="px-6 py-8 text-center">
            <div
              className="text-6xl font-bold text-[#1F3A93] mb-2"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              403
            </div>

            <div
              className="text-2xl font-bold text-[#ff7f0e] mb-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Akses Ditolak
            </div>

            <div
              className="text-gray-600 mb-6"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Halaman yang Anda cari tidak dapat diakses
            </div>

            <div
              className="bg-orange-50 border border-orange-200 rounded-lg px-10 py-4 mb-6 ml-10 mr-10"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="text-[#ff7f0e] font-semibold text-sm mb-1">
                <strong>Peringatan</strong>
              </div>
              <div className="text-[#ff7f0e] text-sm">
                Anda tidak memiliki izin untuk mengakses halaman ini. Silakan
                hubungi administrator atau kembali ke halaman utama.
              </div>
            </div>

            <button
              onClick={handleBackToMenu}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              Buka Menu
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }