export async function POST(req: Request) {
  const { texts, target } = await req.json();

  if (!texts || !Array.isArray(texts)) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const results = await Promise.all(
      texts.map(async (text: string) => {
        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
        );

        const data = await res.json();
        return data[0].map((item: any) => item[0]).join("");
      })
    );

    return Response.json({ translated: results });

  } catch (err) {
    return Response.json({ error: "Translation failed" }, { status: 500 });
  }
}