"use client";

type SidebarProps = {
  search: string;
  setSearch: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  setPage: (v: number) => void;
  genres: any[];
  selectedGenre: number | null;
  setSelectedGenre: (v: number | null) => void;
  provider: string;
  setProvider: (v: string) => void;
  reset: () => void;
};

export default function Sidebar({
  search,
  setSearch,
  sort,
  setSort,
  setPage,
  genres,
  selectedGenre,
  setSelectedGenre,
  provider,
  setProvider,
  reset,
}: SidebarProps) {
  return (
    <div className="w-72 bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] space-y-6">

      <h2 className="text-xl font-semibold tracking-tight">
        Filters
      </h2>

      {/* SEARCH */}
      <input
        placeholder="Search movie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-black outline-none"
      />

      {/* SORT */}
      <select
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          setPage(1);
        }}
        className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-black"
      >
        <option value="popularity">🔥 Popular</option>
        <option value="vote_average">⭐ Top Rated</option>
        <option value="release_date">📅 Newest</option>
      </select>

      {/* GENRES */}
      <div>
        <p className="text-sm mb-3 font-semibold text-gray-600">
          Genres
        </p>

        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() =>
                setSelectedGenre(g.id === selectedGenre ? null : g.id)
              }
              className={`px-3 py-1.5 rounded-full text-xs ${
                selectedGenre === g.id
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* PROVIDERS */}
      <div>
        <p className="text-sm mb-3 font-semibold text-gray-600">
          Streaming
        </p>

        <div className="flex gap-2 flex-wrap">
          {[
            { id: "8", name: "Netflix", color: "bg-red-500" },
            { id: "337", name: "Disney+", color: "bg-indigo-500" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() =>
                setProvider(p.id === provider ? "" : p.id)
              }
              className={`${p.color} text-white px-3 py-1.5 rounded-full text-xs ${
                provider === p.id
                  ? "ring-2 ring-black"
                  : "hover:opacity-90"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* RESET */}
      <button
        onClick={reset}
        className="w-full bg-gray-100 py-2.5 rounded-lg hover:bg-red-400 hover:text-white transition font-medium"
      >
        Reset Filters
      </button>

    </div>
  );
}