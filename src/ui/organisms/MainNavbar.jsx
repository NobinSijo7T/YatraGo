"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";

const MainNavbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { socket, isConnected } = useSocket();
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  const navItems = [
    { name: "Discover",     path: "/discover" },
    { name: "Trip Advisor", path: "/trip-advisor" },
    { name: "Chat Rooms",   path: "/chatrooms" },
  ];

  const spotlightItems = navItems.map((item) => ({
    label: item.name,
    href: item.path,
  }));

  const defaultActiveIndex = Math.max(
    navItems.findIndex((item) => pathname === item.path),
    0
  );

  const isActive = (path) => pathname === path;

  const handleSOSClick = (e) => {
    e.preventDefault();
    console.log("SOS BUTTON CLICKED - Session:", session);
    if (!session?.user) {
      alert("You must be logged in to send an SOS alert.");
      return;
    }
    setShowSOSConfirm(true);
  };

  const confirmSOS = async () => {
    setIsTriggering(true);

    try {
      console.log("🚨 Sending SOS to database...");
      const response = await fetch("/api/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Emergency! I need help immediately!",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send SOS alert");
      }

      const data = await response.json();
      console.log("✅ SOS saved to database:", data);

      console.log("🔌 Socket status - Connected:", isConnected, "Socket:", socket);
      
      if (socket && isConnected) {
        const sosPayload = {
          alertId: data.alert._id,
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          userLocation: {
            travelCity: session.user.travelCity || "",
            travelCountry: session.user.travelCountry || "",
          },
          message: data.alert.message,
        };
        
        console.log("📡 Emitting trigger-sos event:", sosPayload);
        socket.emit("trigger-sos", sosPayload);
        console.log("✅ SOS event emitted successfully");
      } else {
        console.error("❌ Socket not connected! Connected:", isConnected, "Socket:", socket);
      }

      setShowSOSConfirm(false);
      alert("🚨 SOS alert sent! Help is on the way!");
    } catch (error) {
      console.error("❌ Error sending SOS:", error);
      alert("Failed to send SOS alert. Please try again.");
    } finally {
      setIsTriggering(false);
    }
  };

  const cancelSOS = () => {
    setShowSOSConfirm(false);
  };

  return (
    <nav className="bg-transparent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden">
              <img src="/black_ver.png" alt="YathraGo" className="w-full h-full object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation — Spotlight */}
          <div className="hidden md:block">
            <SpotlightNavbar
              items={spotlightItems}
              defaultActiveIndex={defaultActiveIndex}
              onItemClick={(item) => router.push(item.href)}
              className="pt-0"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                {/* SOS Button */}
                <button
                  type="button"
                  onClick={handleSOSClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-sm font-semibold transition-colors"
                  title="Emergency SOS"
                >
                  <span>🚨</span>
                  <span className="hidden sm:block">SOS</span>
                </button>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  <div className="w-7 h-7 bg-[#003580] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{session.user?.name?.split(' ')[0]}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="px-4 py-1.5 rounded-lg border border-white/70 text-sm font-medium text-white hover:border-white hover:bg-white/10 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-lg bg-[#003580] text-sm font-semibold text-white hover:bg-[#00266b] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 rounded-lg bg-[#003580] text-sm font-semibold text-white hover:bg-[#00266b] transition-colors"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(item.path)
                    ? "bg-[#003580] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {session && (
              <button
                type="button"
                onClick={handleSOSClick}
                className="w-full mt-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm font-semibold text-left"
              >
                🚨 Emergency SOS
              </button>
            )}
          </div>
        )}
      </div>

      {/* SOS Confirmation Modal */}
      {showSOSConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl">🚨</div>
              <h2 className="text-xl font-bold text-gray-900">Confirm Emergency SOS</h2>
            </div>
            <p className="text-gray-600 mb-6">
              This will send an emergency alert to all logged-in users. Are you sure you need help?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={confirmSOS}
                disabled={isTriggering}
                className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isTriggering ? "Sending..." : "Send SOS"}
              </button>
              <button
                type="button"
                onClick={cancelSOS}
                disabled={isTriggering}
                className="flex-1 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;
