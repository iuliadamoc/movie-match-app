"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Film, Tv } from "lucide-react";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Sidebar({
  search,
  setSearch,
  sort,
  setSort,
  setPage,
  genres,
  selectedGenre,
  setSelectedGenre,
  provider,
  setProvider,
  reset,
}: any) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-72 sticky top-6 h-fit bg-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] space-y-6"
    >
      {/* TITLE */}
      <motion.h2 variants={item} className="text-lg font-semibold">
        Filters
      </motion.h2>

      {/* SEARCH */}
      <motion.div variants={item} className="space-y-2">
        <p className="text-xs text-gray-400 uppercase flex items-center gap-1">
          <Search size={14} /> Search
        </p>

        <div className="relative">
          <input
            placeholder="Search movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 pl-9 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
          />

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </motion.div>

      {/* SORT */}
      <motion.div variants={item} className="space-y-2">
        <p className="text-xs text-gray-400 uppercase flex items-center gap-1">
          <SlidersHorizontal size={14} /> Sort
        </p>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-black"
        >
          <option value="popularity">Popular</option>
          <option value="vote_average">Top Rated</option>
          <option value="release_date">Newest</option>
        </select>
      </motion.div>

      {/* GENRES */}
      <div className="flex flex-wrap gap-2 relative">
        {genres.map((g: any) => (
          <div key={g.id} className="relative">
            {selectedGenre === g.id && (
              <motion.div
                layoutId="activeGenre"
                className="absolute inset-0 bg-black rounded-lg z-0"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}

            <button
              onClick={() =>
                setSelectedGenre(g.id === selectedGenre ? null : g.id)
              }
              className={`relative z-10 px-3 py-1.5 rounded-lg text-xs ${selectedGenre === g.id
                  ? "text-white"
                  : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {g.name}
            </button>
          </div>
        ))}
      </div>

      {/* PROVIDERS */}
      <motion.div variants={item} className="space-y-2">
        <p className="text-xs text-gray-400 uppercase flex items-center gap-1">
          <Tv size={14} /> Streaming
        </p>

        <div className="flex gap-2">
          {[
            { id: "8", name: "Netflix", color: "bg-red-500" },
            { id: "337", name: "Disney+", color: "bg-indigo-500" },
          ].map((p) => (
            <motion.button
              key={p.id}
              layout
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setProvider(p.id === provider ? "" : p.id)
              }
              className={`${p.color} text-white px-4 py-2 rounded-lg text-xs font-medium transition ${provider === p.id
                  ? "ring-2 ring-black shadow-lg"
                  : "hover:opacity-90"
                }`}
            >
              {p.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* RESET */}
      <motion.button
        variants={item}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={reset}
        className="w-full bg-gray-100 py-2.5 rounded-lg text-sm font-medium 
        hover:bg-black hover:text-white transition"
      >
        Reset Filters
      </motion.button>
    </motion.div>
  );
}