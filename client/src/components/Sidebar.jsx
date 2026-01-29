import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate, createNewChat, axios, fetchUserChats, setToken, token, logout  
  } = useAppContext();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
  };


  const deleteChat = async (e, chatId) => {
      try {
        e.stopPropagation();
        const confirm = window.confirm("Are you sure you want to delete this chat?");
        if (!confirm) return;
        const { data } = await axios.post("/api/chat/delete", { chatId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          await fetchUserChats();
          toast.success("Chat deleted successfully");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
  }

  return (
    <div
      className={`flex flex-col h-screen min-w-72
        dark:bg-gradient-to-b dark:from-[#242124]/30 dark:to-[#000000]/30
        border-r border-[#80609f]/30 backdrop-blur-3xl
        transition-all duration-500 max-md:absolute left-0 z-10 p-4
        ${!isMenuOpen ? "max-md:-translate-x-full" : ""}`}
    >
      {/* Close Button (Mobile) */}
      <img
        onClick={() => setIsMenuOpen(false)}
        src={assets.close_icon}
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
        alt="close"
      />

      {/* Logo */}
      <div className="flex justify-center w-full mb-6">
        <img
          src={theme === "dark" ? assets.logo_white_full : assets.logo_dark_full}
          alt="Logo"
          className="w-40 object-contain"
        />
      </div>

      {/* New Chat */}
      <button onClick={createNewChat} className="flex justify-center items-center w-full py-2 text-white bg-gradient-to-r from-[#87CEFA] to-[#000039] text-sm rounded-md cursor-pointer">
        <span className="mr-2 text-xl">+</span>
        New Chat
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
        <img src={assets.search_icon} className="w-4 dark:invert" alt="Search" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations"
          className="text-xs placeholder:text-gray-400 outline-none bg-transparent w-full"
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}

      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0].content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id || chat.id}
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setIsMenuOpen(false);
              }}
              className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex items-center justify-between gap-2 group"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>

              {/* Delete Icon */}
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(e, chat._id);
                }}
                src={assets.bin_icon}
                className="w-4 h-5 cursor-pointer invert dark:invert-0 flex-shrink-0"
                alt="Delete"
              />
            </div>
          ))}
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
        <div className="flex items-center gap-2 text-sm">
          <img
            src={assets.theme_icon}
            className="w-4 invert dark:invert-0"
            alt="Theme"
          />
          <p>Dark Mode</p>
        </div>

        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      {/* User Account */}
      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
        <img src={assets.user_icon} className="w-7 rounded-full" alt="User" />
        <p className="flex-1 text-sm dark:text-primary truncate">
          {user ? user.name : "Login your account"}
        </p>
        {user && (
          <img 
            onClick={handleLogout}
            src={assets.logout_icon}
            className="w-5 h-5 cursor-pointer invert dark:invert-0"
            alt="Logout"
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
