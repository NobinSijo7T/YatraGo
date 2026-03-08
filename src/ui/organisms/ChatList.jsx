"use client";
import React from "react";
import ChatListItem from "../molecules/ChatListItem";
import { useSession } from "next-auth/react";

const ChatList = () => {
  const { data: session } = useSession();
  const [chats, setChats] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchChats = async () => {
      if (!session?.user?.email) return;
      
      try {
        const res = await fetch(`/api/chats?userEmail=${encodeURIComponent(session.user.email)}`);
        if (res.ok) {
          const data = await res.json();
          console.log("📋 Fetched chats:", data);
          console.log("👤 Current user session:", session?.user);
          setChats(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [session]);

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">
            <div className="w-6 h-6 border-2 border-[#003580] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading chats...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">💬</div>
            <p className="font-semibold text-gray-700 mb-1">No chats yet</p>
            <p className="text-sm text-gray-400">Start a conversation!</p>
          </div>
        ) : (
          chats.map((chat) => (
            <ChatListItem key={chat._id} chat={chat} currentUser={session?.user} />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
