import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from "react";
import logo from "@/assets/lampung.png";
import motifKanan from "@/assets/motif-kanan.svg";
import motifKiri from "@/assets/motif-kiri.svg";
import AOS from "aos";
import "aos/dist/aos.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import iconLogin from "@/assets/icon/icon-login.svg";
import { useNavigate } from "@tanstack/react-router";
import toast from 'react-hot-toast';

export const Route = createLazyFileRoute('/Auth/login')({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    const loadingToast = toast.loading('Sedang memproses login...');
    
    try {
      const response = await fetch('http://localhost:9000/api/auth/login', {
        method: 'POST',
        credentials: 'include', // untuk mengirim dan menerima cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      const data = await response.json();
      
      toast.dismiss(loadingToast);
      
      if (response.ok && data.success) {
        toast.success(data.message || 'Login berhasil!');
        navigate({ to: "/home" });
      } else {
        toast.error(data.message || 'Login gagal!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.dismiss(loadingToast);
      toast.error('Koneksi ke server gagal. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-orange-200/10 rounded-full blur-3xl" />
      </div>

      {/* Motif Kiri */}
      <div className="absolute left-0 top-0 h-full w-auto z-5">
        <img
          src={motifKiri}
          alt="Motif Kiri"
          className="h-full w-auto object-contain opacity-30"
        />
      </div>

      {/* Motif Kanan */}
      <div className="absolute right-0 top-0 h-full w-auto z-5">
        <img
          src={motifKanan}
          alt="Motif Kanan"
          className="h-full w-auto object-contain opacity-30"
        />
      </div>

      <div
        className="relative w-full max-w-6xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 z-10"
        data-aos="zoom-in"
        data-aos-duration="1000"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh] lg:min-h-[600px]">
          <div
            className="relative bg-gradient-to-br from-[#1F3A93] via-[#2e8bc0] to-[#1F3A93] flex items-center justify-center p-6 sm:p-8 lg:p-12 min-h-[40vh] lg:min-h-full"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12" />
            <div className="absolute top-1/2 left-8 w-2 h-16 bg-white/20 rounded-full" />
            <div className="absolute top-1/3 right-8 w-2 h-12 bg-white/20 rounded-full" />
            
            <div className="relative z-10 text-center">
              <div 
                className="mb-4 sm:mb-8"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <img
                  src={logo}
                  alt="Logo Lampung"
                  className="w-48 sm:w-64 lg:w-80 mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div 
                className="text-white"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
                  Selamat Datang
                </h2>
                <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                  Sistem Informasi Manajemen<br/>
                  Dinas Sosial Provinsi Lampung
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white min-h-[45vh] lg:min-h-full"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="max-w-md mx-auto w-full space-y-1">
              <div 
                className="text-center mb-4 sm:mb-6"
                data-aos="fade-down"
                data-aos-delay="500"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#ff7f0e] rounded-full mb-3 sm:mb-4 shadow-lg">
                  <img src={iconLogin} alt="Login Icon" className="w-6 h-6 sm:w-8 sm:h-8 text-white"/>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Masuk ke Akun
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Silakan masuk dengan kredensial Anda
                </p>
              </div>

              <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                <div 
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="masukkan email..."
                      className={`pl-10 h-11 sm:h-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 transition-all duration-300 ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div 
                  data-aos="fade-up"
                  data-aos-delay="800"
                >
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="masukkan password..."
                      className={`pl-10 pr-12 h-11 sm:h-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 transition-all duration-300 ${
                        errors.password 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      tabIndex={-1}
                      disabled={isLoading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div 
                  data-aos="fade-up"
                  data-aos-delay="900"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 sm:h-12 bg-gradient-to-r from-[#ff7f0e] to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </div>
                    ) : (
                      'Masuk ke Dashboard'
                    )}
                  </Button>
                </div>

                <div 
                  className="text-center pt-2 sm:pt-3 border-t border-gray-200"
                  data-aos="fade-up"
                  data-aos-delay="1000"
                >
                  <p className="text-sm sm:text-base text-gray-600">
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                      Hubungi Admin
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}