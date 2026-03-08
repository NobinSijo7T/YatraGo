"use client";
import React, { useState } from "react";

const ChatInput = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage(""); // Clear input after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all"
      />
      <button
        onClick={handleSendMessage}
        disabled={!newMessage.trim()}
        className="px-5 py-2.5 bg-[#003580] text-white text-sm font-semibold rounded-xl hover:bg-[#002a6e] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
