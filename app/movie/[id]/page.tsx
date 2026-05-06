"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import ActionButton from "@/components/ui/ActionButton";
import { Mail, Globe } from "lucide-react";

import MoviePageSkeleton from "@/components/ui/MovieSkeleton";

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  // LANGUAGE + TRANSLATE
  const [language, setLanguage] = useState("ro");
  const [translatedCache, setTranslatedCache] = useState<any>({});
  const [isTranslated, setIsTranslated] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else setUser(u);
    });

    return () => unsubscribe();
  }, []);

  // FETCH MOVIE
  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/movie/${params.id}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [params.id]);

  // LOAD LANGUAGE (localStorage + browser detect)
  useEffect(() => {
    const saved = localStorage.getItem("lang");

    if (saved) {
      setLanguage(saved);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      setLanguage(browserLang || "ro");
    }
  }, []);

  // AUTO TRANSLATE
  useEffect(() => {
    if (data && language !== "en") {
      handleTranslate();
    }
  }, [data, language]);

  // CHANGE LANGUAGE
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    setIsTranslated(false);
  };

  // TRANSLATE
  const handleTranslate = async () => {
  if (!data) return;

  if (translatedCache[language]) {
  if (isTranslated) {
    setIsTranslated(false);
    setLanguage("en");
  } else {
    setIsTranslated(true);
  }
  return;
}

  setLoadingTranslate(true);

  try {
    const texts = [
        movie.title,
        movie.overview,
        ...movie.genres.map((g: any) => g.name),
        "Main Cast",
        "Available on"
    ];

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texts,
        target: language,
      }),
    });

    const result = await res.json();
    const translated = result.translated;

    const newData = {
      title: translated[0],
      overview: translated[1],
      genres: translated.slice(2, 2 + movie.genres.length),
      labels: {
        cast: translated[2 + movie.genres.length],
        available: translated[3 + movie.genres.length],
      },
    };

    setTranslatedCache((prev: any) => ({
      ...prev,
      [language]: newData,
    }));

    setIsTranslated(true);

  } catch (err) {
    console.log(err);
  }

  setLoadingTranslate(false);
};

  // LOADING
  if (!user || !data) {
    return <MoviePageSkeleton />;
  }

  const { movie, cast, providers } = data;
  const t = translatedCache[language];

  const handleSend = async () => {
    if (!email) return;

    setSending(true);

    try {
        await fetch("/api/send-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            movie: {
                ...movie,
                title: isTranslated && t ? t.title : movie.title,
                overview: isTranslated && t ? t.overview : movie.overview,
                genres: isTranslated && t
                ? t.genres
                : movie.genres.map((g: any) => g.name),
            },
            }),
        });

        setSent(true);
    } catch (err) {
        console.log(err);
    }

    setSending(false);
    };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar user={user} />

      <div className="max-w-6xl mx-auto space-y-6">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">

          {/* POSTER */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-lg p-3"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/300x450"
              }
              className="w-full h-[420px] object-cover rounded-xl"
            />
          </motion.div>

          {/* INFO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
          >

            {/* TITLE */}
            <div>
              <h1 className="text-3xl font-bold">
                {isTranslated && t ? t.title : movie.title}
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                {movie.release_date?.slice(0, 4)} •{" "}
                {isTranslated && t?.genres?.length
                    ? t.genres.join(", ")
                    : movie.genres?.map((g: any) => g.name).join(", ")}
              </p>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                ⭐ {movie.vote_average}
              </span>

              <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                ⏱️ {movie.runtime} min
              </span>

              <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                🔥 {Math.round(movie.popularity)}
              </span>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <p className="text-gray-700 leading-relaxed transition-all duration-300">
                {isTranslated && t ? t.overview : movie.overview}
              </p>

              {isTranslated && (
                <span className="text-xs text-gray-400">
                  Translated ({language.toUpperCase()})
                </span>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 items-center pt-2">
                {/* EMAIL SHARE */}
              <div className="flex gap-2 items-center">

                <input
                    placeholder="Enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-3 py-2 rounded-lg text-sm"
                />

                <ActionButton
                    icon={<Mail size={16} />}
                    variant="primary"
                    onClick={handleSend}
                    loading={sending}
                >
                    {sent ? "Sent ✔" : "Send"}
                </ActionButton>

            </div>

              <ActionButton
                icon={<Globe size={16} />}
                variant="secondary"
                onClick={handleTranslate}
                loading={loadingTranslate}
              >
                {loadingTranslate
                  ? "Translating..."
                  : isTranslated
                  ? "Original"
                  : "Translate"}
              </ActionButton>

              {/* LANGUAGE */}
              <select
                value={isTranslated ? language : "en"}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="border px-3 py-2 rounded-lg text-sm bg-white"
              >
                <option value="en">🇺🇸 English</option>
                <option value="ro">🇷🇴 Romanian</option>
                <option value="fr">🇫🇷 French</option>
                <option value="de">🇩🇪 German</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="it">🇮🇹 Italian</option>
              </select>

            </div>

            {/* PROVIDERS */}
            {providers?.flatrate && (
              <div className="pt-4">
                <p className="text-sm font-semibold mb-2">
                  {isTranslated && t ? t.labels.available : "Available on"}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {providers.flatrate.map((p: any) => (
                    <div
                      key={p.provider_id}
                      className="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-2"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${p.logo_path}`}
                        className="w-5 h-5 object-contain"
                      />
                      <span className="text-xs font-medium">
                        {p.provider_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </div>

        {/* CAST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            {isTranslated && t ? t.labels.cast : "Main Cast"}
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((actor: any) => (
              <motion.div
                key={actor.id}
                whileHover={{ scale: 1.07 }}
                className="min-w-[120px] bg-gray-50 rounded-xl p-2 shadow-sm"
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : "https://via.placeholder.com/150"
                  }
                  className="rounded-lg mb-2"
                />

                <p className="text-xs font-medium text-center">
                  {actor.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}