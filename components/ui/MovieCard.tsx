"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function MovieCard({ movie }: any) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden relative cursor-pointer"
      >
        {movie.vote_average >= 7.5 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            TOP
          </span>
        )}

        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x450"
          }
          className="w-full h-80 object-contain bg-black"
        />

        <div className="p-3">
          <h3 className="text-sm font-semibold">
            {movie.title}
          </h3>

          <p className="text-xs text-gray-500">
            ⭐ {movie.vote_average}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}