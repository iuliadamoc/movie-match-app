"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import ActionButton from "@/components/ui/ActionButton";
import { Mail, Globe } from "lucide-react";

import FullScreenLoader from "@/components/ui/FullScreenLoader";

export default function MoviePage() {
    const params = useParams();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [data, setData] = useState<any>(null);

    // 🔐 AUTH (FIX BUG)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (!u) {
                router.push("/login");
            } else {
                setUser(u);
            }
        });

        return () => unsubscribe();
    }, []);

    // 🎬 FETCH MOVIE
    useEffect(() => {
        if (!params.id) return;

        fetch(`/api/movie/${params.id}`)
            .then((res) => res.json())
            .then((data) => setData(data));
    }, [params.id]);

    if (!user || !data) {
        return <FullScreenLoader />;
    }

    const { movie, cast, providers } = data;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Navbar user={user} />

            <div className="max-w-6xl mx-auto space-y-6">

                {/* TOP SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">

                    {/* POSTER CARD */}
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

                    {/* INFO CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
                    >
                        {/* TITLE */}
                        <div>
                            <h1 className="text-3xl font-bold">
                                {movie.title}
                            </h1>

                            <p className="text-gray-500 text-sm mt-1">
                                {movie.release_date?.slice(0, 4)} •{" "}
                                {movie.genres?.map((g: any) => g.name).join(", ")}
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
                        <p className="text-gray-700 leading-relaxed">
                            {movie.overview}
                        </p>

                        {/* ACTIONS */}
                        <div className="flex gap-3 pt-2">

                            <ActionButton
                                icon={<Mail size={16} />}
                                variant="primary"
                            >
                                Send
                            </ActionButton>

                            <ActionButton
                                icon={<Globe size={16} />}
                                variant="secondary"
                            >
                                Translate
                            </ActionButton>

                        </div>

                        {/* PROVIDERS */}
                        {providers?.flatrate && (
                            <div className="pt-4">
                                <p className="text-sm font-semibold mb-2">
                                    Available on
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

                {/* CAST SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <h2 className="text-xl font-semibold mb-4">
                        Main Cast
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