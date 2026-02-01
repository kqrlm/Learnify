import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { axios, setToken, fetchUser } = useAppContext();
  const navigate = useNavigate();

  // ✅ LOOPING Typewriter text
  const fullText = `Welcome to Learnify, a Smart Web-Based Tutoring Platform with AI assistance for students. Designed to support students in their learning journey, the system provides an interactive and accessible environment where learners can ask questions, explore academic concepts, and receive timely, relevant guidance. Learnify integrates intelligent tutoring features to promote independent learning, enhance comprehension, and support academic performance across various subjects. By leveraging artificial intelligence, the platform aims to personalize learning experiences, encourage critical thinking, and serve as a reliable academic companion for students in both formal and informal learning settings.`;
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let deleting = false;

    const typeSpeed = 55;
    const deleteSpeed = 30;
    const pauseAfterType = 2000;
    const pauseAfterDelete = 1000;

    let timeout;

    const tick = () => {
      if (!deleting) {
        index++;
        setDisplayedText(fullText.slice(0, index));

        if (index === fullText.length) {
          deleting = true;
          timeout = setTimeout(tick, pauseAfterType);
          return;
        }
        timeout = setTimeout(tick, typeSpeed);
      } else {
        index--;
        setDisplayedText(fullText.slice(0, index));

        if (index === 0) {
          deleting = false;
          timeout = setTimeout(tick, pauseAfterDelete);
          return;
        }
        timeout = setTimeout(tick, deleteSpeed);
      }
    };

    tick();
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = state === "login" ? "/api/user/login" : "/api/user/register";

    try {
      const { data } = await axios.post(url, { name, email, password });

      if (data.success) {
        const newToken = data.token;
        setToken(newToken);
        localStorage.setItem("token", newToken);

        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        await fetchUser(newToken);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-sky-300 via-emerald-200 to-yellow-200 p-3">
      <div className="min-h-[calc(100vh-24px)] w-full">
        <div className="min-h-[calc(100vh-24px)] w-full flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            {/* LEFT: Branding (TEXT ONLY) */}
            <div className="w-full lg:w-1/2 flex flex-col items-start self-start">
              <div className="flex flex-col">
                <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-black leading-none">
                  LEARNIFY
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-yellow-500 mt-1">
                  AI Tutor Assistant
                </p>
              </div>

              {/* ✅ Typewriter paragraph */}
              <p className="mt-8 max-w-xl text-sm sm:text-base text-black/70 leading-relaxed">
                {displayedText}
                <span className="animate-pulse">|</span>
              </p>
            </div>

            {/* RIGHT: Login card */}
            <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-[28px] bg-white/80 backdrop-blur-md shadow-[0_25px_60px_rgba(0,0,0,0.20)] p-8"
              >
                <div className="flex flex-col items-center mb-6">
                  <h2 className="mt-3 text-2xl font-extrabold text-black">
                    {state === "login" ? "Login" : "Sign Up"}
                  </h2>
                </div>

                {state === "register" && (
                  <div className="w-full mb-4">
                    <p className="text-sm font-medium text-black/70 mb-2">
                      Name
                    </p>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      placeholder="Type here"
                      className="w-full rounded-full border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                      type="text"
                      required
                    />
                  </div>
                )}

                <div className="w-full mb-4">
                  <p className="text-sm font-medium text-black/70 mb-2">Email</p>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Type here"
                    className="w-full rounded-full border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    type="email"
                    required
                  />
                </div>

                <div className="w-full mb-5">
                  <p className="text-sm font-medium text-black/70 mb-2">
                    Password
                  </p>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="Type here"
                    className="w-full rounded-full border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                    type="password"
                    required
                  />
                </div>

                <p className="text-sm text-black/70 mb-5 text-center">
                  {state === "register"
                    ? "Already have an account? "
                    : "Create an account? "}
                  <span
                    onClick={() =>
                      setState(state === "login" ? "register" : "login")
                    }
                    className="text-cyan-600 font-semibold cursor-pointer hover:underline"
                  >
                    {state === "register" ? "Login" : "Sign Up"}
                  </span>
                </p>

                <button
                  type="submit"
                  className="w-full rounded-full bg-cyan-600 hover:bg-cyan-700 transition-all text-white font-semibold py-3"
                >
                  {state === "register" ? "Create Account" : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
