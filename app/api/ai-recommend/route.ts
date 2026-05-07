import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const genreMap: any = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    "Science Fiction": 878,
    Thriller: 53,
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

        // AI ANALYSIS
        const completion =
            await openai.chat.completions.create({
                model: "gpt-4.1-mini",

                messages: [
                    {
                        role: "system",

                        content: `
You are an advanced cinematic recommendation AI.

Analyze the user's vibe deeply.

Choose genres based on:
- mood
- atmosphere
- pacing
- emotions
- avoid preferences
- prompt context

Avoid generic repetitive recommendations.

Return ONLY valid JSON.

Format:
{
  "genres": ["Drama", "Mystery"],
  "keywords": ["rainy", "emotional", "slowburn"],
  "tone": "melancholic"
}
`,
                    },

                    {
                        role: "user",

                        content: `
Mood:
${mood}

Avoid:
${avoid?.join(", ")}

Prompt:
${prompt}

Favorite genres:
${favoriteGenres.join(", ")}
`,
                    },
                ],

                temperature: 1,
            });

        const aiText =
            completion.choices[0].message.content || "{}";

        let parsed: any = {};

        try {
            parsed = JSON.parse(aiText);
        } catch {
            return NextResponse.json(
                {
                    error: "AI parsing failed",
                    raw: aiText,
                },
                { status: 500 }
            );
        }

        // FALLBACK GENRES
        const genres =
            parsed.genres?.length
                ? parsed.genres
                : ["Drama", "Thriller"];

        const genreIds = genres
            .map((g: string) => genreMap[g])
            .filter(Boolean)
            .join(",");

        // RANDOMIZATION
        const randomPage =
            Math.floor(Math.random() * 5) + 1;

        const randomYear =
            [2000, 2005, 2010, 2015][
            Math.floor(Math.random() * 4)
            ];

        // TMDB URL
        const url =
            `https://api.themoviedb.org/3/discover/movie` +
            `?api_key=${process.env.TMDB_API_KEY}` +
            `&with_genres=${genreIds}` +
            `&sort_by=popularity.desc` +
            `&vote_average.gte=6` +
            `&vote_count.gte=50` +
            `&page=${randomPage}`;

        const tmdbRes = await fetch(url);

        const tmdbData = await tmdbRes.json();

        console.log("TMDB URL:", url);
        console.log("TMDB RESULTS:", tmdbData.results?.length);

        let movies =
            tmdbData.results?.filter(
                (m: any) =>
                    m.poster_path &&
                    m.overview &&
                    m.vote_average >= 6.5
            ) || [];

        if (!movies.length) {
            console.log("USING FALLBACK");

            const fallbackRes = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`
            );

            const fallbackData =
                await fallbackRes.json();

            movies =
                fallbackData.results?.slice(0, 6) || [];
        }

        // RANDOMIZE AGAIN
        movies = movies
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);

        // MOVIE TITLES
        const movieTitles = movies
            .map((m: any) => m.title)
            .join(", ");

        // AI EXPLANATIONS
        const explanationCompletion =
            await openai.chat.completions.create({
                model: "gpt-4.1-mini",

                messages: [
                    {
                        role: "system",

                        content: `
You are a cinematic AI assistant.

Return ONLY valid JSON array.

Example:
[
  {
    "title": "Interstellar",
    "explanation": "A visually stunning emotional sci-fi journey."
  }
]

Keep explanations:
- short
- cinematic
- personalized
- emotional
`,
                    },

                    {
                        role: "user",

                        content: `
User mood:
${mood}

Avoid:
${avoid?.join(", ")}

Prompt:
${prompt}

Movies:
${movieTitles}
`,
                    },
                ],

                temperature: 0.9,
            });

        let explanations: any[] = [];

        try {
            const raw =
                explanationCompletion.choices[0]
                    .message.content || "[]";

            const cleaned = raw
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            explanations = JSON.parse(cleaned);

            if (!Array.isArray(explanations)) {
                explanations =
                    (explanations as any).movies || [];
            }

            console.log(
                "AI EXPLANATIONS:",
                explanations
            );

        } catch (err) {
            console.log(
                "EXPLANATION PARSE ERROR:",
                err
            );

            explanations = [];
        }

        // FINAL FORMAT
        const formattedMovies = movies.map(
            (movie: any) => {
                const aiExplanation =
                    explanations.find(
                        (e: any) =>
                            e.title === movie.title
                    );

                return {
                    ...movie,

                    aiExplanation:
                        aiExplanation?.explanation ||
                        "A perfect match for your current vibe.",
                };
            }
        );

        return NextResponse.json({
            ai: parsed,
            movies: formattedMovies,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            { status: 500 }
        );
    }
}