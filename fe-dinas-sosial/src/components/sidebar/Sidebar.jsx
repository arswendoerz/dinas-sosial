import {
  FaHome,
  FaInfoCircle,
  FaUserAlt,
  FaHandsHelping
} from "react-icons/fa";
import {
  RiSidebarUnfoldFill,
  RiSidebarFoldFill,
} from "react-icons/ri";
import { FaBarsStaggered } from "react-icons/fa6";
import { GrPlan } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/lampung.png";

const user = {
  name: "Arswendo Erza",
  email: "arswendo@gmail.com",
};

const navItems = [
  { label: "Home", icon: FaHome, to: "/home" },
  { label: "Perencanaan", icon: GrPlan, to: "/dashboard/bid-perencanaan" },
  {label: "Rehabilitasi Sosial", icon: FaHandsHelping, to: "/dashboard/bid-resos" },
  { label: "About", icon: FaInfoCircle, to: "/about" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const iconSize = collapsed ? 28 : 22;

  const SidebarContent = (
    <aside
      className={`h-screen bg-gradient-to-b from-[#1f77b4] to-[#135a96] text-white p-4 transition-all duration-300 shadow-xl
        ${collapsed ? "w-20" : "w-64"} flex flex-col`}
    >
      <div
        className={`mb-4 flex ${collapsed ? "justify-center" : "justify-end"} transition-all duration-300`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:text-gray-200 transition cursor-pointer"
        >
          {collapsed ? (
            <RiSidebarUnfoldFill size={30} />
          ) : (
            <RiSidebarFoldFill size={30} />
          )}
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <img
          src={logo}
          alt="Logo"
          className={`transition-all duration-700 ease-in-out transform
            ${collapsed ? "w-30 rotate-[360deg]" : "w-40 rotate-0"}`}
        />
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, icon: Icon, to }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={label}
              to={to}
              title={collapsed ? label : ""}
              onClick={() => setSidebarOpen(false)}
            >
              <Button
                variant="ghost"
                className={`w-full justify-start items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer
                  ${isActive ? "bg-white text-[#1f77b4]" : "hover:bg-white hover:text-[#1f77b4]"}`}
              >
                <Icon size={iconSize} />
                <span
                  className={`overflow-hidden transition-all duration-300 ${
                    collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                  }`}
                >
                  {label}
                </span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="mt-auto pt-4 border-t border-white/20">
        <Link to="/account" onClick={() => setSidebarOpen(false)}>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 px-3 py-2 hover:bg-white hover:text-[#1f77b4] transition-all duration-200 cursor-pointer"
          >
            <FaUserAlt size={iconSize} />
            {!collapsed && (
              <div className="flex flex-col text-left">
                <span className="font-semibold leading-tight">
                  {user.name}
                </span>
                <span className="text-sm text-[#f6f6f6] leading-none">
                  {user.email}
                </span>
              </div>
            )}
          </Button>
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-[#1f77b4] hover:text-orange-600 transition-colors cursor-pointer"
        >
          <FaBarsStaggered size={35} />
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed z-50 md:relative top-0 left-0 h-full transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {SidebarContent}
      </div>
    </>
  );
}
