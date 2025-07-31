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
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import Loading from "@/components/loading";
import Recipient from "@/components/bid-resos/recipient";

import KursiRodaIcon from "@/assets/icon/KursiRoda.svg";
import KrukIcon from "@/assets/icon/Kruk.svg";
import TripodIcon from "@/assets/icon/Tripod.svg";
import KakiPalsu from "@/assets/icon/kakiPalsu.svg";
import AlatBantuDengarIcon from "@/assets/icon/alatBantuDengar.svg";

export const Route = createLazyFileRoute("/dashboard/bid-resos")({
  component: Dashboard,
});

function Dashboard() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [selectedView, setSelectedView] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [dataCounters, setDataCounters] = useState({
    regular: 0,
    cp: 0,
    kruk: 0,
    tripod: 0,
    kakiPalsu: 0,
    alatDengar: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState([]);

  const API_BASE_URL = "https://archive-sos-drive.et.r.appspot.com/api/recipi";

  useEffect(() => {
    const updateCardsPerPage = () => {
      if (window.innerWidth < 768) {
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

  const fetchRecipients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setRecipients(result.data);
        return result.data;
      } else {
        throw new Error(result.message || "Gagal mengambil data penerima");
      }
    } catch (error) {
      console.error("Error fetching recipients:", error);
      setRecipients([]);
      return [];
    }
  };

  const calculateCounters = (recipientsData) => {
    const counters = {
      regular: 0,
      cp: 0,
      kruk: 0,
      tripod: 0,
      kakiPalsu: 0,
      alatDengar: 0,
    };

    recipientsData.forEach((recipient) => {
      const jenisAlat = recipient.jenisAlat?.toLowerCase() || "";

      if (jenisAlat.includes("kursi roda regular")) {
        counters.regular++;
      } else if (
        jenisAlat.includes("kursi roda cerebral palsy") ||
        jenisAlat.includes("cp")
      ) {
        counters.cp++;
      } else if (jenisAlat.includes("kruk")) {
        counters.kruk++;
      } else if (jenisAlat.includes("tripod")) {
        counters.tripod++;
      } else if (jenisAlat.includes("kaki palsu")) {
        counters.kakiPalsu++;
      } else if (jenisAlat.includes("alat bantu dengar")) {
        counters.alatDengar++;
      }
    });

    return counters;
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const recipientsData = await fetchRecipients();
      const calculatedCounters = calculateCounters(recipientsData);
      setDataCounters(calculatedCounters);
      setLoading(false);
      setSelectedView(null);
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

  const jenisAlatMapping = {
    regular: "Kursi Roda Regular",
    cp: "Kursi Roda Cerebral Palsy (CP)",
    kruk: "Kruk",
    tripod: "Tripod",
    kakiPalsu: "Kaki Palsu",
    alatDengar: "Alat Bantu Dengar",
  };

  const widgets = [
    {
      id: "regular",
      title: "Kursi Roda Regular",
      icon: <img src={KursiRodaIcon} alt="Kursi Roda Regular Icon" style={{ width: '32px', height: '32px' }} />,
      value: dataCounters.regular,
      bgColor: "#ff7f0e",
    },
    {
      id: "cp",
      title: "Kursi Roda Cerebral Palsy (CP)",
      icon: <img src={KursiRodaIcon} alt="Kursi Roda CP Icon" style={{ width: '32px', height: '32px' }} />,
      value: dataCounters.cp,
      bgColor: "#1F3A93",
    },
    {
      id: "kruk",
      title: "Kruk",
      icon: <img src={KrukIcon} alt="Kruk Icon" style={{ width: '32px', height: '32px' }} />,
      value: dataCounters.kruk,
      bgColor: "#ff7f0e",
    },
    {
      id: "tripod",
      title: "Tripod",
      icon: <img src={TripodIcon} alt="Tripod Icon" style={{ width: '32px', height: '32px' }} />,
      value: dataCounters.tripod,
      bgColor: "#1F3A93",
    },
    {
      id: "kakiPalsu",
      title: "Kaki Palsu",
      icon: <img src={KakiPalsu} alt="Kaki Palsu Icon" style={{ width: '32px', height: '32px' }} />,
      value: dataCounters.kakiPalsu,
      bgColor: "#ff7f0e",
    },
    {
      id: "alatDengar",
      title: "Alat Bantu Dengar",
      icon: <img src={AlatBantuDengarIcon} alt="Alat Bantu Dengar Icon" style={{ width: '32px', height: '32px' }} />,
      value: dataCounters.alatDengar,
      bgColor: "#1F3A93",
    },
  ];

  // Pagination for cards
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

  const handleDataUpdate = async () => {
    const recipientsData = await fetchRecipients();
    const calculatedCounters = calculateCounters(recipientsData);
    setDataCounters(calculatedCounters);
  };

  const handleCardClick = (cardId) => {
    if (selectedView === cardId) {
      setSelectedView(null);
    } else {
      setSelectedView(cardId);
    }
  };

  const filterJenisAlat = selectedView ? jenisAlatMapping[selectedView] : undefined;

  return (
    <div className="h-full w-full flex justify-center bg-opacity-100">
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-full mx-auto space-y-6">
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {currentCards.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className={`cursor-pointer text-white shadow-lg rounded-3xl w-full transition-all duration-300 border-0 overflow-hidden group
                                ${selectedView === item.id ? "scale-[1.05] shadow-2xl shadow-black/10" : "hover:scale-[1.05] hover:shadow-2xl hover:shadow-black/10"}`}
                style={{ backgroundColor: item.bgColor }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-8 translate-x-8" />

                <CardHeader className="flex flex-row items-center gap-4 pb-2 relative z-10">
                  <div className="py-2 rounded-sm backdrop-blur-sm transition-colors duration-300">
                    {/* The icon itself now has fixed width and height */}
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

          {totalPages > 1 && (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                className="pointer-events-auto ml-2 rounded-full w-10 h-10 p-0 bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-lg border-white/30 text-gray-800"
              >
                <MdChevronLeft size={20} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                className="pointer-events-auto mr-2 rounded-full w-10 h-10 p-0 bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-lg border-white/30 text-gray-800"
              >
                <MdChevronRight size={20} />
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
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
        </div>

        <div className="mt-8" data-aos="fade-up">
          <Recipient
            selectedJenisAlat={filterJenisAlat}
            onDataUpdate={handleDataUpdate}
            recipients={recipients}
          />
        </div>
      </div>
    </div>
  );
}