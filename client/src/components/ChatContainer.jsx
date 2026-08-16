import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  // send a text message
  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // send an image message
  const handleSendImage = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ SAFE CHECK (important)
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <img src={assets.logo_icon} className="w-16" alt="" />
        <p className="text-lg text-white mt-2">
          Chat anytime, anywhere
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full min-w-0 flex flex-col backdrop-blur-lg">

      {/* HEADER */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500">
        <img src={selectedUser?.profilePic || assets.avatar_icon} className="w-8 rounded-full shrink-0" alt="" />

        <p className="flex-1 min-w-0 text-lg text-white flex items-center gap-2 truncate">
          {selectedUser?.fullName}
          {onlineUsers?.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-7 cursor-pointer"
          alt=""
        />

        <img src={assets.help_icon} className="max-md:hidden max-w-5" alt="" />
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {messages.map((msg, index) => {
          const isMe = msg.senderId === authUser._id;

          return (
            <div
              key={msg._id || index}
              className={`w-full flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${
                  isMe ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div className="text-center text-xs">
                  <img
                    src={isMe ? (authUser?.profilePic || assets.avatar_icon) : (selectedUser?.profilePic || assets.avatar_icon)}
                    className="w-6 rounded-full"
                    alt=""
                  />
                  <p className="text-gray-500 text-[10px]">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>

                {/* Message */}
                {msg.image ? (
                  <img
                    src={msg.image}
                    className="max-w-[200px] border border-gray-700 rounded-lg"
                    alt=""
                  />
                ) : (
                  <p
                    className={`px-3 py-2 text-sm text-white break-words
                    bg-violet-500/30 rounded-xl
                    ${isMe ? "rounded-br-none" : "rounded-bl-none"}`}
                  >
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* INPUT (FIXED ❗ no absolute) */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-3 p-3 border-t border-stone-500">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Send message"
            className="flex-1 text-sm p-3 bg-transparent outline-none text-white placeholder-gray-400"
          />
          <input onChange={handleSendImage} type="file" id="image" accept="image/*" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>

        <button type="submit">
          <img src={assets.send_button} className="w-7 cursor-pointer" />
        </button>
      </form>

    </div>
  );
};

export default ChatContainer;