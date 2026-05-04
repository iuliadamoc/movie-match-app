"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MoviePage() {
  const params = useParams();
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/movie/${params.id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, []);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          className="w-full h-96 object-cover rounded-lg mb-4"
        />

        <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>

        <p className="text-gray-600 mb-4">{movie.overview}</p>

        <p className="mb-2">
          ⭐ Rating: {movie.vote_average}
        </p>

        <p className="mb-4">
          📅 Release: {movie.release_date}
        </p>

        <div className="flex gap-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Translate
          </button>

          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}