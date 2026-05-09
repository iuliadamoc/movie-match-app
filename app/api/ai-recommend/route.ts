import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const moodToGenres: any = {
    Romantic: [10749, 18], // Romance + Drama
    Funny: [35],
    Emotional: [18],
    Dark: [53, 9648], // Thriller + Mystery
    Mindblowing: [878, 12],
    Cozy: [10751, 35],
    "Sci-Fi": [878],
    Adventurous: [12, 28],
};

const avoidToGenres: any = {
    Horror: 27,
    Violence: 28,
    Gore: 27,
    "Too Emotional": 18,
};

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            mood,
            avoid,
            prompt,
            favoriteGenres = [],
        } = body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: `
You analyze a movie vibe.

Return ONLY JSON:
{
  "keywords": ["love", "relationship"],
  "tone": "romantic"
}
          `,
                },
                {
                    role: "user",
                    content: `
Mood: ${mood}
Avoid: ${avoid?.join(", ")}
Prompt: ${prompt}
          `,
                },
            ],
            temperature: 0.7,
        });

        let aiParsed: any = {};

        try {
            aiParsed = JSON.parse(
                completion.choices[0].message.content || "{}"
            );
        } catch {
            aiParsed = {};
        }

        const includeGenres = moodToGenres[mood] || [18];

        const excludeGenres =
            avoid
                ?.map((a: string) => avoidToGenres[a])
                .filter(Boolean) || [];

        const url =
            `https://api.themoviedb.org/3/discover/movie` +
            `?api_key=${process.env.TMDB_API_KEY}` +
            `&with_genres=${includeGenres.join(",")}` +
            `&without_genres=${excludeGenres.join(",")}` +
            `&sort_by=vote_average.desc` +
            `&vote_average.gte=6.5` +
            `&vote_count.gte=200` +
            `&page=${Math.floor(Math.random() * 5) + 1}`;

        const tmdbRes = await fetch(url);
        const tmdbData = await tmdbRes.json();

        let movies =
            tmdbData.results?.filter((m: any) => {
                if (!m.poster_path || !m.overview) return false;

                if (excludeGenres.length > 0) {
                    const hasBad = m.genre_ids?.some((id: number) =>
                        excludeGenres.includes(id)
                    );
                    if (hasBad) return false;
                }

                return true;
            }) || [];

        if (mood === "Romantic") {
            movies = movies.filter((m: any) =>
                m.genre_ids.includes(10749)
            );
        }

        if (!movies.length) {
            const fallbackRes = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`
            );

            const fallbackData = await fallbackRes.json();

            movies = fallbackData.results?.slice(0, 6) || [];
        }

        const keywords = (aiParsed.keywords || []).map((k: string) =>
  k.toLowerCase()
);

const scoredMovies = movies.map((movie: any) => {
  let score = 0;

  if (movie.genre_ids.some((g: number) => includeGenres.includes(g))) {
    score += 40;
  }

  const overview = movie.overview.toLowerCase();

  const matches = keywords.filter((k: string) =>
    overview.includes(k)
  ).length;

  score += Math.min(30, matches * 10);

  score += movie.vote_average * 2;

  if (movie.genre_ids.some((g: number) => excludeGenres.includes(g))) {
    score -= 50;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    ...movie,
    matchScore: score,
  };
});

        movies = scoredMovies
  .sort((a: any, b: any) => b.matchScore - a.matchScore)
  .slice(0, 6);

        const titles = movies.map((m: any) => m.title).join(", ");

        const explanationCompletion =
            await openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: `
                            Return ONLY JSON array:

                            [
                            { "title": "Movie", "explanation": "short cinematic explanation" }
                            ]
                                        `,
                    },
                    {
                        role: "user",
                        content: `
                            Mood: ${mood}
                            Prompt: ${prompt}
                            Movies: ${titles}
                                        `,
                    },
                ],
                temperature: 0.8,
            });

        let explanations: any[] = [];

        try {
            const raw =
                explanationCompletion.choices[0].message.content || "[]";

            const cleaned = raw
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            explanations = JSON.parse(cleaned);
        } catch {
            explanations = [];
        }

        const formattedMovies = movies.map((movie: any) => {
            const aiExplanation = explanations.find(
                (e: any) => e.title === movie.title
            );

            return {
                ...movie,
                matchScore: movie.matchScore,
                aiExplanation:
                    aiExplanation?.explanation ||
                    "A perfect match for your current vibe.",
            };
        });

        return NextResponse.json({
            ai: aiParsed,
            movies: formattedMovies,
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}