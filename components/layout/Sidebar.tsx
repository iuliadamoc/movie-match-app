"use client";

import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Tv,
  Sparkles,
} from "lucide-react";

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
      className="
        w-80
        sticky top-28
        h-fit
        bg-white/5
        border border-white/10
        backdrop-blur-2xl
        rounded-3xl
        p-7
        space-y-8
        shadow-2xl
      "
    >

      {/* TITLE */}
      <motion.div
        variants={item}
        className="space-y-2"
      >

        <div className="flex items-center gap-2">

          <div className="
            w-10 h-10 rounded-2xl
            bg-gradient-to-br
            from-purple-600
            to-blue-500
            flex items-center justify-center
            shadow-lg shadow-purple-500/20
          ">
            <Sparkles size={18} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Movie Filters
            </h2>

            <p className="text-sm text-gray-400">
              Discover your next obsession
            </p>
          </div>

        </div>

      </motion.div>

      {/* SEARCH */}
      <motion.div
        variants={item}
        className="space-y-3"
      >

        <p className="
          text-xs uppercase
          tracking-widest
          text-gray-500
          flex items-center gap-2
        ">
          <Search size={14} />
          Search
        </p>

        <div className="relative">

          <input
            placeholder="Search movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-white/5
              border border-white/10
              pl-11 pr-4 py-3
              rounded-2xl
              outline-none
              text-white
              placeholder:text-gray-500
              focus:border-purple-500
              transition-all
            "
          />

          <Search
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-gray-500
            "
            size={18}
          />

        </div>

      </motion.div>

      {/* SORT */}
      <motion.div
        variants={item}
        className="space-y-3"
      >

        <p className="
          text-xs uppercase
          tracking-widest
          text-gray-500
          flex items-center gap-2
        ">
          <SlidersHorizontal size={14} />
          Sort
        </p>

        <div className="flex flex-wrap gap-2">

          {[
            {
              value: "popularity",
              label: "Popular",
            },
            {
              value: "vote_average",
              label: "Top Rated",
            },
            {
              value: "release_date",
              label: "Newest",
            },
          ].map((option) => {

            const active = sort === option.value;

            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setSort(option.value);
                  setPage(1);
                }}
                className={`
                  px-4 py-2 rounded-2xl
                  text-sm transition-all
                  border
                  ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 border-transparent text-white shadow-lg shadow-purple-500/20"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }
                `}
              >
                {option.label}
              </motion.button>
            );
          })}

        </div>

      </motion.div>

      {/* GENRES */}
      <motion.div
        variants={item}
        className="space-y-3"
      >

        <p className="
          text-xs uppercase
          tracking-widest
          text-gray-500
        ">
          Genres
        </p>

        <div className="flex flex-wrap gap-2">

          {genres.map((g: any) => {

            const active = selectedGenre === g.id;

            return (
              <motion.button
                key={g.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setSelectedGenre(
                    g.id === selectedGenre ? null : g.id
                  )
                }
                className={`
                  px-3 py-2 rounded-2xl
                  text-xs font-medium
                  border transition-all
                  ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 border-transparent text-white shadow-lg shadow-purple-500/20"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }
                `}
              >
                {g.name}
              </motion.button>
            );
          })}

        </div>

      </motion.div>

      {/* STREAMING */}
      <motion.div
        variants={item}
        className="space-y-3"
      >

        <p className="
          text-xs uppercase
          tracking-widest
          text-gray-500
          flex items-center gap-2
        ">
          <Tv size={14} />
          Streaming
        </p>

        <div className="flex gap-3 flex-wrap">

          {[
            {
              id: "8",
              name: "Netflix",
              gradient:
                "from-red-500 to-red-700",
            },
            {
              id: "337",
              name: "Disney+",
              gradient:
                "from-blue-500 to-indigo-700",
            },
          ].map((p) => {

            const active = provider === p.id;

            return (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setProvider(
                    p.id === provider ? "" : p.id
                  )
                }
                className={`
                  px-4 py-2 rounded-2xl
                  text-sm font-medium
                  transition-all
                  bg-gradient-to-r
                  ${p.gradient}
                  ${
                    active
                      ? "ring-2 ring-white shadow-xl"
                      : "opacity-80 hover:opacity-100"
                  }
                `}
              >
                {p.name}
              </motion.button>
            );
          })}

        </div>

      </motion.div>

      {/* RESET */}
      <motion.button
        variants={item}
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.97,
        }}
        onClick={reset}
        className="
          w-full
          py-3 rounded-2xl
          bg-white/5
          border border-white/10
          text-gray-300
          hover:bg-red-500/20
          hover:border-red-500/20
          hover:text-red-300
          transition-all
          font-medium
        "
      >
        Reset Filters
      </motion.button>

    </motion.div>
  );
}