"use client";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "@/lib/firebase";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useState } from "react";

import { motion } from "framer-motion";

import {
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [show, setShow] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  // LOGIN
  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      router.push("/");
    } catch {
      setError(
        "Invalid email or password"
      );
    }

    setLoading(false);
  };

  // GOOGLE
  const handleGoogle = async () => {
    try {
      await signInWithPopup(
        auth,
        googleProvider
      );

      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="
      min-h-screen
      bg-black
      text-white
      overflow-hidden
      flex
    ">

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">

        <div className="
          absolute inset-0
          bg-gradient-to-br
          from-purple-900/30
          via-black
          to-blue-900/20
        " />

        <div className="
          absolute top-0 left-0
          w-[700px] h-[700px]
          bg-purple-500/10
          rounded-full blur-3xl
        " />

        <div className="
          absolute bottom-0 right-0
          w-[600px] h-[600px]
          bg-blue-500/10
          rounded-full blur-3xl
        " />

      </div>

      {/* LEFT SIDE */}
      {/* LEFT SIDE */}
<div className="
  hidden lg:block
  w-[62%]
  relative
  z-10
  p-6
">

  <motion.div
    initial={{
      opacity: 0,
      scale: 1.05,
    }}
    animate={{
      opacity: 1,
      scale: 1,
    }}
    transition={{
      duration: 1,
    }}
    className="
      relative
      w-full
      h-full
      min-h-screen
      rounded-[40px]
      overflow-hidden
      border border-white/10
      shadow-2xl
    "
  >

    {/* IMAGE */}
    <img
      src="https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg"
      className="
        absolute inset-0
        w-full h-full
        object-cover
      "
    />

    {/* OVERLAY */}
    <div className="
      absolute inset-0
      bg-gradient-to-t
      from-black
      via-black/30
      to-black/10
    " />

    {/* CONTENT */}
    <div className="
      absolute bottom-0
      p-14
      max-w-2xl
    ">

      <h1 className="
        text-6xl
        font-black
        leading-[0.95]
        mb-8
      ">
        Find your
        <br />
        next obsession.
      </h1>

      <p className="
        text-gray-300
        text-xl
        leading-8
        max-w-xl
      ">
        Personalized AI-powered movie
        recommendations with cinematic
        vibes, real-time discovery and
        smart mood matching.
      </p>

    </div>

  </motion.div>

</div>

      {/* RIGHT SIDE */}
      <div className="
        w-[42%]
        relative z-10
        flex items-center justify-center
        px-6 py-10
      ">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            w-full max-w-md
          "
        >

          {/* LOGO */}
          <div className="
            flex items-center gap-4
            mb-10
          ">

            <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.05,
              }}
              className="
                w-14 h-14 rounded-2xl
                bg-gradient-to-br
                from-purple-600
                to-blue-500
                flex items-center justify-center
                text-white
                font-black text-xl
                shadow-lg shadow-purple-500/30
              "
            >
              M
            </motion.div>

            <div>

              <h1 className="
                text-3xl
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

              <p className="
                text-gray-500 text-sm
              ">
                AI movie discovery platform
              </p>

            </div>

          </div>

          {/* CARD */}
          <div className="
            bg-white/5
            border border-white/10
            backdrop-blur-2xl
            rounded-[32px]
            p-8 md:p-10
            shadow-2xl
          ">

            <h2 className="
              text-4xl
              font-black
              mb-3
            ">
              Welcome back
            </h2>

            <p className="
              text-gray-400
              mb-10
            ">
              Continue your cinematic journey.
            </p>

            {/* FORM */}
            <div className="
              space-y-5
            ">

              {/* EMAIL */}
              <div className="
                relative
              ">

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="
                    w-full
                    bg-white/5
                    border border-white/10
                    rounded-2xl
                    px-5 py-4
                    outline-none
                    text-white
                    placeholder:text-gray-500
                    focus:border-purple-500
                    transition-all
                  "
                />

              </div>

              {/* PASSWORD */}
              <div className="
                relative
              ">

                <input
                  type={
                    show
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-white/5
                    border border-white/10
                    rounded-2xl
                    px-5 py-4
                    pr-14
                    outline-none
                    text-white
                    placeholder:text-gray-500
                    focus:border-purple-500
                    transition-all
                  "
                />

                <button
                  onClick={() =>
                    setShow(!show)
                  }
                  className="
                    absolute right-5 top-1/2
                    -translate-y-1/2
                    text-gray-500
                    hover:text-white
                    transition-all
                  "
                >
                  {show ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {/* ERROR */}
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                    bg-red-500/10
                    border border-red-500/20
                    text-red-300
                    rounded-2xl
                    px-4 py-3
                    text-sm
                  "
                >
                  {error}
                </motion.div>
              )}

              {/* LOGIN BUTTON */}
              <motion.button
                onClick={handleLogin}
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="
                  w-full
                  py-4 rounded-2xl
                  bg-gradient-to-r
                  from-purple-600
                  to-blue-500
                  font-semibold
                  shadow-lg
                  shadow-purple-500/20
                  flex items-center justify-center
                "
              >
                {loading ? (
                  <span className="
                    animate-pulse
                  ">
                    Loading...
                  </span>
                ) : (
                  "Login"
                )}
              </motion.button>

            </div>

            {/* DIVIDER */}
            <div className="
              flex items-center
              gap-4 my-8
            ">

              <div className="
                flex-1 h-px
                bg-white/10
              " />

              <span className="
                text-sm text-gray-500
              ">
                OR
              </span>

              <div className="
                flex-1 h-px
                bg-white/10
              " />

            </div>

            {/* GOOGLE */}
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={handleGoogle}
              className="
                w-full
                py-4 rounded-2xl
                bg-white/5
                border border-white/10
                hover:bg-white/10
                transition-all
                font-medium
              "
            >
              Continue with Google
            </motion.button>

            {/* FOOTER */}
            <p className="
              mt-8
              text-center
              text-gray-500
              text-sm
            ">
              Don’t have an account?{" "}

              <Link
                href="/register"
                className="
                  text-white
                  font-semibold
                  hover:text-purple-400
                  transition-all
                "
              >
                Create one
              </Link>

            </p>

          </div>

          <p className="
            text-center
            text-xs
            text-gray-600
            mt-8
          ">
            © 2026 MovieMatch
          </p>

        </motion.div>

      </div>
    </div>
  );
}