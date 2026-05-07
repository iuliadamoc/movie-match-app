"use client";

import { motion } from "framer-motion";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {

  const base = `
    relative
    overflow-hidden
    w-full
    py-3.5
    px-5
    rounded-2xl
    flex justify-center items-center
    font-semibold
    transition-all duration-300
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;

  const styles = {
    primary: `
      bg-gradient-to-r
      from-purple-600
      to-blue-500
      text-white
      shadow-lg
      shadow-purple-500/20
      hover:shadow-purple-500/40
    `,

    secondary: `
      bg-white/5
      border border-white/10
      backdrop-blur-xl
      text-white
      hover:bg-white/10
    `,

    danger: `
      bg-red-500/10
      border border-red-500/20
      text-red-300
      hover:bg-red-500/20
    `,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={
        !disabled
          ? {
              scale: 1.02,
              y: -1,
            }
          : {}
      }
      whileTap={
        !disabled
          ? {
              scale: 0.98,
            }
          : {}
      }
      transition={{
        duration: 0.2,
      }}
      className={`
        ${base}
        ${styles[variant]}
        ${className}
      `}
    >

      {/* GLOW */}
      {variant === "primary" && (
        <div
          className="
            absolute inset-0
            opacity-0
            hover:opacity-100
            transition-all duration-500
            bg-gradient-to-r
            from-purple-400/20
            to-blue-400/20
          "
        />
      )}

      {/* CONTENT */}
      <span className="relative z-10">
        {children}
      </span>

    </motion.button>
  );
}