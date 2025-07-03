import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/lampung.png";
import backgroundImage from "@/assets/dinsos.png";
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
    AOS.init({ duration: 1000, once: true, delay: 200 });
  }, []);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden font-sans bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 brightness-[0.35] blur-[2px]"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: "fixed",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center text-center min-h-screen px-6 md:px-10 lg:px-20 py-12">
        <img
          src={logo}
          alt="Logo Universitas Lampung"
          className="w-66 md:w-74 mb-6 md:mb-8 drop-shadow-2xl"
          data-aos="fade-down"
        />

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 md:mb-8 tracking-tight leading-tight drop-shadow-xl"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <TypeAnimation
            sequence={[
              "DINAS SOSIAL PROVINSI LAMPUNG",
              2000,
              "",
              1000,
            ]}
            wrapper="span"
            speed={60}
            className="block text-white"
            repeat={Infinity}
          />
        </h1>

        <p
          className="text-lg md:text-xl lg:text-2xl text-gray-100 max-w-2xl mb-10 leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          Bersama mewujudkan kesejahteraan sosial yang inklusif, merata, dan berkelanjutan untuk masyarakat Lampung.
        </p>

        <Button
          variant="default"
          onClick={() => navigate({ to: '/Auth/login' })}
          className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out text-white font-semibold text-lg px-10 py-4 rounded-full shadow-xl uppercase tracking-wide cursor-pointer"
          data-aos="zoom-in"
          data-aos-delay="900"
        >
          Masuk
        </Button>
      </div>
    </div>
  );
}
