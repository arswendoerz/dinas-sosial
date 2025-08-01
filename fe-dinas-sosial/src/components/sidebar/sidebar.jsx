import {
  FaHome,
  FaInfoCircle,
  FaUserAlt,
} from "react-icons/fa";
import { RiSidebarUnfoldFill, RiSidebarFoldFill } from "react-icons/ri";
import { FaBarsStaggered } from "react-icons/fa6";
import { GrPlan } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "@/assets/lampung.png";
import motifKiriPutih from "@/assets/motif-kiri-putih.svg";
import iconResosUrl from "../../assets/icon/icon-resos.png";

const IconResos = ({ size = 22, isBlue = false }) => (
  <img
    src={iconResosUrl}
    alt="Icon Rehabilitasi Sosial"
    width={size}
    height={size}
    className="flex-shrink-0 transition-all duration-200"
    style={{
      filter: isBlue
        ? 'brightness(0) saturate(100%) invert(12%) sepia(85%) saturate(1729%) hue-rotate(218deg) brightness(96%) contrast(94%)'
        : 'brightness(0) invert(1)'
    }}
  />
);

const navItems = [
  { label: "Home", icon: FaHome, to: "/home" },
  { label: "Perencanaan", icon: GrPlan, to: "/dashboard/bid-perencanaan" },
  { label: "Rehabilitasi Sosial", icon: IconResos, to: "/dashboard/bid-resos" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();

  const iconSize = collapsed ? 24 : 20;
  const resosIconSize = collapsed ? 22 : 18;

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://archive-sos-drive.et.r.appspot.com/api/user/profile', {
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
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const SidebarContent = (
    <aside
      className={`h-screen bg-[#1F3A93] text-white transition-all duration-300 relative overflow-hidden
        ${collapsed ? "w-20" : "w-64"} flex flex-col scrollbar-hide`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={motifKiriPutih}
          alt="Background Motif"
          className="absolute left-0 top-0 h-full w-auto opacity-50 object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Toggle Button - Fixed at top */}
        <div
          className={`flex-shrink-0 p-4 pb-0 flex ${collapsed ? "justify-center" : "justify-end"} transition-all duration-300`}
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

        <div className="flex-shrink-0 flex justify-center mb-6 px-4">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-700 ease-in-out transform
              ${collapsed ? "w-80" : "w-80"}`}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2 px-4 overflow-y-auto scrollbar-hide">
          {navItems.map(({ label, icon, to }) => {
            const isActive = location.pathname === to;
            const isHovered = hoveredItem === label;
            const IconComponent = icon;

            return (
              <Link
                key={label}
                to={to}
                title={collapsed ? label : ""}
                onClick={() => setSidebarOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={`w-full items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer
                    ${collapsed ? "justify-center" : "justify-start"}
                    ${isActive ? "bg-white text-[#1F3A93]" : "hover:bg-white hover:text-[#1F3A93]"}`}
                  onMouseEnter={() => setHoveredItem(label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
                  >
                    {label === "Rehabilitasi Sosial" ? (
                      <IconComponent
                        size={resosIconSize}
                        isBlue={isActive || isHovered}
                      />
                    ) : (
                      <IconComponent size={iconSize} />
                    )}
                  </div>
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

        {/* User Profile */}
        <div className="flex-shrink-0 p-4 pt-4 border-t border-white/20">
          <Link to="/account" onClick={() => setSidebarOpen(false)}>
            <Button
              variant="ghost"
              className={`w-full flex items-center gap-3 px-3 py-3 transition-all duration-200 cursor-pointer group
                ${collapsed ? "justify-center" : "justify-start"}
                ${location.pathname === "/account" ? "bg-white text-[#1F3A93]" : "hover:bg-white hover:text-[#1F3A93]"}`}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              >
                <FaUserAlt size={iconSize} />
              </div>
              {!collapsed && (
                <div className="flex flex-col text-left min-w-0 flex-1">
                  <span className="font-semibold leading-tight truncate">
                    {user?.name || "Loading..."}
                  </span>
                  <span className={`text-sm leading-normal truncate transition-colors duration-200 ${
                    location.pathname === "/account" ? "text-[#1F3A93]" : "text-[#f6f6f6] group-hover:text-[#1F3A93]"
                  }`}>
                    {user?.email || "Loading..."}
                  </span>
                </div>
              )}
            </Button>
          </Link>

          {!collapsed && (
            <div className="mt-3 text-center">
              <p className="text-xs text-white/60 font-medium">
                Magang Dinas Sosial ©2025
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-[#1F3A93] hover:text-orange-600 transition-colors cursor-pointer"
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
        className={`fixed z-50 md:sticky md:top-0 top-0 left-0 h-screen transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {SidebarContent}
      </div>
    </>
  );
}