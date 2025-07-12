import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import toast from 'react-hot-toast';
import AOS from "aos";
import "aos/dist/aos.css";

export const Route = createLazyFileRoute("/account")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    if (isLoggingOut) return;
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
          toast.error(data.message || 'Gagal mengambil data profil');
        }
      } else {
        if (response.status === 401 && !isLoggingOut) {
          setError('Sesi telah berakhir. Silakan login kembali.');
          toast.error('Sesi telah berakhir. Silakan login kembali.');
          setTimeout(() => {
            navigate({ to: "/" });
          }, 800);
        } else if (!isLoggingOut) {
          setError('Gagal mengambil data profil');
          toast.error('Gagal mengambil data profil');
        }
      }
    } catch (error) {
      if (!isLoggingOut) {
        console.error('Error fetching user profile:', error);
        setError('Koneksi ke server gagal');
        toast.error('Koneksi ke server gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const loadingToast = toast.loading('Sedang keluar dari sistem...');
      const response = await fetch('http://localhost:9000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success('Berhasil keluar dari sistem');
      } else {
        toast.success('Berhasil keluar dari sistem');
      }
      navigate({ to: "/" });

    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Terjadi kesalahan saat logout, tetapi Anda akan diarahkan ke halaman utama');
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Tidak diketahui';
    
    const date = new Date(lastLogin);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBidangDisplay = (role) => {
    switch (role?.toLowerCase()) {
      case 'perencanaan':
        return 'Perencanaan';
      case 'rehabilitasi':
      case 'resos':
        return 'Rehabilitasi Sosial';
      default:
        return role || 'Tidak diketahui';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#f6f6f6] py-10 px-4" data-aos="fade">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-[#eee]" data-aos="zoom-in">
          <div className="bg-[#ff7f0e] text-white py-4 px-6 text-xl font-bold rounded-t-2xl" data-aos="fade-down">
            Akun Saya
          </div>
          <div className="px-6 py-8 text-[#1f77b4] space-y-6 flex items-center justify-center min-h-[300px]" data-aos="fade-up">
            <div className="text-center" data-aos="zoom-in" data-aos-delay="200">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f77b4] mx-auto mb-4" data-aos="fade-in" data-aos-delay="300"></div>
              <p className="text-gray-600" data-aos="fade-in" data-aos-delay="400">Memuat data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#f6f6f6] py-10 px-4" data-aos="fade">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-[#eee]" data-aos="zoom-in">
          <div className="bg-[#ff7f0e] text-white py-4 px-6 text-xl font-bold rounded-t-2xl" data-aos="fade-down">
            Akun Saya
          </div>
          <div className="px-6 py-8 text-[#1f77b4] space-y-6 flex items-center justify-center min-h-[300px]" data-aos="fade-up">
            <div className="text-center" data-aos="zoom-in" data-aos-delay="200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" data-aos="fade-in" data-aos-delay="300">
                <FaUser className="text-red-500 w-8 h-8" data-aos="fade-in" data-aos-delay="400" />
              </div>
              <p className="text-red-600 mb-4" data-aos="fade-in" data-aos-delay="500">{error}</p>
              <Button 
                onClick={fetchUserProfile}
                className="bg-[#ff7f0e] hover:bg-orange-600"
                data-aos="fade-in" 
                data-aos-delay="600"
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userData = {
    name: user?.name || "Tidak diketahui",
    email: user?.email || "Tidak diketahui",
    lastLogin: formatLastLogin(user?.lastLogin),
    bidang: getBidangDisplay(user?.role),
  };

  return (
    <div
      className="h-full w-full flex items-center justify-center bg-[#f6f6f6] py-10 px-4"
      data-aos="fade"
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-[#eee]"
        data-aos="zoom-in"
        data-aos-duration="600"
      >
        {/* Header */}
        <div
          className="bg-[#ff7f0e] text-white py-4 px-6 text-xl font-bold rounded-t-2xl"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Akun Saya
        </div>

        {/* Body */}
        <div
          className="px-6 py-8 text-[#1f77b4] space-y-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div
            className="flex justify-center"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <div className="relative" data-aos="fade-in" data-aos-delay="400">
              <div className="w-20 h-20 bg-[#1f77b4] rounded-full flex items-center justify-center shadow-lg" data-aos="scale-up" data-aos-delay="500">
                <FaUser className="text-white w-10 h-10" data-aos="fade-in" data-aos-delay="600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" data-aos="fade-in" data-aos-delay="700"></div>
            </div>
          </div>

          <div
            className="space-y-4 px-4 md:px-10"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div data-aos="fade-right" data-aos-delay="500">
              <p className="text-sm font-semibold" data-aos="fade-in" data-aos-delay="600">Nama Lengkap</p>
              <p className="text-black text-lg font-bold" data-aos="fade-in" data-aos-delay="700">{userData.name}</p>
            </div>

            <div data-aos="fade-right" data-aos-delay="550">
              <p className="text-sm font-semibold" data-aos="fade-in" data-aos-delay="650">Alamat Email</p>
              <p className="text-black" data-aos="fade-in" data-aos-delay="750">{userData.email}</p>
            </div>

            <div data-aos="fade-right" data-aos-delay="600">
              <p className="text-sm font-semibold" data-aos="fade-in" data-aos-delay="700">Login Terakhir</p>
              <p className="text-black" data-aos="fade-in" data-aos-delay="800">{userData.lastLogin}</p>
            </div>

            <div className="pt-2 border-t border-[#eee]" data-aos="fade-right" data-aos-delay="650">
              <p className="text-sm font-semibold flex items-center gap-2" data-aos="fade-in" data-aos-delay="750">
                <FaBriefcase className="text-[#1f77b4]" data-aos="fade-in" data-aos-delay="850" />
                Bidang
              </p>
              <p className="text-black font-medium" data-aos="fade-in" data-aos-delay="900">{userData.bidang}</p>
            </div>
          </div>
        </div>

        {/* Footer: Logout */}
        <div
          className="bg-[#f6f6f6] p-4 rounded-b-2xl border-t border-[#eee] flex justify-end"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-[#ff7f0e] hover:bg-orange-600"
                data-aos="fade-in"
                data-aos-delay="600"
              >
                Keluar Akun
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-aos="zoom-in" data-aos-duration="300">
              <AlertDialogHeader data-aos="fade-down" data-aos-delay="100">
                <AlertDialogTitle data-aos="fade-in" data-aos-delay="200">
                  Apakah Anda yakin ingin keluar?
                </AlertDialogTitle>
                <AlertDialogDescription data-aos="fade-in" data-aos-delay="300">
                  Tindakan ini akan mengakhiri sesi Anda dan Anda harus login
                  ulang untuk mengakses sistem.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter data-aos="fade-up" data-aos-delay="400">
                <AlertDialogCancel className="bg-red-500 hover:bg-red-800 text-[#f6f6f6] hover:text-[#f6f6f6]" data-aos="fade-in" data-aos-delay="500">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-[#ff7f0e] hover:bg-orange-600"
                  data-aos="fade-in" 
                  data-aos-delay="600"
                >
                  Keluar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}