"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

const moods = [
  "Cozy",
  "Mindblowing",
  "Dark",
  "Emotional",
  "Funny",
  "Romantic",
  "Sci-Fi",
  "Adventurous",
];

const avoidOptions = [
  "Horror",
  "Sad Endings",
  "Slow Movies",
  "Gore",
  "Too Emotional",
  "Violence",
];

const mockMovies = [
  {
    id: 1,
    title: "Interstellar",
    year: "2014",
    score: "96%",
    image:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    explanation:
      "Recommended because you wanted an emotional and mindblowing cinematic experience.",
  },
  {
    id: 2,
    title: "Blade Runner 2049",
    year: "2017",
    score: "92%",
    image:
      "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    explanation:
      "Perfect match for dark atmosphere, immersive visuals and deep storytelling.",
  },
  {
    id: 3,
    title: "About Time",
    year: "2013",
    score: "89%",
    image:
      "https://image.tmdb.org/t/p/w500/igJphKqam0sh7JYz0IIs3Lyx7To.jpg",
    explanation:
      "A warm and comforting movie with emotional moments but a relaxing vibe.",
  },
];

export default function AIPage() {
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedAvoid, setSelectedAvoid] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);

  const toggleAvoid = (item: string) => {
    if (selectedAvoid.includes(item)) {
      setSelectedAvoid(selectedAvoid.filter((i) => i !== item));
    } else {
      setSelectedAvoid([...selectedAvoid, item]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);

    try {
  const res = await fetch("/api/ai-recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mood: selectedMood,
      avoid: selectedAvoid,
      prompt,
    }),
  });

  const data = await res.json();

  const formattedMovies = data.movies.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date?.split("-")[0],
    score: `${Math.round(movie.vote_average * 10)}%`,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    explanation: `Perfect match for your ${selectedMood.toLowerCase()} vibe.`,
  }));

    setMovies(formattedMovies);
    } catch (error) {
    console.error(error);
    } finally {
    setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/20" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      <div className="relative z-10 px-6 md:px-16 py-10">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Find the perfect
            <br />
            movie for tonight.
          </h1>

          <p className="text-gray-400 text-lg mt-6 max-w-2xl">
            AI-powered movie recommendations based on your mood,
            preferences and vibe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10">
          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur-xl h-fit sticky top-24"
          >
            {/* MOODS */}
            <div>
              <h2 className="text-xl font-bold mb-5">Choose your mood</h2>

              <div className="flex flex-wrap gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 border ${
                      selectedMood === mood
                        ? "bg-white text-black border-white scale-105"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* AVOID */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-5">
                Avoid movies like...
              </h2>

              <div className="flex flex-wrap gap-3">
                {avoidOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleAvoid(item)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 border ${
                      selectedAvoid.includes(item)
                        ? "bg-red-500/20 border-red-400 text-red-300"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* PROMPT */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-5">
                Describe your vibe
              </h2>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="I want something emotional but relaxing..."
                className="w-full h-36 rounded-2xl bg-white/5 border border-white/10 p-4 outline-none resize-none focus:border-purple-400 transition-all"
              />
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 font-bold text-lg shadow-2xl shadow-purple-500/20"
            >
              Generate AI Recommendations
            </motion.button>
          </motion.div>

          {/* RIGHT PANEL */}
          <div>
            {!loading && movies.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl p-10 bg-white/5"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">
                    Your recommendations will appear here
                  </h2>

                  <p className="text-gray-400">
                    Select your mood and let MovieMatch AI analyze your
                    vibe.
                  </p>
                </div>
              </motion.div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-[70vh]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                  }}
                  className="w-20 h-20 rounded-full border-4 border-purple-500 border-t-transparent"
                />

                <h2 className="text-3xl font-bold mt-10">
                  MovieMatch AI is analyzing your vibe...
                </h2>

                <p className="text-gray-400 mt-4">
                  Finding the perfect cinematic experience for you.
                </p>
              </div>
            )}

            {/* MOVIES */}
            {!loading && movies.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {movies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ y: -10 }}
                    className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl group"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-[420px] object-cover group-hover:scale-105 transition-all duration-500"
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                          {movie.title}
                        </h2>

                        <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-bold">
                          {movie.score}
                        </div>
                      </div>

                      <p className="text-gray-400 mt-1">{movie.year}</p>

                      <p className="text-gray-300 mt-5 leading-relaxed">
                        {movie.explanation}
                      </p>

                      <button className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}