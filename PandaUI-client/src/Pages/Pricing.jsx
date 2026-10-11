import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "motion/react";
import axios from "axios";
import { TbArrowLeft, TbCheck, TbLock, TbSparkles } from "react-icons/tb";
import { HiSparkles } from "react-icons/hi2";
import { setUserData } from "../Redux/userSlice";
import { serverUrl } from "../App";

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((s) => s.user);
  const [loading, setLoading] = useState(false);

  const currentPlan = userData?.plan || "free";

  const handleBuy = async () => {
    if (loading) return;

    if (!userData) {
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const { data: order } = await axios.post(
        `${serverUrl}/api/payment/create-order`,
        { amount: 99 },
        { withCredentials: true }
      );

      // 2. Configure Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "VirtualUI",
        description: "Pro Plan — 200 AI Credits",
        order_id: order.id,
        handler: async (response) => {
          try {
            const { data } = await axios.post(
              `${serverUrl}/api/payment/verify`,
              response,
              { withCredentials: true }
            );

            if (data.success) {
              dispatch(
                setUserData({
                  ...userData,
                  aiCredits: data.remainingCredits,
                  plan: data.plan,
                })
              );
              alert(
                `Payment successful! You now have ${data.remainingCredits} credits.`
              );
              navigate("/");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verify error:", err);
            alert("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
        },
        theme: { color: "#6366f1" },
      };

      // 3. Open Razorpay
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#030b0d] text-white relative overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(59,232,255,0.05)_1px,transparent_1px)] bg-[size:26px_26px] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-96 bg-[radial-gradient(ellipse,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm transition-colors mb-8 sm:mb-12 cursor-pointer bg-transparent border-none"
        >
          <TbArrowLeft size={16} /> Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-white/[0.04] border border-white/[0.08]">
            <HiSparkles size={13} className="text-[#3be8ff]" />
            <span className="text-[11px] font-semibold tracking-[2px] uppercase text-white/60">
              AI Credits
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-[1.05]"
            style={{
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Simple{" "}
            <span className="bg-gradient-to-r from-[#3be8ff] to-[#0ab5d4] bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>

          <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Choose a plan that fits your workflow. Credits are used each
            time you generate a component.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          <PlanCard
            index={0}
            badge={currentPlan === "free" ? "Current Plan" : null}
            name="Free"
            description="Get started with AI-powered component generation."
            price="Free"
            credits={150}
            features={[
              "150 AI Credits included",
              "Save components",
              "Preview & export code",
              "Community support",
            ]}
            isActive={currentPlan === "free"}
            actionLabel={currentPlan === "free" ? "Active" : "Current Plan"}
            onAction={null}
          />

          <PlanCard
            index={1}
            badge="Most Popular"
            highlighted
            name="Pro"
            description="More credits to build faster with no interruptions."
            price="₹99"
            credits={200}
            features={[
              "200 AI Credits added",
              "Save components",
              "Preview & export code",
              "Priority support",
            ]}
            isActive={currentPlan === "pro"}
            actionLabel={loading ? "Processing..." : "Buy for ₹99"}
            onAction={handleBuy}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/25 text-xs mt-8 sm:mt-10"
        >
          Credits are added to your account instantly after payment.
        </motion.p>
      </div>
    </div>
  );
}

function PlanCard({
  badge,
  highlighted = false,
  name,
  description,
  price,
  credits,
  features,
  isActive,
  actionLabel,
  onAction,
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative rounded-2xl p-6 sm:p-7 overflow-hidden"
      style={{
        background: highlighted
          ? "linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 100%)"
          : "rgba(255,255,255,0.02)",
        border: highlighted
          ? "1px solid rgba(99,102,241,0.3)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: highlighted ? "0 0 40px rgba(99,102,241,0.15)" : "none",
      }}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3be8ff]/60 to-transparent" />
      )}

      <div className="flex items-center justify-between mb-5 h-6">
        {badge ? (
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
            style={{
              background: highlighted
                ? "rgba(99,102,241,0.2)"
                : "rgba(255,255,255,0.05)",
              color: highlighted ? "#a78bfa" : "rgba(255,255,255,0.5)",
              border: highlighted
                ? "1px solid rgba(99,102,241,0.3)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {badge}
          </span>
        ) : (
          <div />
        )}
        {isActive && <TbLock size={14} className="text-white/20" />}
      </div>

      <h3 className="text-lg sm:text-xl font-bold mb-1">{name}</h3>
      <p className="text-white/40 text-xs sm:text-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="mb-4">
        <p
          className="text-4xl sm:text-5xl font-bold"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {price}
        </p>
      </div>

      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-6 bg-[#3be8ff]/[0.08] border border-[#3be8ff]/20">
        <TbSparkles size={11} className="text-[#3be8ff]" />
        <span className="text-[11px] font-semibold text-[#3be8ff]">
          {credits} AI Credits
        </span>
      </div>

      <div className="h-px bg-white/[0.06] mb-5" />

      <ul className="space-y-3 mb-7">
        {features.map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-xs sm:text-sm text-white/60"
          >
            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#3be8ff]/[0.1]">
              <TbCheck size={10} className="text-[#3be8ff]" />
            </div>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={onAction}
        disabled={isActive || !onAction}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer border-none disabled:cursor-not-allowed"
        style={{
          background: isActive
            ? "rgba(255,255,255,0.03)"
            : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          color: isActive ? "rgba(255,255,255,0.3)" : "#fff",
          boxShadow: isActive ? "none" : "0 0 24px rgba(99,102,241,0.4)",
          border: isActive ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}
      >
        {isActive ? (
          <span className="flex items-center justify-center gap-1.5">
            <TbCheck size={13} /> {actionLabel}
          </span>
        ) : (
          actionLabel
        )}
      </button>
    </motion.div>
  );
}

export default Pricing;