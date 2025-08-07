import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MdDescription,
  MdMarkEmailUnread,
  MdPhotoCamera,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import Dokumen from "@/components/bid-perencanaan/dokumen/dokumen";
import Surat from "@/components/bid-perencanaan/surat/surat";
import Dokumentasi from "@/components/bid-perencanaan/dokumentasi/dokumentasi";
import ProtectedRoute from "@/components/protected";
import Loading from "@/components/loading";

export const Route = createLazyFileRoute("/dashboard/bid-perencanaan")({
  component: () => (
    <ProtectedRoute allowedRoles={["perencanaan"]}>
      <Dashboard />
    </ProtectedRoute>
  ),
});

function Dashboard() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [view, setView] = useState("dokumen");
  const [documentCount, setDocumentCount] = useState(0);
  const [suratCount, setSuratCount] = useState(0);
  const [dokumentasiCount, setDokumentasiCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    const updateCardsPerPage = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
      setCurrentPage(0);
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const fetchDocumentCount = async () => {
    try {
      const response = await fetch(
        "https://archive-sos-drive.et.r.appspot.com/api/docs/",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) setDocumentCount(data.data.length);
      } else if (response.status === 401) {
        console.error("Token expired or invalid. Please login again.");
      }
    } catch (error) {
      console.error("Error fetching document count:", error);
    }
  };

  const fetchSuratCount = async () => {
    try {
      const response = await fetch(
        "https://archive-sos-drive.et.r.appspot.com/api/letter/",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) setSuratCount(data.data.length);
      } else if (response.status === 401) {
        console.error("Token expired or invalid. Please login again.");
      }
    } catch (error) {
      console.error("Error fetching surat count:", error);
    }
  };

  const fetchDokumentasiCount = async () => {
    try {
      const response = await fetch(
        "https://archive-sos-drive.et.r.appspot.com/api/documentation/",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) setDokumentasiCount(data.data.length);
      } else if (response.status === 401) {
        console.error("Token expired or invalid. Please login again.");
      }
    } catch (error) {
      console.error("Error fetching dokumentasi count:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchDocumentCount(),
        fetchSuratCount(),
        fetchDokumentasiCount(),
      ]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <Loading
        title="Loading ..."
        subtitle="Menyiapkan data untuk Anda..."
        showLogo={true}
        logoSrc="/lampung.png"
        logoAlt="Logo Lampung"
        size="default"
      />
    );
  }

  const widgets = [
    {
      id: "dokumen",
      title: "Dokumen",
      icon: <MdDescription size={32} />,
      value: documentCount,
      bgColor: "#ff7f0e",
    },
    {
      id: "surat",
      title: "Surat",
      icon: <MdMarkEmailUnread size={32} />,
      value: suratCount,
      bgColor: "#1F3A93",
    },
    {
      id: "dokumentasi",
      title: "Dokumentasi",
      icon: <MdPhotoCamera size={32} />,
      value: dokumentasiCount,
      bgColor: "#2ca02c",
    },
  ];

  const totalPages = Math.ceil(widgets.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = widgets.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <div className="h-full w-full flex justify-center bg-opacity-100">
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-full mx-auto space-y-6">
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCards.map((item, index) => (
              <Card
                key={item.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onClick={() => setView(item.id)}
                className={`cursor-pointer text-white shadow-lg rounded-3xl w-full transition-all duration-300 border-0 overflow-hidden group
                                ${view === item.id ? "scale-[1.05] shadow-2xl shadow-black/10" : "hover:scale-[1.05] hover:shadow-2xl hover:shadow-black/10"}`}
                style={{ backgroundColor: item.bgColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-8 translate-x-8" />

                <CardHeader className="flex flex-row items-center gap-4 pb-2 relative z-10">
                  <div className="py-2 rounded-sm backdrop-blur-sm transition-colors duration-300">
                    <div className="text-xl sm:text-2xl">{item.icon}</div>
                  </div>
                  <CardTitle className="text-sm sm:text-base font-semibold truncate">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0 px-6 pb-6 relative z-10">
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                      {item.value}
                    </p>
                    <span className="text-sm font-medium opacity-80">items</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* --- Tombol Navigasi --- */}
          {totalPages > 1 && (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none z-10 md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                className="pointer-events-auto -ml-2 rounded-full w-10 h-10 p-0 bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-lg border-white/30 text-gray-800"
              >
                <MdChevronLeft size={20} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                className="pointer-events-auto -mr-2 rounded-full w-10 h-10 p-0 bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-lg border-white/30 text-gray-800"
              >
                <MdChevronRight size={20} />
              </Button>
            </div>
          )}
        </div>

        {/* --- Indikator Halaman --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2 md:hidden">
            {Array.from({ length: totalPages }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentPage === i ? "bg-[#1F3A93] w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        <div className="mt-6" data-aos="fade-up" data-aos-delay="200">
            {view === "dokumen" && <Dokumen />}
            {view === "surat" && <Surat />}
            {view === "dokumentasi" && <Dokumentasi />}
        </div>
      </div>
    </div>
  );
}