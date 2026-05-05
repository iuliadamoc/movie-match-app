"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import ActionButton from "@/components/ui/ActionButton";
import { Mail, Globe } from "lucide-react";

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
        return <p className="p-6">Loading...</p>;
    }

    const { movie, cast, providers } = data;

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* NAVBAR */}
            <Navbar user={user} />

            <div className="max-w-6xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.1)] p-8"
                >

                    {/* TOP */}
                    <div className="flex gap-8">

                        {/* POSTER */}
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://via.placeholder.com/300x450"
                            }
                            className="w-72 rounded-xl shadow"
                        />

                        {/* INFO */}
                        <div className="flex-1">

                            <h1 className="text-4xl font-bold mb-2">
                                {movie.title}
                            </h1>

                            <p className="text-gray-500 mb-3">
                                {movie.release_date?.slice(0, 4)} •{" "}
                                {movie.genres?.map((g: any) => g.name).join(", ")}
                            </p>

                            <div className="flex gap-4 text-sm text-gray-600 mb-4">
                                <span>⭐ {movie.vote_average}</span>
                                <span>⏱️ {movie.runtime} min</span>
                                <span>🔥 {Math.round(movie.popularity)}</span>
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-6">
                                {movie.overview}
                            </p>

                            {/* BUTTONS */}
                            <div className="flex gap-3">

                                <ActionButton
                                    icon={<Mail size={16} />}
                                    variant="primary"
                                    onClick={() => console.log("send")}
                                >
                                    Send
                                </ActionButton>

                                <ActionButton
                                    icon={<Globe size={16} />}
                                    variant="secondary"
                                    onClick={() => console.log("translate")}
                                >
                                    Translate
                                </ActionButton>

                            </div>

                            {/* PROVIDERS */}
                            {providers?.flatrate && (
                                <div className="mt-6">
                                    <p className="font-semibold mb-2">📺 Available on</p>

                                    <div className="flex gap-2">
                                        {providers.flatrate.map((p: any) => (
                                            <img
                                                key={p.provider_id}
                                                src={`https://image.tmdb.org/t/p/w200${p.logo_path}`}
                                                className="w-10 rounded"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* CAST */}
                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold mb-6">
                            Main Cast
                        </h2>

                        <div className="flex gap-6 overflow-x-auto pb-2">

                            {cast.map((actor: any) => (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    key={actor.id}
                                    className="min-w-[120px] text-center"
                                >
                                    <img
                                        src={
                                            actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                                : "https://via.placeholder.com/150"
                                        }
                                        className="rounded-lg mb-2 shadow"
                                    />
                                    <p className="text-sm font-medium">
                                        {actor.name}
                                    </p>
                                </motion.div>
                            ))}

                        </div>
                    </div>

                </motion.div>

            </div>
        </div>
    );
}