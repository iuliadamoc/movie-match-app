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

  const [favoritesCount, setFavoritesCount] =
    useState(0);

  const [recentCount, setRecentCount] =
    useState(0);

  const [topGenre, setTopGenre] =
    useState("None");

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const memberSince =
    user?.metadata?.creationTime;

  const [savedName, setSavedName] =
    useState("");

  // AUTH + PROFILE
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      async (u) => {
        if (!u) {
          router.push("/login");
        } else {
          setUser(u);

          const ref = doc(
            db,
            "users",
            u.uid
          );

          const snap = await getDoc(ref);

          if (snap.exists()) {
            const data = snap.data();

            setName(data.name || "");
            setSavedName(data.name || "");
            setAvatar(data.avatar || "");
          }

          // RECENT
          const recent = JSON.parse(
            localStorage.getItem("recent") ||
              "[]"
          );

          setRecentCount(recent.length);

          setLoading(false);
        }
      }
    );

    return () => unsub();
  }, []);

  // FAVORITES LIVE
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const movies = snapshot.docs.map(
          (doc) => doc.data()
        );

        setFavoritesCount(snapshot.size);

        const freq: any = {};

        movies.forEach((m: any) => {
          (m.genres || []).forEach(
            (g: number) => {
              freq[g] = (freq[g] || 0) + 1;
            }
          );
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
          setTopGenre(
            genreMap[sorted[0][0]] || "Mixed"
          );
        } else {
          setTopGenre("None");
        }
      }
    );

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

  // FORMAT DATE
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
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
      const canvas =
        document.createElement("canvas");

      const MAX_WIDTH = 200;

      const scale =
        MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;

      canvas.height =
        img.height * scale;

      const ctx =
        canvas.getContext("2d");

      ctx?.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const compressed =
        canvas.toDataURL(
          "image/jpeg",
          0.7
        );

      setAvatar(compressed);
    };

    reader.readAsDataURL(file);
  };

  if (!user || loading) {
    return (
      <div className="
        min-h-screen
        bg-black
        flex items-center justify-center
        text-white
      ">
        <div className="text-center">

          <div className="
            w-16 h-16
            border-4 border-purple-500
            border-t-transparent
            rounded-full
            animate-spin
            mx-auto mb-6
          " />

          <p className="text-xl text-gray-400">
            Loading profile...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      bg-black
      text-white
      overflow-hidden
    ">

      <Navbar user={user} />

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">

        <div className="
          absolute inset-0
          bg-gradient-to-br
          from-purple-900/20
          via-black
          to-blue-900/20
        " />

        <div className="
          absolute top-0 left-0
          w-[600px] h-[600px]
          bg-purple-500/10
          rounded-full blur-3xl
        " />

        <div className="
          absolute bottom-0 right-0
          w-[500px] h-[500px]
          bg-blue-500/10
          rounded-full blur-3xl
        " />

      </div>

      <div className="
        relative z-10
        max-w-6xl mx-auto
        px-4 md:px-8
        py-10
        space-y-10
      ">

        {/* HERO */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            bg-white/5
            border border-white/10
            backdrop-blur-2xl
            rounded-3xl
            p-8
            shadow-2xl
            flex flex-col md:flex-row
            items-start md:items-center
            justify-between
            gap-8
          "
        >

          {/* LEFT */}
          <div className="
            flex items-center gap-6
          ">

            {/* AVATAR */}
            <div className="relative group">

              <img
                src={
                  avatar ||
                  "https://ui-avatars.com/api/?name=" +
                    (savedName || "User")
                }
                className="
                  w-28 h-28
                  rounded-full
                  object-cover
                  border-4 border-white/10
                  shadow-2xl
                "
              />

              <input
                type="file"
                onChange={handleAvatar}
                className="
                  absolute inset-0
                  opacity-0 cursor-pointer
                "
              />

              <div className="
  pointer-events-none
  absolute inset-0
  rounded-full
  bg-black/50
  opacity-0
  group-hover:opacity-100
  transition-all
  flex items-center justify-center
  text-sm font-medium
">
  Change
</div>

            </div>

            {/* INFO */}
            <div>

              <h1 className="
                text-4xl
                font-black
                bg-gradient-to-r
                from-white
                to-gray-400
                bg-clip-text
                text-transparent
              ">
                {savedName || "Movie Lover"}
              </h1>

              <p className="
                text-gray-400
                mt-2
              ">
                {user.email}
              </p>

              <div className="
                flex gap-3 mt-5 flex-wrap
              ">

                <div className="
                  px-4 py-2 rounded-2xl
                  bg-purple-500/10
                  border border-purple-500/20
                  text-purple-300
                  text-sm font-medium
                ">
                  🎬 {favoritesCount} Favorites
                </div>

                <div className="
                  px-4 py-2 rounded-2xl
                  bg-blue-500/10
                  border border-blue-500/20
                  text-blue-300
                  text-sm font-medium
                ">
                  👀 {recentCount} Recent
                </div>

                <div className="
                  px-4 py-2 rounded-2xl
                  bg-red-500/10
                  border border-red-500/20
                  text-red-300
                  text-sm font-medium
                ">
                  🔥 {topGenre}
                </div>

              </div>

            </div>

          </div>

          {/* SAVE */}
          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handleSave}
            className="
              px-6 py-3 rounded-2xl
              bg-gradient-to-r
              from-purple-600
              to-blue-500
              font-semibold
              shadow-lg
              shadow-purple-500/20
            "
          >
            Save changes
          </motion.button>

        </motion.div>

        {/* SETTINGS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            bg-white/5
            border border-white/10
            backdrop-blur-2xl
            rounded-3xl
            p-8
            shadow-2xl
            space-y-8
          "
        >

          <h2 className="
            text-3xl
            font-bold
            bg-gradient-to-r
            from-white
            to-gray-400
            bg-clip-text
            text-transparent
          ">
            Account Settings
          </h2>

          {/* NAME */}
          <div className="
            flex flex-col md:flex-row
            md:items-center
            justify-between
            gap-4
          ">

            <div>
              <p className="
                text-sm text-gray-500
              ">
                Name
              </p>

              <p className="
                font-medium mt-1
              ">
                {savedName || "Not set"}
              </p>
            </div>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="New name..."
              className="
                bg-white/5
                border border-white/10
                rounded-2xl
                px-4 py-3
                outline-none
                focus:border-purple-500
                transition-all
                w-full md:w-[260px]
              "
            />

          </div>

          {/* EMAIL */}
          <div className="
            flex items-center justify-between
          ">

            <div>
              <p className="
                text-sm text-gray-500
              ">
                Email
              </p>

              <p className="
                font-medium mt-1
              ">
                {user.email}
              </p>
            </div>

            <span className="
              text-xs text-gray-500
            ">
              locked
            </span>

          </div>

          {/* LANGUAGE */}
          <div className="
            flex items-center justify-between
          ">

            <div>
              <p className="
                text-sm text-gray-500
              ">
                Language
              </p>

              <p className="
                font-medium mt-1
              ">
                Auto - EN
              </p>
            </div>

            <span className="
              text-xs text-gray-500
            ">
              app setting
            </span>

          </div>

          {/* MEMBER */}
          <div className="
            flex items-center justify-between
          ">

            <div>
              <p className="
                text-sm text-gray-500
              ">
                Member since
              </p>

              <p className="
                font-medium mt-1
              ">
                {formatDate(memberSince)}
              </p>
            </div>

            <span className="
              text-xl
            ">
              🎬
            </span>

          </div>

        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            grid
            grid-cols-1 md:grid-cols-3
            gap-5
          "
        >

          {/* CARD */}
          <div className="
            bg-white/5
            border border-white/10
            backdrop-blur-2xl
            rounded-3xl
            p-8
            text-center
            shadow-2xl
          ">

            <p className="
              text-5xl font-black
            ">
              {favoritesCount}
            </p>

            <p className="
              text-gray-400 mt-3
            ">
              Favorites
            </p>

          </div>

          {/* CARD */}
          <div className="
            bg-white/5
            border border-white/10
            backdrop-blur-2xl
            rounded-3xl
            p-8
            text-center
            shadow-2xl
          ">

            <p className="
              text-5xl font-black
            ">
              {recentCount}
            </p>

            <p className="
              text-gray-400 mt-3
            ">
              Recently viewed
            </p>

          </div>

          {/* CARD */}
          <div className="
            bg-gradient-to-br
            from-purple-600/20
            to-blue-600/20
            border border-white/10
            backdrop-blur-2xl
            rounded-3xl
            p-8
            text-center
            shadow-2xl
          ">

            <p className="
              text-4xl font-black
            ">
              {topGenre}
            </p>

            <p className="
              text-gray-300 mt-3
            ">
              Top genre
            </p>

          </div>

        </motion.div>

        {/* ACTIVITY */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            bg-white/5
            border border-white/10
            backdrop-blur-2xl
            rounded-3xl
            p-8
            shadow-2xl
          "
        >

          <h3 className="
            text-3xl
            font-bold
            mb-4
            bg-gradient-to-r
            from-white
            to-gray-400
            bg-clip-text
            text-transparent
          ">
            Your activity
          </h3>

          <p className="
            text-gray-400
            text-lg leading-relaxed
          ">
            You’ve added{" "}
            <span className="
              text-white font-semibold
            ">
              {favoritesCount}
            </span>{" "}
            movies to favorites and viewed{" "}
            <span className="
              text-white font-semibold
            ">
              {recentCount}
            </span>{" "}
            recently.
          </p>

        </motion.div>

      </div>
    </div>
  );
}