"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MovieCard({ movie }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25 }}
        >
            <Link href={`/movie/${movie.id}`}>
                <div className="relative group rounded-xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.15)] bg-black cursor-pointer">

                    {/* IMAGE */}
                    <img
                        src={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : "https://via.placeholder.com/300x450"
                        }
                        className="w-full h-80 object-cover transition duration-300 group-hover:scale-110 group-hover:opacity-80"
                    />

                    {/* GRADIENT OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition" />

                    {/* TOP BADGE */}
                    {movie.vote_average >= 7.5 && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-md font-semibold shadow">
                            TOP
                        </div>
                    )}

                    {/* RATING */}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                        ⭐ {movie.vote_average.toFixed(1)}
                    </div>

                    {/* HOVER CONTENT */}
                    <div className="absolute bottom-0 p-3 translate-y-6 group-hover:translate-y-0 transition-all duration-300">

                        <h3 className="text-white font-semibold text-sm line-clamp-2">
                            {movie.title}
                        </h3>

                        <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition duration-300">
                            {movie.release_date?.slice(0, 4)}
                        </p>

                    </div>

                </div>
            </Link>
        </motion.div>
    );
}