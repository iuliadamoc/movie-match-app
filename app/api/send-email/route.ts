import sgMail from "@sendgrid/mail";
import { env } from "process";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
    try {
        const { email, movie } = await req.json();

        if (!email || !movie) {
            return Response.json({ error: "Missing data" }, { status: 400 });
        }

        const msg = {
            to: email,
            from: process.env.EMAIL_FROM!,
            subject: `🎬 ${movie.title}`,
            html: `<div style="background:#f5f5f5;padding:30px;font-family:Arial,sans-serif;">
    
    <div style="max-width:500px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);">
      
      <!-- IMAGE -->
      <img 
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
        style="width:100%;height:auto;"
      />

      <!-- CONTENT -->
      <div style="padding:20px;">
        
        <h2 style="margin:0 0 10px 0;">
          ${movie.title}
        </h2>

        <p style="color:#888;font-size:14px;margin-bottom:10px;">
          ⭐ ${movie.vote_average} • ⏱️ ${movie.runtime} min
        </p>

        <p style="color:#444;font-size:14px;line-height:1.5;">
          ${movie.overview}
        </p>

        <!-- BUTTON -->
        <a 
          href="http://localhost:3000/movie/${movie.id}"
          style="
            display:inline-block;
            margin-top:20px;
            padding:10px 20px;
            background:black;
            color:white;
            text-decoration:none;
            border-radius:8px;
            font-size:14px;
          "
        >
          View Movie
        </a>

      </div>

    </div>

    <!-- FOOTER -->
    <p style="text-align:center;font-size:12px;color:#aaa;margin-top:20px;">
      Sent from MovieMatch 🎬
    </p>

  </div>`,
        };

        await sgMail.send(msg);

        return Response.json({ success: true });

    } catch (err) {
        console.error(err);
        return Response.json({ error: "Email failed" }, { status: 500 });
    }
}