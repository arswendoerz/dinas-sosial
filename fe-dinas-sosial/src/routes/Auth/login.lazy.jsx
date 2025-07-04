import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from "react";
import logo from "@/assets/lampung.png";
import AOS from "aos";
import "aos/dist/aos.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute('/Auth/login')({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate({ to: "/home" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div
        className="w-[80%] max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        style={{ minHeight: "550px" }}
      >
        <div
          className="bg-[#f6f6f6] flex items-center justify-center p-8"
          data-aos="fade-right"
        >
          <img
            src={logo}
            alt="Logo"
            className="w-80 md:w-96 lg:w-104 drop-shadow-2xl"
          />
        </div>

        <div
          className="flex flex-col justify-center bg-[#f6f6f6] p-8 md:p-12"
          data-aos="fade-left"
        >
          <h3 className="text-2xl font-bold text-black mb-6">
            Masuk ke Akun Anda
          </h3>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email / Username
              </label>
              <Input
                type="text"
                placeholder="masukkan username..."
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="masukkan password..."
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-orange-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Belum punya akun? Hubungi Admin
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ff7f0e] hover:bg-orange-600 transition-colors duration-300 text-white font-semibold py-2 rounded-md cursor-pointer"
            >
              Masuk
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
