"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch {
      setError("Invalid email or password");
    }

    setLoading(false);
    };

  const handleGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        router.push("/");
    } catch (err) {
        console.log(err);
    }
    };

  return (
    <div className="min-h-screen flex">

      {/* 🎬 LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative">

        <img
          src="https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

        <div className="absolute bottom-10 left-10 text-white max-w-md">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Find Your Next Favorite Movie
          </h1>

          <p className="text-gray-300 text-lg">
            Smart recommendations. Real-time data. Beautiful experience.
          </p>
        </div>
      </div>

      {/* 🧾 RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">

        <div className="w-full max-w-md">

          {/* CARD */}
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">

            {/* LOGO */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-700 rounded-lg flex items-center justify-center text-white font-bold">
                    M
                </div>
                <h1 className="text-2xl font-bold tracking-wider">
                    <span className="text-red-500">MOVIE</span>
                    <span className="text-black">MATCH</span>
                </h1>
            </div>

            <h2 className="text-3xl font-bold mb-2">
              Welcome back
            </h2>

            <p className="text-gray-500 mb-8">
              Continue your journey
            </p>

            {/* FORM */}
            <div className="space-y-5">

              {/* EMAIL */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full border border-gray-300 p-3 pt-5 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
                <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm">
                  Email
                </label>
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full border border-gray-300 p-3 pt-5 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
                <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm">
                  Password
                </label>

                <button
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-3 text-sm text-gray-500"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>

              {/* ERROR */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {/* BUTTON */}
              <motion.button
                onClick={handleLogin}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 flex justify-center"
                >
                {loading ? (
                <span className="animate-pulse">Loading...</span>
                ) : (
                "Login"
                )}
                </motion.button>

            </div>

            {/* DIVIDER */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* SOCIAL MOCK */}
            <button
            onClick={handleGoogle}
            className="w-full border py-3 rounded-lg hover:bg-gray-100"
            >
            Continue with Google
            </button>

            {/* FOOTER */}
            <p className="mt-6 text-sm text-gray-500 text-center">
              Don’t have an account?{" "}
              <Link href="/register" className="text-black font-semibold">
                Create one
              </Link>
            </p>

          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2026 MovieMatch
          </p>

        </div>
      </div>
    </div>
  );
}