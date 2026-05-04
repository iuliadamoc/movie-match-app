export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "popularity";
  const provider = searchParams.get("provider");
  const genre = searchParams.get("genre");
  const query = searchParams.get("query");

  let url = "";

  // 🔍 SEARCH
  if (query) {
    url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}`;
  } else {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${page}&sort_by=${sort}.desc`;

    // doar filme reale (nu junk)
    url += `&vote_count.gte=100`;
    url += `&primary_release_date.lte=${new Date().toISOString().split("T")[0]}`;

    if (provider) {
      url += `&with_watch_providers=${provider}&watch_region=RO`;
    }

    if (genre) {
      url += `&with_genres=${genre}`;
    }
  }

  const res = await fetch(url);
  const data = await res.json();

  return Response.json(data);
}