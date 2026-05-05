"use client";

import { motion } from "framer-motion";

export default function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

      <div className="flex flex-col items-center gap-6">

        {/* LOGO / ICON */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
        />

        {/* TEXT */}
        <motion.p
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
          className="text-gray-500 text-sm"
        >
          Loading movie...
        </motion.p>

      </div>

    </div>
  );
}