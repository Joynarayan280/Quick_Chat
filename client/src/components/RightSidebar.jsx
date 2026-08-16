import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  // get all images from messages with the selected user
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    selectedUser && (
      <div className="hidden lg:flex lg:w-[32%] xl:w-[25%] h-full flex-col bg-[#0B0C1E]/90 text-white">

        {/* USER */}
        <div className="pt-10 text-center px-4">
          <img src={selectedUser.profilePic || assets.avatar_icon} className="w-20 h-20 rounded-full mx-auto"/>
          <h2 className="mt-2 flex items-center justify-center gap-2">
            {onlineUsers?.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
            {selectedUser.fullName}
          </h2>
          <p className="text-xs text-gray-400">{selectedUser.bio}</p>
        </div>

        <hr className="my-4 border-gray-600"/>

        {/* MEDIA */}
        <div className="flex-1 overflow-y-auto px-4">
          <p className="text-xs mb-2">Media</p>
          <div className="grid grid-cols-2 gap-2">
            {msgImages.map((img, i) => (
              <img
                onClick={() => window.open(img)}
                key={i}
                src={img}
                className="rounded-md cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* LOGOUT */}
        <div className="p-4">
          <button onClick={logout} className="w-full bg-purple-600 py-2 rounded-full">
            Logout
          </button>
        </div>

      </div>
    )
  )
}

export default RightSidebar