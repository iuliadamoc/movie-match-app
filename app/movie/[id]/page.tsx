"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "react-toastify";

import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

import { Heart } from "lucide-react";
import { addFavorite, removeFavorite, checkFavorite } from "@/lib/favorites";
import { AnimatePresence } from "framer-motion";

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

    const [isFav, setIsFav] = useState(false);
    const [favId, setFavId] = useState<string | null>(null);
    const [initialAnimDone, setInitialAnimDone] = useState(false);

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

    // CHECK IF FAVORITE
    useEffect(() => {
        if (!user || !data?.movie) return;

        const check = async () => {
            const id = await checkFavorite(user.uid, data.movie.id);

            if (id) {
                setIsFav(true);
                setFavId(id);

                // trigger animație la load
                setTimeout(() => {
                    setInitialAnimDone(true);
                }, 100);
            }
        };

        check();
    }, [user, data]);

    useEffect(() => {
        if (!data?.movie) return;

        const existing = JSON.parse(localStorage.getItem("recent") || "[]");

        const updated = [
            {
                id: data.movie.id,
                poster_path: data.movie.poster_path,
                title: data.movie.title,
            },
            ...existing.filter((m: any) => m.id !== data.movie.id),
        ].slice(0, 10);

        localStorage.setItem("recent", JSON.stringify(updated));

        console.log("RECENT SAVED:", updated); // DEBUG
    }, [data]);

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

    const handleFavorite = async () => {
        if (!user) return;

        try {
            if (isFav && favId) {
                await removeFavorite(favId);
                setIsFav(false);
                setFavId(null);
                // toast.info("Removed from favorites");
            } else {
                const docRef = await addFavorite(user, movie);
                setIsFav(true);
                setFavId(docRef.id);
                // toast.success("Added to favorites ❤️");
            }
        } catch (err) {
            console.log(err);
            toast.error("Error");
        }
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
            toast.success("Email sent ✔");
        } catch (err) {
            console.log(err);
            toast.error("Failed to send email ❌");
        }

        setSending(false);
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <Navbar user={user} />

            {/* BACKGROUND */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
                <div className="absolute inset-0 backdrop-blur-3xl" />

                {/* BACKDROP */}
                {movie.backdrop_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        className="absolute inset-0 w-full h-full object-cover opacity-10"
                    />
                )}
            </div>

            <div className="relative z-10 px-6 md:px-14 py-10">

                <div className="max-w-7xl mx-auto space-y-10">

                    {/* TOP */}
                    <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-10">

                        {/* POSTER */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{
                                scale: 1.02,
                                y: -5,
                            }}
                            className="
                            relative
                            rounded-3xl
                            overflow-hidden
                            border border-white/10
                            bg-white/5
                            backdrop-blur-xl
                            shadow-2xl
                        "
                        >
                            <img
                                src={
                                    movie.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                        : "https://via.placeholder.com/300x450"
                                }
                                className="w-full h-[520px] object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                            {/* FAVORITE */}
                            <div className="absolute top-4 right-4">

                                <motion.button
                                    onClick={handleFavorite}
                                    whileTap={{ scale: 0.8 }}
                                    whileHover={{ scale: 1.1 }}
                                    className="
                                    w-12 h-12 rounded-full
                                    bg-black/40 backdrop-blur-xl
                                    border border-white/10
                                    flex items-center justify-center
                                "
                                >
                                    <Heart
                                        size={22}
                                        className={`transition ${isFav
                                                ? "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                                                : "text-white"
                                            }`}
                                        fill={isFav ? "currentColor" : "none"}
                                    />
                                </motion.button>

                            </div>
                        </motion.div>

                        {/* INFO */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="
                            bg-white/5
                            border border-white/10
                            rounded-3xl
                            p-8
                            backdrop-blur-xl
                            shadow-2xl
                            space-y-6
                        "
                        >

                            {/* TITLE */}
                            <div>
                                <h1 className="
                                text-5xl
                                font-black
                                leading-tight
                                bg-gradient-to-r
                                from-white
                                to-gray-400
                                bg-clip-text
                                text-transparent
                            ">
                                    {isTranslated && t ? t.title : movie.title}
                                </h1>

                                <p className="text-gray-400 mt-3 text-lg">
                                    {movie.release_date?.slice(0, 4)} •{" "}
                                    {isTranslated && t?.genres?.length
                                        ? t.genres.join(", ")
                                        : movie.genres?.map((g: any) => g.name).join(", ")}
                                </p>
                            </div>

                            {/* STATS */}
                            <div className="flex flex-wrap gap-3">

                                <div className="
                                px-4 py-2 rounded-2xl
                                bg-yellow-500/10
                                border border-yellow-500/20
                                text-yellow-300
                                font-semibold
                            ">
                                    ⭐ {movie.vote_average.toFixed(1)}
                                </div>

                                <div className="
                                px-4 py-2 rounded-2xl
                                bg-blue-500/10
                                border border-blue-500/20
                                text-blue-300
                                font-semibold
                            ">
                                    ⏱️ {movie.runtime} min
                                </div>

                                <div className="
                                px-4 py-2 rounded-2xl
                                bg-red-500/10
                                border border-red-500/20
                                text-red-300
                                font-semibold
                            ">
                                    🔥 {Math.round(movie.popularity)}
                                </div>

                            </div>

                            {/* DESCRIPTION */}
                            <div className="space-y-3">

                                <p className="
                                text-gray-300
                                leading-relaxed
                                text-lg
                            ">
                                    {isTranslated && t
                                        ? t.overview
                                        : movie.overview}
                                </p>

                                {isTranslated && (
                                    <span className="text-xs text-gray-500">
                                        Translated ({language.toUpperCase()})
                                    </span>
                                )}

                            </div>

                            {/* ACTIONS */}
                            <div className="flex flex-wrap gap-3 pt-4">

                                <ActionButton
                                    icon={<Mail size={16} />}
                                    variant="primary"
                                    onClick={() => setShowEmailModal(true)}
                                    loading={sending}
                                >
                                    {sent ? "Sent ✔" : "Send"}
                                </ActionButton>

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

                                <div className="flex flex-wrap gap-2">

                                    {[
                                        { code: "en", label: "🇺🇸 EN" },
                                        { code: "ro", label: "🇷🇴 RO" },
                                        { code: "fr", label: "🇫🇷 FR" },
                                        { code: "de", label: "🇩🇪 DE" },
                                        { code: "es", label: "🇪🇸 ES" },
                                        { code: "it", label: "🇮🇹 IT" },
                                    ].map((lang) => {

                                        const active =
                                            (isTranslated && language === lang.code) ||
                                            (!isTranslated && lang.code === "en");

                                        return (
                                            <motion.button
                                                key={lang.code}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className={`
                                                        px-4 py-2 rounded-2xl
                                                        border transition-all duration-300
                                                        text-sm font-medium
                                                        backdrop-blur-xl
                                                        ${active
                                                        ? "bg-purple-500/20 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                                                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                                                    }
                                                    `}
                                            >
                                                {lang.label}
                                            </motion.button>
                                        );
                                    })}

                                </div>

                            </div>

                            {/* PROVIDERS */}
                            {providers?.flatrate && (
                                <div className="pt-6">

                                    <p className="text-sm font-semibold text-gray-400 mb-4">
                                        {isTranslated && t
                                            ? t.labels.available
                                            : "Available on"}
                                    </p>

                                    <div className="flex gap-3 flex-wrap">

                                        {providers.flatrate.map((p: any) => (
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                key={p.provider_id}
                                                className="
                                                bg-white/5
                                                border border-white/10
                                                rounded-2xl
                                                px-4 py-2
                                                flex items-center gap-3
                                                backdrop-blur-xl
                                            "
                                            >
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${p.logo_path}`}
                                                    className="w-6 h-6 rounded-full"
                                                />

                                                <span className="text-sm font-medium">
                                                    {p.provider_name}
                                                </span>
                                            </motion.div>
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
                        className="
                        bg-white/5
                        border border-white/10
                        rounded-3xl
                        p-8
                        backdrop-blur-xl
                        shadow-2xl
                    "
                    >
                        <h2 className="text-3xl font-bold mb-8">
                            {isTranslated && t
                                ? t.labels.cast
                                : "Main Cast"}
                        </h2>

                        <div className="flex gap-5 overflow-x-auto pb-3">

                            {cast.map((actor: any) => (
                                <motion.div
                                    key={actor.id}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -5,
                                    }}
                                    className="
                                    min-w-[150px]
                                    bg-white/5
                                    border border-white/10
                                    rounded-2xl
                                    overflow-hidden
                                    backdrop-blur-xl
                                "
                                >
                                    <img
                                        src={
                                            actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                                                : "https://via.placeholder.com/150"
                                        }
                                        className="
                                        w-full
                                        h-[210px]
                                        object-cover
                                    "
                                    />

                                    <div className="p-3">
                                        <p className="
                                        text-sm
                                        font-semibold
                                        text-center
                                    ">
                                            {actor.name}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                        </div>
                    </motion.div>

                </div>
            </div>

            {/* EMAIL MODAL */}
            <AnimatePresence>
                {showEmailModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="
                        fixed inset-0 z-50
                        bg-black/70
                        backdrop-blur-md
                        flex items-center justify-center
                    "
                    >

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="
                            w-[380px]
                            bg-[#111]
                            border border-white/10
                            rounded-3xl
                            p-6
                            shadow-2xl
                        "
                        >

                            <h2 className="text-2xl font-bold mb-5">
                                Send movie 🎬
                            </h2>

                            <input
                                placeholder="Enter email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="
                                w-full
                                bg-white/5
                                border border-white/10
                                rounded-2xl
                                px-4 py-3
                                outline-none
                                mb-5
                            "
                            />

                            <div className="flex justify-end gap-3">

                                <button
                                    onClick={() =>
                                        setShowEmailModal(false)
                                    }
                                    className="
                                    px-4 py-2 rounded-xl
                                    bg-white/10
                                    hover:bg-white/20
                                    transition-all
                                "
                                >
                                    Cancel
                                </button>

                                <ActionButton
                                    icon={<Mail size={16} />}
                                    variant="primary"
                                    onClick={async () => {
                                        await handleSend();
                                        setShowEmailModal(false);
                                    }}
                                    loading={sending}
                                >
                                    Send
                                </ActionButton>

                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}