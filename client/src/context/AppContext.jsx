import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats } from "../assets/assets";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // ❗ FIXED
  const [chats, setChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async (tokenParam = null) => {
    const authToken = tokenParam || token;
    if (!authToken) return setUser(null);
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchUserChats = async (autoCreate = true) => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        if (data.chats.length === 0 && autoCreate) {
          // Auto-create first chat on login
          try {
            await axios.get("/api/chat/create", {
              headers: { Authorization: `Bearer ${token}` },
            });
            // Refetch without auto-create to avoid infinite loop
            await fetchUserChats(false);
          } catch (err) {
            console.error("Auto-create chat error:", err);
          }
        } else {
          setChat(data.chats);
          if (data.chats.length > 0) {
            setSelectedChat(data.chats[0]);
          } else {
            setSelectedChat(null);
          }
        }
      }
    } catch (error) {
      console.error("Fetch chats error:", error);
      toast.error(error.message);
    }
  };

  const createChat = async () => {
    try {
      const response = await axios.get("/api/chat/create", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        // Refetch chats after creating
        await fetchUserChats();
      }
    } catch (error) {
      console.error("Create chat error:", error);
      toast.error(error.message);
    }
  };

  const createNewChat = async () => {
    if (!user) {
      toast("Login to create a new chat");
      return navigate("/login");
    }

    try {
      await axios.get("/api/chat/create", {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserChats();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setChat([]);
    setSelectedChat(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // 🔥 SINGLE AUTH FLOW
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]);

  // Load chats after login
  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChat([]);
      setSelectedChat(null);
    }
  }, [user]);

  // Theme handling
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        navigate,
        user,
        setUser,
        fetchUser,
        fetchUserChats,
        chats,
        setChat,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        createNewChat,
        logout,
        loadingUser,
        token,
        setToken,
        axios,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
