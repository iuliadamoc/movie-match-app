"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MovieCard from "@/components/ui/MovieCard";
import MovieSkeleton from "@/components/ui/MovieSkeleton";
import { motion } from "framer-motion";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);

  const [sort, setSort] = useState("popularity");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [provider, setProvider] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // 🔐 AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 🔍 debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  // 🎬 FETCH MOVIES
  useEffect(() => {
    const url =
      `/api/movies?page=${page}&sort=${sort}` +
      (provider ? `&provider=${provider}` : "") +
      (selectedGenre ? `&genre=${selectedGenre}` : "") +
      (debouncedSearch ? `&query=${debouncedSearch}` : "");

    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results || []);
        setLoading(false);
      });
  }, [page, sort, provider, selectedGenre, debouncedSearch]);

  // 🎭 GENRES
  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data));
  }, []);

  if (!user)
  return (
    <div className="
      min-h-screen
      bg-black
      flex items-center justify-center
      text-white
    ">
      <div className="text-center">

        <div className="
          w-16 h-16
          border-4 border-purple-500
          border-t-transparent
          rounded-full
          animate-spin
          mx-auto mb-6
        " />

        <p className="text-xl text-gray-400">
          Loading MovieMatch...
        </p>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar user={user} />

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">

        <div className="
          absolute inset-0
          bg-gradient-to-br
          from-purple-900/20
          via-black
          to-blue-900/20
        " />

        <div className="
          absolute top-0 left-0
          w-[600px] h-[600px]
          bg-purple-500/10
          rounded-full blur-3xl
        " />

        <div className="
          absolute bottom-0 right-0
          w-[500px] h-[500px]
          bg-blue-500/10
          rounded-full blur-3xl
        " />

      </div>

      <div className="
        relative z-10
        flex gap-8
        px-4 md:px-8
        py-10
        ">

        <Sidebar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          setPage={setPage}
          provider={provider}
          setProvider={setProvider}
          genres={genres}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          reset={() => {
            setSearch("");
            setProvider("");
            setSelectedGenre(null);
            setSort("popularity");
            setPage(1);
          }}
        />

        <div className="flex-1">

          {/* MOVIES */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <div className="
              grid
              grid-cols-2
              md:grid-cols-3
              xl:grid-cols-4
              2xl:grid-cols-5
              gap-8
              ">

              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                  <MovieSkeleton key={i} />
                ))
                : movies.map((movie) => (
                  <motion.div key={movie.id} variants={item}>
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}

            </div>
          </motion.div>

          {/* PAGINATION */}
          <div className="
            flex justify-center items-center
            gap-3 mt-16 flex-wrap
            ">

            {/* FIRST */}
            <button
              onClick={() => setPage(1)}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-gray-300 text-sm"
            >
              ⏮
            </button>

            {/* PREV */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-gray-300 disabled:opacity-40 text-sm"
            >
              ←
            </button>

            {/* PAGES */}
            {[...Array(5)].map((_, i) => {
              let pageNumber;

              if (page <= 3) {
                pageNumber = i + 1;
              } else {
                pageNumber = page - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => {
                    setPage(pageNumber);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${page === pageNumber
                    ? "bg-gradient-to-red from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/30"
                    : "bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-gray-300"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* NEXT */}
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-gray-300 text-sm"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}