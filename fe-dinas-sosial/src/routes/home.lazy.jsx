import { createLazyFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { FaHandsHelping } from "react-icons/fa";
import { GrPlan } from 'react-icons/gr';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Route = createLazyFileRoute('/home')({
  component: Home,
});

function Home() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const sections = [
    {
      title: 'Perencanaan',
      color: '#1f77b4',
      to: '/dashboard/bid-perencanaan',
      icon: <GrPlan size={40} />,
      buttonBg: '#ff7f0e',
      description: 'Kelola data perencanaan',
    },
    {
      title: 'Rehabilitasi Sosial',
      color: '#ff7f0e',
      to: '/dashboard/bid-resos',
      icon: <FaHandsHelping size={40} />,
      buttonBg: '#1f77b4',
      description: 'Kelola data rehabilitasi sosial',
    },
  ];

  return (
    <div className="h-full w-full bg-[#f6f6f6] flex flex-col items-center justify-center">
      <div data-aos="fade-down" className="text-center mb-4">
        <img 
          src="/lampung.png" 
          alt="Logo Lampung" 
          className="w-40 h-40 md:w-40 md:h-40 mx-auto mb-2 object-contain"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Selamat Datang, <span className="text-[#1f77b4]">Arswendo!</span>
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-[#1f77b4] to-[#ff7f0e] mx-auto mb-4 rounded-full"></div>
        <p className="text-gray-700 text-base max-w-xl mx-auto leading-relaxed">
          Pilih dashboard yang ingin Anda akses untuk mengelola data dengan mudah
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-4">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            data-aos="fade-up"
            data-aos-delay={index * 150}
          >
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: section.color
              }}
            ></div>

            <div className="relative z-10 p-6 text-white text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-white/30 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  {section.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">{section.title}</h3>
              <p className="text-white mb-6 text-sm">
                {section.description}
              </p>

              <Link
                to={section.to}
                className="inline-flex items-center px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                style={{
                  backgroundColor: section.buttonBg,
                }}
              >
                Buka Dashboard
                <svg 
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
}