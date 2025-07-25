import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { MdSecurity } from 'react-icons/md'
import AOS from 'aos'
import 'aos/dist/aos.css'

export const Route = createFileRoute('/403')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
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

  const handleBackToMenu = () => {
    navigate({ to: '/home' })
  }

  return (  
    <div
      className="h-full w-full flex items-center justify-center bg-opacity-100"
      data-aos="fade"
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col border border-gray-200 relative overflow-visible"
        data-aos="zoom-in"
        data-aos-duration="600"
      >
        
        {/* Header */}
        <div
          className="relative bg-[#1F3A93] text-white py-12 text-center rounded-t-2xl overflow-hidden"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <div className="absolute top-0 left-0 w-20 h-20 bg-[#1f77b4] opacity-30 rounded-full -translate-x-1/4 -translate-y-1/2"></div>
          <div className="absolute top-6 left-20 w-6 h-6 bg-[#1f77b4] opacity-40 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#1f77b4] opacity-20 rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute bottom-10 right-16 w-8 h-8 bg-[#1f77b4] opacity-40 rounded-full"></div>
        </div>

        <div className="absolute -top-8  left-1/2 transform -translate-x-1/2 z-20">
          <div className="inline-flex items-center justify-center w-40 h-40 bg-[#1F3A93] rounded-full border-8 border-white shadow-lg">
            <MdSecurity 
              className={`w-24 h-24 text-white transition-all duration-300 ${
                glitchActive ? 'scale-110 rotate-3' : ''
              }`}
            />
          </div>
        </div>

        {/* Content Body  */}
        <div className="px-6 py-8 pt-16 text-center">
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