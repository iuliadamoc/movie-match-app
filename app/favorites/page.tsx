"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [topGenres, setTopGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else setUser(u);
    });

    return () => unsub();
  }, []);

  // FETCH FAVORITES
  useEffect(() => {
    if (!user) return;

    const fetchFav = async () => {
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFavorites(data);
      setLoading(false);
    };

    fetchFav();
  }, [user]);

  // COMPUTE TOP GENRES
  useEffect(() => {
    if (!favorites.length) return;

    const fakeGenres = [28, 12, 16, 35];
    setTopGenres(fakeGenres);
  }, [favorites]);

  // FETCH RECOMMENDED
  useEffect(() => {
    if (!topGenres.length) return;

    const fetchRecommended = async () => {
      const res = await fetch(
        `/api/movies?genre=${topGenres[0]}`
      );

      const data = await res.json();

      setRecommended(data.results || []);
    };

    fetchRecommended();
  }, [topGenres]);

  // RECENTLY VIEWED
  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("recent") || "[]"
    );

    setRecent(data);
  }, []);

  // REMOVE FAVORITE
  const removeFav = async (id: string) => {
    await deleteDoc(doc(db, "favorites", id));

    setFavorites((prev) =>
      prev.filter((f) => f.id !== id)
    );

    toast.info("Removed from favorites");
  };

  if (!user || loading) {
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
            Loading favorites...
          </p>

        </div>
      </div>
    );
  }

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
        max-w-7xl mx-auto
        px-4 md:px-8
        py-10
      ">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >

          <h1 className="
            text-5xl md:text-6xl
            font-black
            leading-tight
            bg-gradient-to-r
            from-white
            to-gray-400
            bg-clip-text
            text-transparent
          ">
            Your favorite
            <br />
            cinematic universe.
          </h1>

          <p className="
            text-gray-400
            text-lg
            
          ">
            {favorites.length} saved movies
          </p>

        </motion.div>

        {/* EMPTY */}
        {favorites.length === 0 && (
          <div className="
            flex flex-col
            items-center justify-center
            mt-40
            text-gray-400
          ">

            <div className="
              w-28 h-28 rounded-full
              bg-white/5
              border border-white/10
              flex items-center justify-center
              backdrop-blur-xl
            ">
              <Heart
                size={42}
                className="opacity-40"
              />
            </div>

            <p className="text-2xl font-semibold mt-8">
              No favorites yet
            </p>

            <p className="text-gray-500 mt-2">
              Start building your cinematic universe
            </p>

          </div>
        )}

        {/* FAVORITES GRID */}
        <div className="
          grid
          grid-cols-2
          md:grid-cols-3
          xl:grid-cols-4
          2xl:grid-cols-5
          gap-8
        ">

          {favorites.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                scale: 1.03,
                y: -8,
              }}
              className="
                relative
                rounded-3xl
                overflow-hidden
                group
                bg-white/5
                border border-white/10
                backdrop-blur-xl
                shadow-2xl
              "
            >

              {/* IMAGE */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                className="
                  w-full h-[420px]
                  object-cover
                  group-hover:scale-105
                  transition-all duration-700
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

              {/* REMOVE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFav(movie.id);
                }}
                className="
                  absolute top-4 right-4 z-20
                  w-11 h-11 rounded-full
                  bg-black/40
                  backdrop-blur-xl
                  border border-white/10
                  flex items-center justify-center
                "
              >
                <Heart
                  size={16}
                  fill="red"
                  className="text-red-500"
                />
              </button>

              {/* TITLE */}
              <div className="absolute bottom-0 p-5">

                <h3 className="
                  text-white
                  text-lg
                  font-bold
                  drop-shadow-lg
                ">
                  {movie.title}
                </h3>

              </div>

              <Link
                href={`/movie/${movie.movieId}`}
                className="absolute inset-0"
              />

            </motion.div>
          ))}

        </div>

        {/* RECOMMENDED */}
        {recommended.length > 0 && (
          <div className="mt-20">

            <h2 className="
              text-3xl
              font-bold
              mb-6
              bg-gradient-to-r
              from-white
              to-gray-400
              bg-clip-text
              text-transparent
            ">
              Recommended for you
            </h2>

            <div className="
              flex gap-5
              overflow-x-auto
              pb-4
            ">

              {recommended.map((movie) => (
                <Link
                  href={`/movie/${movie.id}`}
                  key={movie.id}
                >

                  <motion.img
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                    }}
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    className="
                      min-w-[170px]
                      rounded-2xl
                      border border-white/10
                      hover:shadow-2xl
                      hover:shadow-purple-500/10
                      transition-all duration-500
                    "
                  />

                </Link>
              ))}

            </div>

          </div>
        )}

        {/* RECENT */}
        {recent.length > 0 && (
          <div className="mt-20">

            <h2 className="
              text-3xl
              font-bold
              mb-6
              bg-gradient-to-r
              from-white
              to-gray-400
              bg-clip-text
              text-transparent
            ">
              Recently viewed
            </h2>

            <div className="
              flex gap-5
              overflow-x-auto
              pb-4
            ">

              {recent.map((movie) => (
                <Link
                  href={`/movie/${movie.id}`}
                  key={movie.id}
                >

                  <motion.img
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                    }}
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    className="
                      min-w-[170px]
                      rounded-2xl
                      border border-white/10
                      hover:shadow-2xl
                      hover:shadow-blue-500/10
                      transition-all duration-500
                    "
                  />

                </Link>
              ))}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}