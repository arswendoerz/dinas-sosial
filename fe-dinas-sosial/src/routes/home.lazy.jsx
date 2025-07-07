import { createLazyFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { MdOutlineDashboardCustomize } from 'react-icons/md';
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
    AOS.init({ duration: 800 });
  }, []);

  const sections = [
    {
      title: 'Perencanaan',
      color: '#1f77b4',
      to: '/dashboard/bid-perencanaan',
      icon: <GrPlan size={48} />,
      buttonBg: '#ff7f0e',
    },
    {
      title: 'Rehabilitasi Sosial',
      color: '#ff7f0e',
      to: '/dashboard/bid-resos',
      icon: <FaHandsHelping size={48} />,
      buttonBg: '#1f77b4',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f6f6] px-4 py-10 text-center">
      {/* Header */}
      <div data-aos="fade-down" className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1f77b4] mb-2">
          Selamat Datang, Arswendo!
        </h1>
        <p className="text-gray-700 text-base md:text-lg max-w-xl mx-auto">
          Silakan pilih bagian yang ingin diakses melalui dashboard berikut:
        </p>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 w-full max-w-6xl">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className="flex flex-col justify-between items-center rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white px-6 py-8"
            style={{
              backgroundColor: section.color,
              minHeight: '260px',
            }}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              {section.icon}
              <h3 className="text-lg sm:text-xl font-bold">{section.title}</h3>
              <p className="text-sm sm:text-base opacity-90 ">
                Akses informasi dan kelola data {section.title.toLowerCase()} di sini.
              </p>
            </div>

            <div className="mt-6">
              <Link
                to={section.to}
                className="font-semibold px-6 py-2 rounded-full text-white transition-all duration-200 hover:brightness-90"
                style={{
                  backgroundColor: section.buttonBg,
                }}
              >
                Buka Dashboard
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
