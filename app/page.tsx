"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

    fetch(url)
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []));
  }, [page, sort, provider, selectedGenre, debouncedSearch]);

  // 🎭 GENRES
  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data));
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">🎬 Movie Match</h1>

        <div className="flex gap-3 items-center">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex gap-6">

        {/* SIDEBAR */}
        <div className="w-72 bg-white p-5 rounded-2xl shadow-lg space-y-6">

          <h2 className="text-xl font-bold">Filters</h2>

          {/* SEARCH */}
          <input
            placeholder="Search movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
          />

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded w-full"
          >
            <option value="popularity">🔥 Popular</option>
            <option value="vote_average">⭐ Top Rated</option>
            <option value="release_date">📅 Newest</option>
          </select>

          {/* GENRES */}
          <div>
            <p className="text-sm mb-2 font-bold">Genres </p>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g.id}
                  onClick={() =>
                    setSelectedGenre(g.id === selectedGenre ? null : g.id)
                  }
                  className={`px-2 py-1 rounded text-xs ${
                    selectedGenre === g.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* PROVIDERS */}
          <div>
            <p className="text-sm mb-2 font-bold">Streaming</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "8", name: "Netflix", color: "bg-red-500" },
                { id: "337", name: "Disney+", color: "bg-indigo-500" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    setProvider(p.id === provider ? "" : p.id)
                  }
                  className={`${p.color} text-white px-2 py-1 rounded text-xs ${
                    provider === p.id ? "ring-2 ring-black" : ""
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* RESET */}
          <button
            onClick={() => {
              setSearch("");
              setProvider("");
              setSelectedGenre(null);
              setSort("popularity");
              setPage(1);
            }}
            className="w-full bg-gray-200 py-2 rounded hover:bg-red-300 transition font-bold"
          >
            Reset Filters
          </button>

        </div>

        {/* MOVIES */}
        <div className="flex-1">

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id}>
                <div className="bg-white rounded-xl shadow hover:scale-105 transition cursor-pointer overflow-hidden relative">

                  {/* TOP */}
                  {movie.vote_average >= 7.5 && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded">
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

                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">

            {/* PREV */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              ⬅
            </button>

            {/* PAGES */}
            {[...Array(5)].map((_, i) => {
              const pageNumber = page - 2 + i;

              if (pageNumber < 1) return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => {
                    setPage(pageNumber);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-3 py-1 rounded ${
                    page === pageNumber
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* NEXT */}
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              ➡
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}