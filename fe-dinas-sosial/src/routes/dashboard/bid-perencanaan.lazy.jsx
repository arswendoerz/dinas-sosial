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
import Dokumen from "@/components/bid-perencanaan/dokumen";
import Surat from "@/components/bid-perencanaan/surat";

export const Route = createLazyFileRoute("/dashboard/bid-perencanaan")({
  component: Dashboard,
});

export default function Dashboard() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [view, setView] = useState("dokumen");

  const widgets = [
    {
      id: "dokumen",
      title: "Dokumen",
      icon: <MdDescription size={32} />,
      value: 12,
      bgColor: "#1f77b4",
    },
    {
      id: "surat",
      title: "Surat",
      icon: <MdMarkEmailUnread size={32} />,
      value: 9,
      bgColor: "#ff7f0e",
    },
  ];

  return (
    <div className="h-full w-full flex justify-center bg-[#f6f6f6]">
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-full mx-auto space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {widgets.map((item, index) => (
            <Card
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onClick={() => setView(item.id)}
              className="cursor-pointer text-white shadow-lg rounded-2xl w-full transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
              style={{ backgroundColor: item.bgColor }}
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-1">
                <div className="text-xl sm:text-2xl">{item.icon}</div>
                <CardTitle className="text-sm sm:text-base font-semibold truncate">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 px-4 pb-4">
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {item.value}
                </p>
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