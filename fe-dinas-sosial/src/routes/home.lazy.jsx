import { createLazyFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { GrPlan } from "react-icons/gr";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const Route = createLazyFileRoute("/home")({
  component: Home,
});

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9000/api/user/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        } else {
          setError(data.message || 'Gagal mengambil data profil');
        }
      } else {
        if (response.status === 401) {
          setError('Sesi telah berakhir. Silakan login kembali.');
        } else {
          setError('Gagal mengambil data profil');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Koneksi ke server gagal');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: "Perencanaan",
      color: "#1F3A93",
      to: "/dashboard/bid-perencanaan",
      icon: <GrPlan size={48} />,
      buttonBg: "#ff7f0e",
      description: "Kelola data perencanaan",
    },
    {
      title: "Rehabilitasi Sosial",
      color: "#ff7f0e",
      to: "/dashboard/bid-resos",
      icon: <FaHandsHelping size={48} />,
      buttonBg: "#1F3A93",
      description: "Kelola data rehabilitasi sosial",
    },
  ];

  const getDisplayName = () => {
    if (!user) return "User";
    return user.name || user.email?.split('@')[0] || "User";
  };

  if (loading) {
    return (
      <div className="h-full w-full bg-[#f6f6f6] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1F3A93] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-opacity-100 flex flex-col items-center justify-center overflow-hidden">
      <div data-aos="fade-down" className="mb-4 px-4 text-center">
        <img
          src="/lampung.png"
          alt="Logo Lampung"
          className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-2 object-contain"
        />
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
          Selamat Datang, <span className="text-[#1F3A93]">{getDisplayName()}!</span>
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg mb-2 max-w-sm mx-auto text-sm">
            <p>{error}</p>
          </div>
        )}

        <div className="w-16 h-1 bg-gradient-to-r from-[#1F3A93] to-[#ff7f0e] mx-auto mb-2 rounded-full"></div>
        <p className="text-gray-700 text-sm md:text-base max-w-md mx-auto leading-snug">
          Silakan pilih bagian yang ingin diakses melalui dashboard berikut:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl px-4">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className="flex flex-col justify-between items-center rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white px-4 py-5 sm:px-6 sm:py-6 relative overflow-hidden"
            style={{
              backgroundColor: section.color,
            }}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-2 bg-white/30 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                {section.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold">{section.title}</h3>
              <p className="text-xs sm:text-sm opacity-90">
                {section.description}
              </p>
            </div>
            <div className="mt-4">
              <Link
                to={section.to}
                className="inline-flex items-center px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-sm"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
          </div>
        ))}
      </div>
    </div>
  );
}