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

      const data = await response.json();

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
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#4ADE80] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center text-2xl font-black text-black cursor-pointer"
        aria-label="Open Travel Chatbot"
      >
        🤖
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          {/* Header */}
          <div className="bg-[#4ADE80] border-b-4 border-black p-4 flex justify-between items-center">
            <h3 className="font-black text-lg">🌍 Travel Assistant</h3>
            <button
              onClick={toggleChat}
              className="w-8 h-8 bg-[#FF6B6B] border-2 border-black flex items-center justify-center font-black hover:bg-red-400 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-[#FF6B6B] text-white p-3 border-b-2 border-black font-semibold text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 text-black">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-black">
                <div className="text-4xl mb-4">🌍</div>
                <h4 className="font-black text-xl mb-2 text-black">Welcome to Travel Assistant!</h4>
                <p className="text-gray-700">
                  Ask me anything about travel destinations, activities, or recommendations!
                </p>
                <div className="mt-4 p-3 bg-yellow-100 border-2 border-black rounded">
                  <p className="text-sm text-black"><strong>Example:</strong> "What are the best places to visit in Paris?"</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 border-black text-black ${
                      message.role === "user"
                        ? "bg-blue-100 ml-10 self-end text-right"
                        : "bg-green-100 mr-10"
                    }`}
                  >
                    <div className="font-medium text-black">
                      {message.role === "user" ? "You:" : "Assistant:"}
                    </div>
                    <div className="mt-1 text-black">{message.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="p-3 rounded-lg border-2 border-black bg-green-100 mr-10 text-black">
                    <div className="font-medium text-black">Assistant:</div>
                    <div className="mt-1 flex space-x-2">
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t-4 border-black bg-white">
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about destinations..."
                className="flex-1 p-3 border-4 border-black resize-none min-h-[60px] max-h-32 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-black"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`px-4 py-3 border-4 border-black font-bold ${
                  isLoading || !inputValue.trim()
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#4ADE80] text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[-1px] active:translate-y-[-1px]"
                } transition-all`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotBadge;