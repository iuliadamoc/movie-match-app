"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 🔐 VALIDARE EMAIL
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 🔐 VALIDARE PAROLA
  const isStrongPassword = (pass: string) =>
    pass.length >= 6 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);

  const handleRegister = async () => {
    setError("");

    if (!isValidEmail(email)) {
      return setError("Invalid email format");
    }

    if (!isStrongPassword(password)) {
      return setError(
        "Password must be 6+ chars, include a number and a capital letter"
      );
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      // 🔥 FIREBASE ERRORS
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered");
      } else {
        setError("Account creation failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">

      {/* 🎬 LEFT */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="https://image.tmdb.org/t/p/original/5GA3vV1aWWHTSDO5eno8V5zDo8r.jpg"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute bottom-10 left-10 text-white max-w-md">
          <h1 className="text-5xl font-bold mb-4">
            Start Your Movie Journey
          </h1>
          <p className="text-gray-300 text-lg">
            Discover movies tailored just for you.
          </p>
        </div>
      </div>

      {/* 🧾 RIGHT */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">

        <div className="w-full max-w-md">

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
              Create account
            </h2>

            <p className="text-gray-500 mb-8">
              Join MovieMatch today
            </p>

            <div className="space-y-5">

              {/* EMAIL */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full border p-3 pt-5 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
                <label className="absolute left-3 top-2 text-xs text-gray-500">
                  Email
                </label>
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full border p-3 pt-5 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
                <label className="absolute left-3 top-2 text-xs text-gray-500">
                  Password
                </label>
              </div>

              {/* CONFIRM */}
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="peer w-full border p-3 pt-5 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
                <label className="absolute left-3 top-2 text-xs text-gray-500">
                  Confirm Password
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
                onClick={handleRegister}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                {loading ? "Creating..." : "Create account"}
              </motion.button>

            </div>

            {/* FOOTER */}
            <p className="mt-6 text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-black font-semibold">
                Login
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