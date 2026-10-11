import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import {
  TbCode, TbWorld, TbLock, TbSearch,
  TbPackage, TbChevronRight, TbBoxOff,
} from "react-icons/tb";
import { HiSparkles } from "react-icons/hi2";
import { SiValorant } from "react-icons/si";

function MyComponents() {
  const navigate = useNavigate();
  const { userData, allComponents } = useSelector((s) => s.user);
  const [search, setSearch] = useState("");

  // Filter to only this user's components
  const myComponents = useMemo(() => {
    if (!userData || !allComponents) return [];
    return allComponents
      .filter((c) => c.owner?._id === userData._id || c.owner === userData._id)
      .filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()))
      .sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // newest first
      );
  }, [userData, allComponents, search]);

  // Stats
  const totalCount = myComponents.length;
  const publicCount = myComponents.filter((c) => c.visibility === "public").length;
  const privateCount = totalCount - publicCount;

  return (
    <div
      className="min-h-screen bg-[#030b0d] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ─────── NAVBAR ─────── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 border-b border-white/[0.05] bg-[#030b0d]/90 backdrop-blur-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] flex items-center justify-center shadow-[0_0_14px_rgba(59,232,255,0.35)]">
            <SiValorant size={13} color="#051c20" />
          </div>
          <span
            className="text-sm sm:text-base font-bold"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            VirtualUI
          </span>
        </button>

        <button
          onClick={() => navigate("/generate")}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#030b0d] bg-gradient-to-r from-[#3be8ff] to-[#0ab5d4] hover:opacity-90 transition-all shadow-[0_0_20px_rgba(59,232,255,0.2)] cursor-pointer border-none"
        >
          <HiSparkles size={14} />
          <span className="hidden xs:inline">New Component</span>
        </button>
      </nav>

      {/* ─────── CONTENT ─────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            My Components
          </h1>
          <p className="text-white/35 text-sm">
            {totalCount > 0
              ? `You've created ${totalCount} component${totalCount === 1 ? "" : "s"}`
              : "You haven't created any components yet"}
          </p>
        </motion.div>

        {/* Stats Cards */}
        {totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            <StatCard
              label="Total"
              value={totalCount}
              color="#3be8ff"
              icon={TbPackage}
            />
            <StatCard
              label="Public"
              value={publicCount}
              color="#34d399"
              icon={TbWorld}
            />
            <StatCard
              label="Private"
              value={privateCount}
              color="#a78bfa"
              icon={TbLock}
            />
          </motion.div>
        )}

        {/* Search */}
        {totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative max-w-md">
              <TbSearch
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your components..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#3be8ff]/40 transition-colors"
              />
            </div>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {totalCount === 0 ? (
            <EmptyState onCreate={() => navigate("/generate")} />
          ) : myComponents.length === 0 ? (
            <NoResults />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {myComponents.map((component, i) => (
                <ComponentCard
                  key={component._id}
                  component={component}
                  index={i}
                  onClick={() => navigate(`/components`)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div
      className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}25`,
        }}
      >
        <Icon size={15} style={{ color }} />
      </div>
      <p className="text-xl sm:text-2xl font-bold">{value}</p>
      <p className="text-white/40 text-xs mt-0.5">{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Component Card
// ─────────────────────────────────────────────────────────────
function ComponentCard({ component, index, onClick }) {
  const isPublic = component.visibility === "public";

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onClick}
      className="group text-left p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-[#3be8ff]/25 hover:bg-white/[0.04] transition-all cursor-pointer"
    >
      {/* Top row: icon + visibility badge */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(59,232,255,0.1)",
            border: "1px solid rgba(59,232,255,0.2)",
          }}
        >
          <TbCode size={15} className="text-[#3be8ff]" />
        </div>

        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
          style={{
            background: isPublic
              ? "rgba(52,211,153,0.1)"
              : "rgba(167,139,250,0.1)",
            color: isPublic ? "#34d399" : "#a78bfa",
            border: `1px solid ${isPublic ? "rgba(52,211,153,0.25)" : "rgba(167,139,250,0.25)"}`,
          }}
        >
          {isPublic ? <TbWorld size={9} /> : <TbLock size={9} />}
          {isPublic ? "Public" : "Private"}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-white truncate mb-1 group-hover:text-[#3be8ff] transition-colors">
        {component.name}
      </h3>

      {/* Props */}
      <p className="text-xs text-white/30 truncate mb-3">
        {component.props?.length > 0
          ? `${component.props.length} prop${component.props.length === 1 ? "" : "s"}`
          : "No props"}
      </p>

      {/* Footer: date + arrow */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
        <span className="text-[10px] text-white/25">
          {new Date(component.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <TbChevronRight
          size={13}
          className="text-white/20 group-hover:text-[#3be8ff] group-hover:translate-x-0.5 transition-all"
        />
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────
function EmptyState({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 sm:py-24"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#3be8ff]/[0.08] border border-[#3be8ff]/20 flex items-center justify-center mx-auto mb-5">
        <TbPackage size={28} className="text-[#3be8ff]" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold mb-2">
        No components yet
      </h2>
      <p className="text-white/35 text-sm mb-6 max-w-sm mx-auto">
        Start building your library by generating your first
        component with AI.
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#030b0d] bg-gradient-to-r from-[#3be8ff] to-[#0ab5d4] hover:opacity-90 transition-all shadow-[0_0_20px_rgba(59,232,255,0.2)] cursor-pointer border-none"
      >
        <HiSparkles size={15} /> Generate First Component
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// No Results
// ─────────────────────────────────────────────────────────────
function NoResults() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
        <TbBoxOff size={22} className="text-white/20" />
      </div>
      <p className="text-white/35 text-sm">
        No components match your search
      </p>
    </motion.div>
  );
}

export default MyComponents;