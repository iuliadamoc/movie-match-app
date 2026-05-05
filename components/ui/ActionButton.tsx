"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export default function ActionButton({
  children,
  onClick,
  icon,
  loading = false,
  variant = "primary",
}: Props) {
  const [ripples, setRipples] = useState<any[]>([]);

  const handleClick = (e: any) => {
    if (loading) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    const newRipple = {
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  const base =
    "relative overflow-hidden px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200";

  const styles = {
    primary:
      "text-white bg-gradient-to-r from-black to-gray-800 shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:scale-[1.03]",
    secondary:
      "text-gray-800 bg-white border border-gray-200 shadow-sm hover:bg-gray-50",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      disabled={loading}
      className={`${base} ${styles[variant]} ${loading ? "opacity-70" : ""}`}
    >
      {/* RIPPLE */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
          }}
        />
      ))}

      {/* CONTENT */}
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}

      <span>{children}</span>
    </motion.button>
  );
}