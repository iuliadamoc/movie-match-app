export default function MovieSkeleton() {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[28px]
        bg-white/5
        border border-white/10
        backdrop-blur-2xl
        shadow-2xl
        animate-pulse
      "
    >

      {/* IMAGE */}
      <div
        className="
          w-full
          h-80
          bg-gradient-to-br
          from-white/5
          via-white/10
          to-white/5
        "
      />

      {/* OVERLAY */}
      <div className="
        absolute inset-0
        bg-gradient-to-t
        from-black/60
        via-transparent
        to-transparent
      " />

      {/* CONTENT */}
      <div className="
        absolute bottom-0
        w-full
        p-5
        space-y-3
      ">

        {/* TITLE */}
        <div
          className="
            h-5
            rounded-full
            bg-white/10
            w-3/4
          "
        />

        {/* YEAR */}
        <div
          className="
            h-3
            rounded-full
            bg-white/10
            w-1/4
          "
        />

      </div>

      {/* RATING */}
      <div
        className="
          absolute top-4 right-4
          w-14 h-7
          rounded-full
          bg-white/10
        "
      />

    </div>
  );
}