"use client";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import MessageItem from "../molecules/MessageItem";
import ChatInput from "../molecules/ChatInput";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation"; // To get chatId from the URL

let socket;

const MessagePanel = () => {
  const [messages, setMessages] = useState([]);
  const [chatDetails, setChatDetails] = useState(null); // State to store chat details (name, profile pic, etc.)
  const { data: session } = useSession(); // To get the logged-in user's info
  const { chatId } = useParams(); // Assume you're using dynamic routing with chatId in the URL
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to check if chatId is valid
  const isValidChatId = (id) => {
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    return id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
  };

  useEffect(() => {
    // Skip socket and data fetching for invalid chatIds (like "new")
    if (!isValidChatId(chatId)) {
      console.log("Invalid or new chat ID, skipping data fetch");
      return;
    }

    // Call the API route to initialize the Socket.IO server
    fetch("/api/socket");

    // Connect to the Socket.IO server
    socket = io();

    // Check if socket is initialized
    if (!socket) {
      console.error("Socket.IO client failed to initialize");
      return;
    }

    // Join the specific chat room
    socket.emit("joinChat", chatId);
    console.log("Joined chat:", chatId); // Debugging

    // Fetch previous messages from the database when the component loads
    getMessages();

    // Fetch chat details (name, profile picture, etc.)
    fetchChatDetails();

    // Listen for incoming messages from the server

    // Clean up on component unmount
    return () => {
      if (socket) {
        socket.emit("leaveChat", chatId);
        socket.disconnect();
        console.log("Left chat:", chatId); // Debugging
      }
    };
  }, [chatId]);

  // Function to handle sending a new message
  const addMessage = async (newMessage) => {
    if (newMessage.trim()) {
      const tempId = Date.now().toString();
      const messageData = {
        content: newMessage,
        sender: session?.user?.id, // Use user ID instead of email
        chatId,
        timestamp: new Date().toISOString(),
      };

      // Optimistic UI update - show message immediately
      const optimisticMessage = {
        ...messageData,
        _id: tempId,
        sender: {
          _id: session?.user?.id,
          name: session?.user?.name,
          email: session?.user?.email
        }
      };
      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

      console.log("Sending message:", messageData); // Debugging

      // Check if socket is initialized before emitting
      if (socket) {
        console.log("Emitting message via Socket.IO");
        socket.emit("sendMessage", messageData);
      }

      // Send message to the server
      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const savedMessage = await response.json();

        console.log("Message saved:", savedMessage); // Debugging

        // Replace optimistic message with saved message from server
        setMessages((prevMessages) => 
          prevMessages.map(msg => msg._id === tempId ? savedMessage : msg)
        );
      } catch (error) {
        console.error("Error sending message:", error);
        // Remove optimistic message on error
        setMessages((prevMessages) => 
          prevMessages.filter(msg => msg._id !== tempId)
        );
      }
    }
  };
  // Function to fetch previous messages for the current chat
  const getMessages = async () => {
    try {
      const response = await fetch(`/api/messages?chatId=${chatId}`);
      const data = await response.json();
      console.log("Fetched messages:", data); // Debugging
      // Ensure data is an array before setting messages
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Messages data is not an array:", data);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error.message);
      setMessages([]);
    }
  };

  // Function to fetch chat details (name, profile picture, etc.)
  const fetchChatDetails = async () => {
    try {
      const userId = session?.user?.id || '';
      const response = await fetch(`/api/chats/${chatId}?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat details");
      }
      const data = await response.json();
      console.log("Fetched chat details:", data); // Debugging
      setChatDetails(data);
    } catch (error) {
      console.error("Failed to fetch chat details:", error.message);
      setChatDetails(null);
    }
  };

  // Show placeholder for invalid chatId
  if (!isValidChatId(chatId)) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-8xl mb-4">💬</div>
          <h3 className="text-2xl font-black text-black mb-2">Select a Chat</h3>
          <p className="text-lg font-medium text-black">Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-[#4ADE80] border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border-3 border-black rounded-full overflow-hidden flex items-center justify-center font-black text-2xl text-black">
            {chatDetails?.isGroup ? '👥' : '👤'}
          </div>
          <div>
            <h3 className="text-xl font-black text-black">
              {chatDetails ? (
                chatDetails.isGroup
                  ? chatDetails.groupName || 'Group Chat'
                  : chatDetails.otherUserName || 'Chat'
              ) : (
                'Loading...'
              )}
            </h3>
            <p className="text-sm font-bold text-black opacity-80">
              {chatDetails ? (
                chatDetails.isGroup ? `${chatDetails.members?.length || 0} members` : 'Online'
              ) : (
                'Connecting...'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!Array.isArray(messages) || messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">💭</div>
              <p className="text-lg font-bold text-black">No messages yet</p>
              <p className="text-sm font-medium text-black opacity-70">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isOwnMessage = msg.sender?._id === session?.user?.id || msg.sender === session?.user?.id;
              return (
                <MessageItem
                  key={msg._id || index}
                  message={msg.content}
                  sender={msg.sender}
                  timestamp={msg.timestamp || msg.createdAt}
                  isOwnMessage={isOwnMessage}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t-4 border-black bg-white">
        <ChatInput onSendMessage={addMessage} />
      </div>
    </div>
  );
};

export default MessagePanel;
