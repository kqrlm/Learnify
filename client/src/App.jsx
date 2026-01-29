import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Loading from "./pages/Loading";
import Login from "./pages/login";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import { useAppContext } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, loadingUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loadingUser) return <Loading />;

  return (
    <>
      <Toaster />

      {!isMenuOpen && user && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            user ? (
              <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
                <div className="flex h-screen w-screen">
                  <Sidebar
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                  />
                  <ChatBox />
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
