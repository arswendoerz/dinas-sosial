import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
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
import AOS from "aos";
import "aos/dist/aos.css";

export const Route = createLazyFileRoute("/account")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const user = {
    name: "Arswendo Erza Sadewa",
    email: "arswendo@gmail.com",
    lastLogin: "24 April 2024, 13:27",
    bidang: "Perencanaan",
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
            <div className="relative">
              <div className="w-20 h-20 bg-[#1f77b4] rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="text-white w-10 h-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>

          <div
            className="space-y-4 px-4 md:px-10"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div>
              <p className="text-sm font-semibold">Nama Lengkap</p>
              <p className="text-black text-lg font-bold">{user.name}</p>
            </div>

            <div>
              <p className="text-sm font-semibold">Alamat Email</p>
              <p className="text-black">{user.email}</p>
            </div>

            <div>
              <p className="text-sm font-semibold">Login Terakhir</p>
              <p className="text-black">{user.lastLogin}</p>
            </div>

            <div className="pt-2 border-t border-[#eee]">
              <p className="text-sm font-semibold flex items-center gap-2">
                <FaBriefcase className="text-[#1f77b4]" />
                Bidang
              </p>
              <p className="text-black font-medium">{user.bidang}</p>
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
              >
                Keluar Akun
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah Anda yakin ingin keluar?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini akan mengakhiri sesi Anda dan Anda harus login
                  ulang untuk mengakses sistem.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-red-500 hover:bg-red-800 text-[#f6f6f6] hover:text-[#f6f6f6]">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="bg-[#ff7f0e] hover:bg-orange-600"
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
