import React from "react";
import ChatList from "../organisms/ChatList";
import MainNavbar from "../organisms/MainNavbar";
import MessagePanel from "../organisms/MessagePanel";
import Scene from "../organisms/Scene";

const ChatPage = ({ type }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MainNavbar />
      <div className="flex w-full overflow-hidden" style={{ height: 'calc(100vh - 112px)' }}>
        <div className="w-[30%] max-md:hidden border-r border-gray-200 bg-white">
          <ChatList />
        </div>
        <div className="w-[70%] max-md:w-full">
          {type === "dashboard" ? <Scene /> : <MessagePanel />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
