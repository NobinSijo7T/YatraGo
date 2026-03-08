"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const ChatListItem = ({ chat, currentUser }) => {
  const params = useParams();
  const isActive = params?.chatId === chat._id;

  console.log("💬 ChatListItem - chat:", chat);
  console.log("👤 ChatListItem - currentUser:", currentUser);

  // Get other members (exclude current user)
  // Convert both IDs to strings for comparison
  const currentUserId = currentUser?.id?.toString() || currentUser?._id?.toString();
  const currentUserEmail = currentUser?.email;
  
  const otherMembers = chat?.members?.filter((member) => {
    const memberId = member?._id?.toString();
    const memberEmail = member?.email;
    return memberId !== currentUserId && memberEmail !== currentUserEmail;
  }) || [];

  console.log("👥 ChatListItem - otherMembers:", otherMembers);

  const chatName = chat?.isGroup 
    ? chat.name || "Group Chat"
    : otherMembers[0]?.name || otherMembers[0]?.email || "Unknown";

  const lastMessage = chat?.lastMessage || "";
  const truncatedMessage = lastMessage.length > 30 
    ? lastMessage.substring(0, 30) + "..."
    : lastMessage;

  return (
    <Link href={`/chats/${chat._id}`}>
      <div
        className={`flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
          isActive ? "bg-[#003580]/5 border-l-2 border-l-[#003580]" : ""
        }`}
      >
        {/* Avatar */}
        <div className="w-10 h-10 bg-[#003580] rounded-full flex items-center justify-center text-white text-base flex-shrink-0">
          {chat?.isGroup ? "👥" : "👤"}
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{chatName}</h4>
          {truncatedMessage && (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {truncatedMessage}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ChatListItem;
