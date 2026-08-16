import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const { selectedUser } = useContext(ChatContext)

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black/30 backdrop-blur-sm">

      <div className="w-full h-full sm:w-[95%] sm:h-[92vh] md:w-[90%] md:h-[90vh] md:max-w-6xl flex sm:rounded-2xl overflow-hidden sm:border sm:border-gray-700">

        {/* LEFT */}
        <Sidebar />

        {/* CHAT */}
        <div className={`${selectedUser ? "flex" : "hidden md:flex"} flex-1 w-full h-full min-w-0`}>
          <ChatContainer />
        </div>

        {/* RIGHT */}
        {selectedUser && (
          <RightSidebar />
        )}

      </div>
    </div>
  )
}

export default HomePage