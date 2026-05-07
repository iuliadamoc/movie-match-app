"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else setUser(u);
    });

    return () => unsub();
  }, []);

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

  const removeFav = async (id: string) => {
    await deleteDoc(doc(db, "favorites", id));
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    toast.info("Removed");
  };

  if (!user || loading) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar user={user} />

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Favorites
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your saved movies
          </p>
        </div>

        {/* EMPTY STATE */}
        {favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
            <Heart size={40} className="mb-3 opacity-30" />
            <p className="text-lg">No favorites yet</p>
            <p className="text-sm">Start exploring and add some ❤️</p>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {favorites.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover="hover"
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
            >

              {/* IMAGE */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                className="w-full h-80 object-cover transition duration-500 group-hover:scale-105"
              />

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition" />

              {/* TITLE */}
              <div className="absolute bottom-0 p-3">
                <h3 className="text-white text-sm font-semibold line-clamp-2">
                  {movie.title}
                </h3>
              </div>

              {/* REMOVE BUTTON */}
              <motion.button
  onClick={(e) => {
    e.stopPropagation();
    removeFav(movie.id);
  }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.85 }}
  className="
    absolute top-2 right-2 z-20
    bg-white/90 backdrop-blur
    border border-gray-200
    p-1.5 rounded-full
    shadow-md
    hover:bg-white
    transition
  "
>
  <Heart
    size={14}
    fill="currentColor"
    className="text-red-500"
  />
</motion.button>

              {/* LINK */}
              <Link href={`/movie/${movie.movieId}`} className="absolute inset-0" />

            </motion.div>
          ))}

        </div>
      </div>
    </div>
  );
}