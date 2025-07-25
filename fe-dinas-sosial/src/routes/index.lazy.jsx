import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/lampung.png";
import backgroundImage from "@/assets/dinsos.jpeg";
import motifKanan from "@/assets/motif-kanan.svg";
import motifKiri from "@/assets/motif-kiri.svg";
import AOS from "aos";
import "aos/dist/aos.css";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.refresh();
    AOS.init({ 
      duration: 1000, 
      once: false, 
      delay: 200,
      disable: false 
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden font-sans bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-110 brightness-[0.6] blur-[1px] transition-transform duration-1000"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: "fixed",
        }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-orange-900/30 z-10" />

      {/* Kiri */}
      <div className="absolute left-0 top-0 h-full w-auto z-15">
        <div className="relative h-full w-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/10 to-transparent rounded-r-lg"></div>
          <img
            src={motifKiri}
            alt="Motif Kiri"
            className="relative h-full w-auto object-contain opacity-70 drop-shadow-lg"
          />
        </div>
      </div>

      {/* Kanan */}
      <div className="absolute right-0 top-0 h-full w-auto z-15">
        <div className="relative h-full w-auto">
          <div className="absolute inset-0 bg-gradient-to-l from-white/50 via-white/10 to-transparent rounded-l-lg"></div>
          <img
            src={motifKanan}
            alt="Motif Kanan"
            className="relative h-full w-auto object-contain opacity-70 drop-shadow-lg"
          />
        </div>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center text-center min-h-screen px-6 md:px-10 lg:px-16 py-10">
        <div className="relative mb-6 md:mb-8" data-aos="fade-down">
          <div className="absolute inset-0 bg-orange-400/30 rounded-full blur-2xl scale-150 animate-pulse"></div>
          <img
            src={logo}
            alt="Logo Pemerintah Provinsi Lampung"
            className="relative w-72 md:w-80 drop-shadow-2xl hover:scale-110 transition-transform duration-500 cursor-pointer"
          />
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 md:mb-12 tracking-tight leading-tight"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <TypeAnimation
            sequence={[
              "DINAS SOSIAL",
              1000,
              "DINAS SOSIAL PROVINSI LAMPUNG",
              3000,
              "MELAYANI DENGAN HATI",
              2000,
              "",
              1000,
            ]}
            wrapper="span"
            speed={60}
            className="block bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl"
            repeat={Infinity}
          />
        </h1>

        <div 
          className="max-w-3xl mb-8 md:mb-8"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-orange-400 mr-4"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="w-12 h-0.5 bg-orange-400 ml-4"></div>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed font-light">
            Bersama mewujudkan kesejahteraan sosial yang inklusif, merata, dan berkelanjutan untuk masyarakat Lampung yang sejahtera dan bermartabat.
          </p>
        </div>

        <div 
          className="relative group opacity-100"
          data-aos="zoom-in"
          data-aos-delay="900"
          style={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
          <Button
            variant="default"
            onClick={() => navigate({ to: '/Auth/login' })}
            className="relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 
            hover:to-orange-700 hover:scale-110 transition-all duration-300 ease-in-out text-white font-bold 
            text-xl px-12 py-6 rounded-lg shadow-2xl uppercase tracking-wider cursor-pointer border-2 
            border-orange-400/50 hover:border-orange-300 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Masuk
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </Button>
        </div>
      </div>
    </div>
  );
}