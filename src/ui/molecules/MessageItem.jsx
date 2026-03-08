const MessageItem = ({ message, sender, timestamp, isOwnMessage }) => {
  const senderName = isOwnMessage ? "You" : (sender?.name || sender?.email || "Unknown");
  const time = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
          isOwnMessage
            ? "bg-[#003580] text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        }`}
      >
        {!isOwnMessage && (
          <p className="text-xs font-semibold text-[#009fe3] mb-0.5">{senderName}</p>
        )}
        <p className="text-sm break-words leading-relaxed">{message}</p>
        <span className={`text-[10px] mt-1 block ${
          isOwnMessage ? "text-white/60 text-right" : "text-gray-400"
        }`}>
          {time}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
