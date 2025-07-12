"use client";
import React from "react";
import { House, FileText, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: <House size={20} />, label: "Home", path: "/" },
  { icon: <FileText size={20} />, path: "/getstarted", label: "Get Started" },
  { icon: <Zap size={20} />, path: "/report", label: "Report" },
];

function Navbar() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-around max-w-full sm:w-[400px] h-[60px] sm:h-[80px] px-2 sm:px-4 py-2 rounded-full bg-[#f9f9f9] backdrop-blur-md shadow-lg border border-white/20 mx-auto mt-6 sm:mt-10 overflow-x-auto">
      {navItems.map((item, index) => {
        const isActive = pathname === item.path;
        return (
          <Link key={index} href={item.path} passHref>
            <div
              className={`flex flex-col items-center justify-center px-3 sm:px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-inner"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {item.icon}
              <span className="text-xs sm:text-sm mt-1">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Navbar;
