"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";

const SOSButton = ({ className = "" }) => {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [isTriggering, setIsTriggering] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSOSClick = () => {
    setShowConfirm(true);
  };

  const confirmSOS = async () => {
    if (!session?.user) {
      alert("You must be logged in to send an SOS alert.");
      return;
    }

    setIsTriggering(true);

    try {
      // Save to database
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

      // Broadcast via socket to all connected users
      if (socket && isConnected) {
        socket.emit("trigger-sos", {
          alertId: data.alert._id,
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          userLocation: {
            travelCity: session.user.travelCity || "",
            travelCountry: session.user.travelCountry || "",
          },
          message: data.alert.message,
        });
      }

      setShowConfirm(false);
      alert("🚨 SOS alert sent! Help is on the way!");
    } catch (error) {
      console.error("Error sending SOS:", error);
      alert("Failed to send SOS alert. Please try again.");
    } finally {
      setIsTriggering(false);
    }
  };

  const cancelSOS = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`}>
        <div className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.2)] p-7 max-w-sm w-full mx-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            🚨
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            Confirm SOS Alert
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            This will send an emergency alert to ALL logged-in users. Are you sure you need help?
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmSOS}
              disabled={isTriggering}
              className="flex-1 py-3 font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTriggering ? "Sending..." : "Yes, Send SOS"}
            </button>
            <button
              onClick={cancelSOS}
              disabled={isTriggering}
              className="flex-1 py-3 font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleSOSClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors ${className}`}
      title="Emergency SOS - Click to send alert to all users"
    >
      🚨 SOS
    </button>
  );
};

export default SOSButton;
