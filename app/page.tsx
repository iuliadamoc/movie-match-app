"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MovieCard from "@/components/ui/MovieCard";

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
      <Navbar user={user} />

<div className="flex gap-6">

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

  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} />
    ))}
  </div>

</div>
    </div>
  );
}