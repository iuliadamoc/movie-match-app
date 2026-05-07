"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  Star,
  Flame,
} from "lucide-react";

export default function MovieCard({
  movie,
}: any) {
  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.35,
      }}
      className="group"
    >

      <Link href={`/movie/${movie.id}`}>

        <div className="
          relative
          rounded-[28px]
          overflow-hidden
          bg-white/5
          border border-white/10
          backdrop-blur-xl
          shadow-2xl
          cursor-pointer
        ">

          {/* IMAGE */}
          <div className="
            relative
            overflow-hidden
          ">

            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/300x450"
              }
              className="
                w-full
                h-80
                object-cover
                transition-all duration-700
                group-hover:scale-110
                group-hover:rotate-1
              "
            />

            {/* OVERLAY */}
            <div className="
              absolute inset-0
              bg-gradient-to-t
              from-black
              via-black/20
              to-transparent
            " />

            {/* GLOW */}
            <div className="
              absolute inset-0
              opacity-0
              group-hover:opacity-100
              transition-all duration-500
              bg-gradient-to-t
              from-purple-500/20
              via-transparent
              to-blue-500/10
            " />

          </div>

          {/* TOP BADGES */}
          <div className="
            absolute top-4 left-4 right-4
            flex items-start justify-between
          ">

            {/* TOP */}
            {movie.vote_average >= 7.5 && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="
                  flex items-center gap-1
                  px-3 py-1.5
                  rounded-full
                  bg-yellow-400/90
                  text-black
                  text-xs
                  font-bold
                  shadow-lg
                "
              >
                <Flame size={12} />
                TOP
              </motion.div>
            )}

            {/* RATING */}
            <div className="
              ml-auto
              flex items-center gap-1
              px-3 py-1.5
              rounded-full
              bg-black/50
              backdrop-blur-xl
              border border-white/10
              text-white
              text-xs
              font-semibold
            ">
              <Star
                size={12}
                className="fill-yellow-400 text-yellow-400"
              />

              {movie.vote_average?.toFixed(1)}
            </div>

          </div>

          {/* CONTENT */}
          <div className="
            absolute bottom-0
            w-full
            p-5
          ">

            {/* TITLE */}
            <h3 className="
              text-white
              text-lg
              font-bold
              leading-tight
              drop-shadow-xl
              line-clamp-2
            ">
              {movie.title}
            </h3>

            {/* YEAR */}
            <div className="
              mt-3
              flex items-center justify-between
            ">

              <p className="
                text-gray-300
                text-sm
              ">
                {movie.release_date?.slice(0, 4)}
              </p>

              {/* AI BADGE */}
              {/* <div className="
                opacity-0
                group-hover:opacity-100
                translate-y-3
                group-hover:translate-y-0
                transition-all duration-500
                flex items-center gap-1
                px-3 py-1.5
                rounded-full
                bg-purple-500/20
                border border-purple-500/20
                text-purple-300
                text-xs font-medium
              ">
                <Sparkles size={12} />
                AI Match
              </div> */}

            </div>

          </div>

          {/* HOVER BORDER */}
          <div className="
            absolute inset-0
            rounded-[28px]
            border border-transparent
            group-hover:border-purple-500/30
            transition-all duration-500
          " />

        </div>

      </Link>

    </motion.div>
  );
}