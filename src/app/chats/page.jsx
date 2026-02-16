"use client";
import React, { useState, useEffect } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/ui/atoms/Loader";
import Link from "next/link";

const ChatsHomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchChats();
    }
  }, [session]);

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <Loader />;
  }

  const colors = ["#FF6B6B", "#4ADE80", "#00D9FF", "#FFC700", "#FF69B4"];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MainNavbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#00D9FF] to-[#4ADE80] border-b-4 border-black py-12 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase">
              Chat Rooms
            </h1>
            <p className="text-xl font-bold">
              Connect with your travel companions
            </p>
          </div>
          <Link
            href="/discover"
            className="px-6 py-3 bg-[#FFC700] border-4 border-black font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            + New Chat
          </Link>
        </div>
      </section>

      {/* Chats List */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : chats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chats.map((chat, index) => {
              const isGroupChat = chat.isGroup;
              const chatName = isGroupChat
                ? chat.name
                : chat.members?.find((m) => m._id !== session?.user?.id)?.name || "Unknown";
              const lastMessage = chat.lastMessage || "No messages yet";

              return (
                <Link
                  key={chat._id}
                  href={`/chats/${chat._id}`}
                  className="bg-white border-4 border-black text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  {/* Header */}
                  <div
                    className="p-4 border-b-4 border-black text-black"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center font-black text-xl text-black">
                        {isGroupChat ? "👥" : chatName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-black truncate text-black">{chatName}</h3>
                        {isGroupChat && (
                          <p className="text-sm font-medium text-black">
                            {chat.members?.length} members
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="font-medium text-gray-600 truncate">
                      {lastMessage}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-500">
                        {chat.lastMessageAt
                          ? new Date(chat.lastMessageAt).toLocaleDateString()
                          : ""}
                      </span>
                      <span className="px-3 py-1 bg-[#FFC700] border-2 border-black font-black text-sm text-black">
                        Open →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💬</div>
            <h3 className="text-3xl font-black mb-4 uppercase">No Chats Yet</h3>
            <p className="text-xl font-medium mb-8">
              Start connecting with travelers to begin chatting
            </p>
            <Link
              href="/discover"
              className="inline-block px-8 py-4 bg-[#4ADE80] border-4 border-black font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Discover Travelers
            </Link>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="bg-white border-y-4 border-black py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-6 uppercase">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/discover"
              className="p-6 bg-[#FF6B6B] border-4 border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-xl font-black mb-2">Find Travelers</h3>
              <p className="font-medium">Discover new travel companions</p>
            </Link>
            <Link
              href="/trip-advisor"
              className="p-6 bg-[#4ADE80] border-4 border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <div className="text-4xl mb-3">🗺️</div>
              <h3 className="text-xl font-black mb-2">Explore Destinations</h3>
              <p className="font-medium">Browse popular travel spots</p>
            </Link>
            <Link
              href="/profile"
              className="p-6 bg-[#00D9FF] border-4 border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-xl font-black mb-2">Update Profile</h3>
              <p className="font-medium">Keep your travel plans current</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function ChatsHome() {
  return (
    <Provider>
      <ChatsHomePage />
    </Provider>
  );
}
