"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { movies } from "@/utils/movies";
import Link from "next/link";
import { signOut } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    // fetch movies
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data));

    return () => unsubscribe();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎬 Movie Match</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button
            onClick={async () => {
              await signOut(auth);
            }}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <div className="bg-white rounded-xl shadow hover:scale-105 transition cursor-pointer overflow-hidden">
              <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="w-full h-72 object-cover"
                />
              <div className="p-3">
                <h3 className="font-semibold text-lg">{movie.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}