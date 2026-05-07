"use client";

import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar({ user }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setName(snap.data().name);
      }
    };

    fetchUser();
  }, [user]);

  const navItems = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Favorites",
      path: "/favorites",
    },
    {
      label: "AI Assistant",
      path: "/ai",
    },
  ];

  return (
    <div className="sticky top-0 z-50 pt-5 px-4 md:px-8">

      <div
        className="
          max-w-7xl mx-auto
          h-20
          px-6
          rounded-3xl
          border border-white/10
          bg-black/40
          backdrop-blur-2xl
          flex items-center justify-between
          shadow-2xl
        "
      >

        {/* LEFT */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-4 cursor-pointer group"
        >

          <motion.div
            whileHover={{ rotate: 8, scale: 1.05 }}
            className="
              w-11 h-11
              rounded-2xl
              bg-gradient-to-br
              from-purple-600
              to-blue-500
              flex items-center justify-center
              text-white
              font-black
              shadow-lg shadow-purple-500/30
            "
          >
            M
          </motion.div>

          <h1 className="
            text-2xl
            font-black
            tracking-wide
          ">
            <span className="text-white">
              MOVIE
            </span>

            <span className="
              bg-gradient-to-r
              from-purple-400
              to-blue-400
              bg-clip-text
              text-transparent
            ">
              MATCH
            </span>
          </h1>

        </div>

        {/* CENTER NAV */}
        <div className="hidden md:flex items-center gap-3">

          {navItems.map((item) => {

            const active = pathname === item.path;

            return (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(item.path)}
                className={`
                  px-5 py-2.5 rounded-2xl
                  transition-all duration-300
                  text-sm font-medium
                  border
                  ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 border-transparent text-white shadow-lg shadow-purple-500/20"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }
                `}
              >
                {item.label}
              </motion.button>
            );
          })}

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* ACCOUNT */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/account")}
            className="
              px-4 py-2 rounded-2xl
              bg-white/5
              border border-white/10
              text-gray-300
              hover:bg-white/10
              transition-all
              text-sm
            "
          >
            {"Account"}
          </motion.button>

          {/* LOGOUT */}
          <motion.button
            onClick={() => signOut(auth)}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            className="
              px-4 py-2 rounded-2xl
              bg-red-500/20
              border border-red-500/20
              text-red-300
              hover:bg-red-500/30
              transition-all
              text-sm font-medium
            "
          >
            Logout
          </motion.button>

        </div>
      </div>
    </div>
  );
}