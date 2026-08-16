import React, { useContext, useEffect, useState, useRef } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const Sidebar = () => {
  const navigate = useNavigate();

  const { users, getUsers, unseenMessages, setUnseenMessages, selectedUser, setSelectedUser } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const filteredUsers = input
    ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase()))
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`bg-[#8185B2]/10 w-full md:w-[38%] lg:w-[32%] xl:w-[25%] h-full flex-col text-white 
      ${selectedUser ? "hidden md:flex" : "flex"}`}
    >

      {/* TOP */}
      <div className="p-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          <div className="relative py-2" ref={menuRef}>
            <img
              src={assets.menu_icon}
              alt=""
              onClick={() => setMenuOpen((prev) => !prev)}
              className="max-h-5 cursor-pointer"
            />

            <div
              className={`absolute top-full right-0 z-20 w-32 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 ${
                menuOpen ? "block" : "hidden"
              }`}
            >
              <p
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-gray-500" />
              <p
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="cursor-pointer text-sm"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-2 px-4 mt-5'>
          <img src={assets.search_icon} alt="" className='w-3' />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder='Search User...'
            className='bg-transparent outline-none text-white text-xs flex-1 placeholder-[#c8c8c8]'
          />
        </div>
      </div>

      {/* USER LIST (ONLY SCROLL HERE ✅) */}
      <div className='flex-1 overflow-y-auto px-2 space-y-1'>
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer text-sm
            ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : 'hover:bg-[#282142]/30'}`}
          >

            <img
              src={user?.profilePic || assets.avatar_icon}
              className='w-9 h-9 rounded-full'
              alt=""
            />

            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>

              {onlineUsers?.includes(user._id) ? (
                <span className='text-green-400 text-xs'>Online</span>
              ) : (
                <span className='text-neutral-400 text-xs'>Offline</span>
              )}
            </div>

            {unseenMessages[user._id] > 0 && (
              <p className='absolute top-3 right-3 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
                {unseenMessages[user._id]}
              </p>
            )}

          </div>
        ))}
      </div>

    </div>
  )
}

export default Sidebar