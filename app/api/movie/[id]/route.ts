export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // movie details
  const movieRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`
  );

  const movie = await movieRes.json();

  // distinct request for cast 
  const castRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}`
  );

  const castData = await castRes.json();

  const providerRes = await fetch(
  `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
    );

    const providers = await providerRes.json();

  return Response.json({
    movie,
    cast: castData.cast.slice(0, 7), // top 7 cast members
    providers
  });
  
}