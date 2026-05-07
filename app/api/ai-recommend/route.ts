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
    ScienceFiction: 878,
    Thriller: 53,
};

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { mood, avoid, prompt } = body;

        // OPENAI ANALYSIS
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are a movie recommendation AI.

Analyze the user's mood and return ONLY valid JSON.

Return this format:
{
  "genres": ["Drama", "Romance"],
  "keywords": ["emotional", "cozy", "warm"],
  "tone": "comforting"
}
`,
                },
                {
                    role: "user",
                    content: `
Mood: ${mood}

Avoid:
${avoid?.join(", ")}

Prompt:
${prompt}
`,
                },
            ],
            temperature: 0.8,
        });

        const aiText = completion.choices[0].message.content || "{}";

        let parsed;

        try {
            parsed = JSON.parse(aiText);
        } catch {
            return NextResponse.json({
                error: "AI response parsing failed",
            });
        }

        const genres = parsed.genres || [];

        const genreIds = genres
            .map((g: string) => genreMap[g])
            .filter(Boolean)
            .join(",");

        // TMDB REQUEST
        const tmdbRes = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreIds}&sort_by=popularity.desc&vote_average.gte=6.5`
        );

        const tmdbData = await tmdbRes.json();

        const movies = tmdbData.results?.slice(0, 8) || [];

        // GENERATE AI EXPLANATIONS

        const movieTitles = movies.map((m: any) => m.title).join(", ");

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
                    `,
                    },
                    {
                        role: "user",
                        content: `
                    User mood: ${mood}

                    Prompt:
                    ${prompt}

                    Movies:
                    ${movieTitles}
                    `,
                    },
                ],
                temperature: 0.9,
            });

        let explanations = [];

        try {
            explanations = JSON.parse(
                explanationCompletion.choices[0].message.content || "[]"
            );
        } catch {
            explanations = [];
        }

        return NextResponse.json({
            ai: parsed,
            movies,
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