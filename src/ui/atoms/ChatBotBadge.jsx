"use client";
import React, { useState, useEffect } from "react";

const ChatBotBadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessages([]);
      setError(null);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setError(null);
    
    // Add user message to chat
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call the backend API to get response from GROQ
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      // Get response text first to debug
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      // Only parse if we have text
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid response from server. Please try again.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from chatbot");
      }
      
      // Add assistant message to chat
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error.message || "Sorry, I encountered an error. Please try again.";
      setError(errorMessage);
      setMessages([
        ...newMessages,
        { 
          role: "assistant", 
          content: errorMessage 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Badge */}
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 z-50 w-13 h-13 bg-[#003580] hover:bg-[#002a6e] rounded-2xl shadow-[0_4px_14px_rgba(0,53,128,0.4)] hover:shadow-[0_6px_20px_rgba(0,53,128,0.5)] transition-all flex items-center justify-center text-xl text-white cursor-pointer p-3"
        title="Chat with Travel Assistant"
      >
        💬
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-96 h-[520px] bg-white rounded-2xl border border-gray-200 shadow-[0_24px_64px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#003580] px-5 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">✈️</span>
              <h3 className="font-semibold text-base text-white">YathraGo Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors text-sm"
            >
              ×
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-14 h-14 bg-[#003580]/10 rounded-2xl flex items-center justify-center text-3xl mb-4">✈️</div>
                <h4 className="font-semibold text-gray-800 text-base mb-1">Travel Assistant</h4>
                <p className="text-sm text-gray-500">
                  Ask about destinations, activities, and travel tips!
                </p>
                <div className="mt-4 px-4 py-3 bg-white rounded-xl border border-gray-200 text-left">
                  <p className="text-xs text-gray-500"><strong className="text-gray-700">Example:</strong><br/>&ldquo;Best places in Paris?&rdquo;</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                        message.role === "user"
                          ? "bg-[#003580] text-white rounded-br-sm"
                          : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                      }`}
                    >
                      <div className={`text-[10px] font-semibold mb-0.5 ${
                        message.role === "user" ? "text-white/60" : "text-[#003580]"
                      }`}>
                        {message.role === "user" ? "You" : "YathraGo"}
                      </div>
                      <div>{message.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="text-[10px] font-semibold text-[#003580] mb-1">YathraGo</div>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask something..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl resize-none min-h-10 max-h-24 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all text-sm text-gray-900 placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isLoading || !inputValue.trim()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#003580] text-white hover:bg-[#002a6e]"
                }`}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotBadge;