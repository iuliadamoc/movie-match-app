export async function POST(req: Request) {
  try {
    const { texts, target } = await req.json();

    if (!texts || !Array.isArray(texts)) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: texts,
          target: target,
        }),
      }
    );

    const data = await res.json();

    if (!data?.data?.translations) {
      return Response.json({ error: "Translation failed" }, { status: 500 });
    }

    const translated = data.data.translations.map(
      (t: any) => t.translatedText
    );

    return Response.json({ translated });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}