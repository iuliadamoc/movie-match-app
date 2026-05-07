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

  // COMPUTE TOP GENRES (simplu)
  useEffect(() => {
    if (!favorites.length) return;

    const fakeGenres = [28, 12, 16, 35]; // fallback demo
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
  const data = JSON.parse(localStorage.getItem("recent") || "[]");
  setRecent(data);
}, []);

  // REMOVE FAVORITE
  const removeFav = async (id: string) => {
    await deleteDoc(doc(db, "favorites", id));
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    toast.info("Removed from favorites");
  };

  if (!user || loading) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar user={user} />

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Your Favorites
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {favorites.length} saved movies
          </p>
        </div>

        {/* EMPTY */}
        {favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
            <Heart size={50} className="opacity-20" />
            <p className="text-lg mt-4">No favorites yet</p>
            <p className="text-sm">Start exploring movies</p>
          </div>
        )}

        {/* FAVORITES GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {favorites.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative rounded-2xl overflow-hidden group"
            >

              {/* IMAGE */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                className="w-full h-80 object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

              {/* TITLE */}
              <div className="absolute bottom-0 p-3">
                <h3 className="text-white text-sm font-semibold">
                  {movie.title}
                </h3>
              </div>

              {/* REMOVE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFav(movie.id);
                }}
                className="absolute top-2 right-2 z-20 bg-white/90 p-1.5 rounded-full shadow"
              >
                <Heart size={14} fill="red" className="text-red-500" />
              </button>

              <Link href={`/movie/${movie.movieId}`} className="absolute inset-0" />

            </motion.div>
          ))}

        </div>

        {/* RECOMMENDED */}
        {recommended.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-4">
              Recommended for you
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {recommended.map((movie) => (
                <Link href={`/movie/${movie.id}`} key={movie.id}>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    className="min-w-[140px] rounded-lg hover:scale-105 transition"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* RECENT */}
        {recent.length > 0 && (
  <div className="mt-16">
    <h2 className="text-xl font-semibold mb-4">
      Recently viewed
    </h2>

    <div className="flex gap-4 overflow-x-auto pb-2">
      {recent.map((movie) => (
        <Link href={`/movie/${movie.id}`} key={movie.id}>
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            className="min-w-[140px] rounded-lg hover:scale-105 transition"
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