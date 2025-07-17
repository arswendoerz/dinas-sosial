import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { MdDescription, MdMarkEmailUnread } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
import Dokumen from "@/components/bid-perencanaan/dokumen/dokumen";
import Surat from "@/components/bid-perencanaan/surat/surat";
import ProtectedRoute from "@/components/protected";

export const Route = createLazyFileRoute("/dashboard/bid-perencanaan")({
  component: () => (
    <ProtectedRoute allowedRoles={['perencanaan']}>
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
  const [loading, setLoading] = useState(true);

  const fetchDocumentCount = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/docs/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setDocumentCount(data.data.length);
        }
      } else {
        if (response.status === 401) {
          console.error("Token expired or invalid. Please login again.");
        }
      }
    } catch (error) {
      console.error("Error fetching document count:", error);
    }
  };

  const fetchSuratCount = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/letter/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSuratCount(data.data.length);
        }
      } else {
        if (response.status === 401) {
          console.error("Token expired or invalid. Please login again.");
        }
      }
    } catch (error) {
      console.error("Error fetching surat count:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchDocumentCount(), fetchSuratCount()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const widgets = [
    {
      id: "dokumen",
      title: "Dokumen",
      icon: <MdDescription size={32} />,
      value: loading ? "..." : documentCount,
      bgColor: "#ff7f0e",
    },
    {
      id: "surat",
      title: "Surat",
      icon: <MdMarkEmailUnread size={32} />,
      value: loading ? "..." : suratCount,
      bgColor: "#1F3A93",
    },
  ];

  return (
    <div className="h-full w-full flex justify-center bg-opacity-100">
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-full mx-auto space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {widgets.map((item, index) => (
            <Card
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onClick={() => setView(item.id)}
              className="cursor-pointer text-white shadow-lg rounded-3xl w-full transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:shadow-black/10 border-0 overflow-hidden group"
              style={{ backgroundColor: item.bgColor }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-8 translate-x-8" />

              <CardHeader className="flex flex-row items-center gap-4 pb-2 relative z-10">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
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

        {view === "dokumen" && <Dokumen />}
        {view === "surat" && <Surat />}
      </div>
    </div>
  );
}