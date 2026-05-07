"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Navbar({ user }: any) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center h-6 mb-6">

      {/* CLICKABLE LOGO */}
      <div
        onClick={() => router.push("/")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">
          M
        </div>

        <h1 className="text-lg font-semibold tracking-wide">
          <span className="text-red-500">MOVIE</span>
          <span className="text-black">MATCH</span>
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex gap-3 items-center">
        <span className="text-sm text-gray-600">
          {user.email}
        </span>

        <button onClick={() => router.push("/favorites")}>
          Favorites
        </button>

        <motion.button
          onClick={() => signOut(auth)}
          whileHover={{ scale: 1.05, backgroundColor: "#e00" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-900"
        >
          Logout
        </motion.button>
      </div>

    </div>
  );
}