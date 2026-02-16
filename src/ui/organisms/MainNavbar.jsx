"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const MainNavbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Discover", path: "/discover" },
    { name: "Trip Advisor", path: "/trip-advisor" },
    { name: "Chat Rooms", path: "/chatrooms" },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]">
              <img src="/black_ver.png" alt="Logo" className="w-full h-full p-0" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-6 py-2 font-bold border-4 border-black text-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] ${isActive(item.path)
                    ? "bg-[#FFC700] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white hover:bg-[#FFC700]"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Profile/Auth */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4ADE80] border-4 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center font-black">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">Profile</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="px-4 py-2 bg-[#FF6B6B] border-4 border-black font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-[#00D9FF] border-4 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden px-3 py-2 bg-[#FFC700] border-4 border-black font-black text-black"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 font-bold border-4 border-black text-black ${isActive(item.path)
                    ? "bg-[#FFC700]"
                    : "bg-white hover:bg-[#FFC700]"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavbar;
