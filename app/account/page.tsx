"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function AccountPage() {
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");

    const [favoritesCount, setFavoritesCount] = useState(0);
    const [recentCount, setRecentCount] = useState(0);
    const [topGenre, setTopGenre] = useState("None");

    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const memberSince = user?.metadata?.creationTime;
    const [savedName, setSavedName] = useState("");

    // AUTH + PROFILE
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (!u) {
                router.push("/login");
            } else {
                setUser(u);

                const ref = doc(db, "users", u.uid);
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    const data = snap.data();
                    setName(data.name || "");
                    setSavedName(data.name || "");
                    setAvatar(data.avatar || "");
                }

                // RECENT (localStorage)
                const recent = JSON.parse(localStorage.getItem("recent") || "[]");
                setRecentCount(recent.length);

                setLoading(false);
            }
        });

        return () => unsub();
    }, []);

    // LIVE FAVORITES + GENRE
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "favorites"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const movies = snapshot.docs.map((doc) => doc.data());

            // count
            setFavoritesCount(snapshot.size);

            // compute genres
            const freq: any = {};

            movies.forEach((m: any) => {
                (m.genres || []).forEach((g: number) => {
                    freq[g] = (freq[g] || 0) + 1;
                });
            });

            const sorted = Object.entries(freq).sort(
                (a: any, b: any) => b[1] - a[1]
            );

            const genreMap: any = {
                28: "Action",
                12: "Adventure",
                16: "Animation",
                35: "Comedy",
                18: "Drama",
                27: "Horror",
            };

            if (sorted.length > 0) {
                setTopGenre(genreMap[sorted[0][0]] || "Mixed");
            } else {
                setTopGenre("None");
            }
        });

        return () => unsubscribe();
    }, [user]);

    // SAVE PROFILE
    const handleSave = async () => {
        if (!user) return;

        await setDoc(doc(db, "users", user.uid), {
            name,
            avatar,
            email: user.email,
        });
        setSavedName(name); 
        setName("");

        toast.success("Profile updated ✔");
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    // AVATAR PREVIEW
    const handleAvatar = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (event: any) => {
            img.src = event.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement("canvas");

            const MAX_WIDTH = 200;
            const scale = MAX_WIDTH / img.width;

            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compressed = canvas.toDataURL("image/jpeg", 0.7); // compress to 70% quality

            setAvatar(compressed);
        };

        reader.readAsDataURL(file);
    };

    if (!user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Navbar user={user} />

            <div className="max-w-5xl mx-auto mt-10 space-y-8">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-black to-gray-800 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between"
                >

                    {/* LEFT */}
                    <div className="flex items-center gap-6">

                        <div className="relative">
                            <img
                                src={
                                    avatar ||
                                    "https://ui-avatars.com/api/?name=" + (savedName || "User")
                                }
                                className="w-20 h-20 rounded-full object-cover border-2 border-white"
                            />

                            <input
                                type="file"
                                onChange={handleAvatar}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold">
                            {savedName || "Your Name"}
                            </h2>

                            <p className="text-gray-300 text-sm">
                                {user.email}
                            </p>
                        </div>

                    </div>

                    {/* RIGHT */}
                    <button
                        onClick={handleSave}
                        className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                    >
                        Save changes
                    </button>

                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow p-5 space-y-5"
                >

                    <h3 className="text-base font-semibold text-gray-800">
                        Account Settings
                    </h3>

                    {/* NAME */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="text-sm font-medium">{savedName || "Not set"}</p>
                        </div>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border px-3 py-1.5 rounded-lg text-sm w-[180px]"
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-sm font-medium">{user.email}</p>
                        </div>

                        <span className="text-xs text-gray-400">locked</span>
                    </div>

                    {/* LANGUAGE */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Language</p>
                            <p className="text-sm font-medium">Auto - EN</p>
                        </div>

                        <span className="text-xs text-gray-400">app setting</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Member since</p>
                            <p className="text-sm font-medium">
                                {formatDate(memberSince)}
                            </p>
                        </div>

                        <span className="text-xs text-gray-400">🎬</span>
                    </div>

                </motion.div>

                {/* STATS */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-4"
                >
                    <div className="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition">
                        <p className="text-2xl font-semibold">{favoritesCount}</p>
                        <p className="text-xs text-gray-500 mt-1">Favorites</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-lg text-center hover:shadow-xl transition">
                        <p className="text-2xl font-semibold">{recentCount}</p>
                        <p className="text-xs text-gray-500 mt-1">Recently viewed</p>
                    </div>

                    <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-5 shadow-lg text-center">
                        <p className="text-lg font-semibold">{topGenre}</p>
                        <p className="text-xs text-gray-300 mt-1">Top genre</p>
                    </div>
                </motion.div>

                {/* ACTIVITY */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow p-6"
                >
                    <h3 className="text-lg font-semibold mb-2">
                        Your activity
                    </h3>

                    <p className="text-gray-500 text-sm">
                        You’ve added {favoritesCount} movies to favorites and viewed {recentCount} recently.
                    </p>
                </motion.div>

            </div>
        </div>
    );
}