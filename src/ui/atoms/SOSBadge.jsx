"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";

const SOSBadge = () => {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [isTriggering, setIsTriggering] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSOSClick = () => {
    if (!session?.user) {
      alert("You must be logged in to send an SOS alert.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSOS = async () => {
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

  // Only show if user is logged in
  if (!session?.user) {
    return null;
  }

  return (
    <>
      {/* SOS Badge - clean minimal */}
      <button
        onClick={handleSOSClick}
        className="fixed bottom-8 right-24 z-50 w-13 h-13 bg-red-600 hover:bg-red-700 rounded-2xl shadow-[0_4px_14px_rgba(220,38,38,0.5)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.6)] transition-all flex items-center justify-center text-xl text-white cursor-pointer p-3"
        title="Emergency SOS - Send alert to all users"
      >
        🚨
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.2)] p-7 max-w-sm mx-4">
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
      )}
    </>
  );
};

export default SOSBadge;
