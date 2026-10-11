import { AnimatePresence, motion } from "motion/react";
import { TbX } from "react-icons/tb";
import { GiPanda } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";
import { useState, useEffect } from "react";
import {
  TbLogin2,
  TbSettings,
  TbCopy,
  TbDownload,
} from "react-icons/tb";
import { HiSparkles } from "react-icons/hi2";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../Utils/firebase";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/userSlice";

const steps = [
  {
    icon: TbLogin2,
    title: "Login with Google",
    desc: "Secure OAuth to unlock all AI tools instantly.",
  },
  {
    icon: HiSparkles,
    title: "Get 150 AI Credits",
    desc: "Free credits to generate premium UI components.",
  },
  {
    icon: TbSettings,
    title: "Customize Props",
    desc: "Fine-tune and preview every change live.",
  },
  {
    icon: TbCopy,
    title: "Generate Components",
    desc: "AI builds production-ready JSX components.",
  },
  {
    icon: TbDownload,
    title: "Copy or Save",
    desc: "Export clean code straight into your project.",
  },
];

const Auth = ({ onClose }) => {
  const [active, setActive] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const id = setInterval(() => {
      setActive((s) => (s + 1) % steps.length);
    }, 2000);

    return () => clearInterval(id);
  }, []);

  const googleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);

      const user = response.user;

      const name = user.displayName;
      const email = user.email;

      const result = await axios.post(
        serverUrl + "/api/auth/google",
        {
          name,
          email,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data.user));

      console.log("Backend response:", result.data);

      onClose();
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 38 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.5 }}
          className="relative flex w-full max-w-[880px] max-h-[90vh] flex-col overflow-y-auto rounded-2xl border border-[#3be5ff]/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] sm:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer"
          >
            <TbX size={15} />
          </button>

          {/* Left Side */}
          <div className="sm:w-[52%] bg-gradient-to-br from-[#03181c] to-[#041e24] p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(59,232,255,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: 38 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 items-center justify-start sm:mb-9 mb-7"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] flex items-center justify-center shadow-[0_4px_12px_rgba(59,232,255,0.35)]">
                <GiPanda size={17} color="#051c20" />
              </div>

              <span className="text-[#e8f8fa] font-bold text-xl tracking-tight">
                PandaUI
              </span>
            </motion.div>

            {/* Heading */}
            <p className="text-[10px] font-semibold tracking-[3px] text-[#3be8ff] uppercase mb-4 sm:mb-5">
              How it works
            </p>

            {/* Steps */}
            <div className="flex sm:flex-col gap-2 sm:gap-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 -mx-1 px-1">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={index}
                    onClick={() => setActive(index)}
                    className={`flex-shrink-0 sm:flex-shrink flex items-start gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300 min-w-[200px] sm:min-w-0 cursor-pointer ${
                      active === index
                        ? "bg-[#3be5ff]/7 border-[#3be8ff]/20"
                        : "bg-transparent border-transparent"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        active === index
                          ? "bg-[#3be5ff]/10 text-[#3be5ff]"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      <Icon size={17} />
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <h3
                        className={`text-sm font-semibold transition-colors duration-300 ${
                          active === index
                            ? "text-[#e8f8fa]"
                            : "text-white/50"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {/* Description only for active step */}
                      {active === index && (
                        <p className="mt-1 text-[11px] leading-4 text-white/45">
                          {step.desc}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <motion.div className="flex-1 bg-[#061217] flex flex-col items-center justify-center p-6 sm:p-10 text-center">
            {/* Panda Icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mx-auto mb-5 sm:mb-6 bg-gradient-to-br from-[#3be8ff]/15 to-[#040f12] border border-[#3be8ff]/20 flex items-center justify-center"
            >
              <GiPanda size={22} color="#3be8ff" />
            </motion.div>

            {/* Welcome */}
            <h3
              className="text-xl font-bold text-[#e4f6f8] tracking-tight mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Welcome
            </h3>

            <p className="text-[13px] text-[#96bec8]/55 leading-relaxed mb-6 sm:mb-7">
              Sign in to generate AI-powered UI components in seconds
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-4 sm:gap-5 mb-6 sm:mb-7">
              {[
                ["150", "AI Credits"],
                ["∞", "Components"],
                ["JSX", "Ready"],
              ].map(([v, l], i) => (
                <div key={i} className="text-center">
                  <div className="text-base font-bold text-[#3be8ff]">
                    {v}
                  </div>

                  <div className="text-[10px] text-[#96bec8]/50">
                    {l}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Login Button */}
            <motion.button
              onClick={googleAuth}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-white text-[#0a1a1d] font-semibold text-sm cursor-pointer border-none shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(59,232,255,0.2)] transition-shadow"
            >
              <FcGoogle size={19} />
              Continue with Google
            </motion.button>

            {/* Docs */}
            <p className="text-[11px] text-[#96bec8]/50 mt-4 sm:mt-5">
              No account needed for npm.{" "}
              <span
                onClick={onClose}
                className="text-[#3be8ff]/20 border-b border-[#3be8ff]/20 cursor-pointer hover:text-[#3be8ff]/80 transition-colors"
              >
                view docs~
              </span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Auth;