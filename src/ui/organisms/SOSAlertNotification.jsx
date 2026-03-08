"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";

const SOSAlertNotification = () => {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [alerts, setAlerts] = useState([]);

  const playSOSSound = () => {
    // Create audio alert (you can replace with actual audio file)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;

      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
    } catch (error) {
      console.log("Audio not available");
    }
  };

  const handleSOSAlert = useCallback((data) => {
    console.log("📥 RAW SOS Alert received:", data);
    console.log("👤 Current user email:", session?.user?.email);
    console.log("📧 Alert from email:", data.userEmail);
    
    // Don't show alert to the user who triggered it
    if (session?.user?.email === data.userEmail) {
      console.log("⏭️ Skipping - this is my own alert");
      return;
    }

    console.log("✅ Displaying SOS Alert:", data);

    // Add new alert
    setAlerts((prev) => {
      // Check if alert already exists
      if (prev.some((alert) => alert.alertId === data.alertId)) {
        console.log("⚠️ Alert already exists, skipping");
        return prev;
      }
      console.log("➕ Adding new alert to state");
      return [...prev, { ...data, id: Date.now() }];
    });

    // Play sound
    playSOSSound();

    // Auto-remove after 30 seconds
    setTimeout(() => {
      console.log("⏰ Auto-dismissing alert after 30s:", data.alertId);
      setAlerts((prev) => prev.filter((alert) => alert.alertId !== data.alertId));
    }, 30000);
  }, [session]);

  const handleSOSResolved = useCallback((data) => {
    console.log("✅ SOS Resolved:", data);
    setAlerts((prev) => prev.filter((alert) => alert.alertId !== data.alertId));
  }, []);

  useEffect(() => {
    console.log("🔌 SOSAlertNotification: Socket connected:", isConnected, "Socket:", socket);
    
    if (socket && isConnected) {
      console.log("✅ SOSAlertNotification: Registering socket listeners");
      
      socket.on("sos-alert", handleSOSAlert);
      socket.on("sos-resolved", handleSOSResolved);

      // Test listener
      socket.on("connect", () => {
        console.log("🔌 Socket reconnected in SOSAlertNotification");
      });

      return () => {
        console.log("🧹 SOSAlertNotification: Cleaning up socket listeners");
        socket.off("sos-alert", handleSOSAlert);
        socket.off("sos-resolved", handleSOSResolved);
        socket.off("connect");
      };
    } else {
      console.log("⚠️ SOSAlertNotification: Socket not ready");
    }
  }, [socket, isConnected, handleSOSAlert, handleSOSResolved]);

  const dismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.alertId !== alertId));
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm w-full">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-white border border-red-200 rounded-2xl shadow-[0_8px_32px_rgba(220,38,38,0.18)] overflow-hidden"
        >
          {/* Red top accent bar */}
          <div className="h-1 w-full bg-red-500" />

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-base">
                  🚨
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide">SOS Emergency Alert</h3>
                </div>
              </div>
              <button
                onClick={() => dismissAlert(alert.alertId)}
                className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none p-1"
              >
                ×
              </button>
            </div>

            <div className="bg-red-50 rounded-xl p-3 mb-3">
              <p className="font-semibold text-gray-900">{alert.userName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{alert.userEmail}</p>
              {alert.userLocation?.travelCity && (
                <p className="text-sm text-gray-600 mt-1">
                  📍 {alert.userLocation.travelCity}
                  {alert.userLocation.travelCountry && `, ${alert.userLocation.travelCountry}`}
                </p>
              )}
            </div>

            <p className="text-sm text-gray-700 mb-3 font-medium">{alert.message}</p>

            <div className="flex gap-2">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${alert.userEmail}&su=Emergency%20Response%20-%20SOS%20Alert&body=Hi%20${alert.userName},%0D%0A%0D%0AI%20saw%20your%20SOS%20alert.%20How%20can%20I%20help%3F`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold text-center rounded-lg hover:bg-red-50 transition-colors"
              >
                📧 Email
              </a>
              <a
                href={`/chats/new?userId=${alert.userId}`}
                className="flex-1 px-3 py-2 bg-[#003580] text-white text-sm font-semibold text-center rounded-lg hover:bg-[#002a6e] transition-colors"
              >
                💬 Chat
              </a>
            </div>

            <p className="text-xs text-gray-400 text-center mt-2">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SOSAlertNotification;
