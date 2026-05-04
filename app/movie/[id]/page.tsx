"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MoviePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/movie/${params.id}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  const { movie, cast } = data;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
    <div className="max-w-6xl w-full">

        {/* MOVIE DETAILS */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        {/* TOP SECTION */}
        <div className="flex gap-8 p-6">

            {/* POSTER */}
            <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-72 rounded-lg shadow-md"
            />

            {/* INFO */}
            <div className="flex-1 flex flex-col justify-center">

            <h1 className="text-4xl font-bold mb-2">
                {movie.title} ({movie.release_date?.slice(0, 4)})
            </h1>

            <p className="text-gray-500 mb-2">
                {movie.genres?.map((g: any) => g.name).join(", ")} •{" "}
                {movie.original_language?.toUpperCase()}
            </p>

            <p className="mb-4 text-gray-700">
                ⭐ {movie.vote_average} / 10 • ⏱️ {movie.runtime} min • 🔥{" "}
                {Math.round(movie.popularity)}
            </p>

            <p className="text-gray-700 mb-6 leading-relaxed">
                {movie.overview}
            </p>

            <div className="flex gap-3">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Translate
                </button>

                <button className="bg-green-500 text-white px-4 py-2 rounded">
                Send Email
                </button>
            </div>
            </div>
        </div>

        {/* CAST */}
        <div className="p-7">
            <h2 className="text-2xl font-semibold mb-4 text-center">
             Main Cast
            </h2>

            <div className="flex justify-center flex-wrap gap-6">
            {cast.map((actor: any) => (
                <div key={actor.id} className="w-28 text-center">
                <img
                    src={
                    actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "https://via.placeholder.com/150"
                    }
                    className="rounded-lg mb-2 shadow"
                />
                <p className="text-sm font-medium">{actor.name}</p>
                </div>
            ))}
            </div>
        </div>

        </div>

    </div>
    </div>
  );
}