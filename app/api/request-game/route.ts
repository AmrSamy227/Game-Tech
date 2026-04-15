import { NextResponse } from "next/server";
import { gamesLibrary } from "@/lib/gamesData";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, gameTitle, platform, reason } = body;

    // 1️⃣ Check if the game already exists
    const exists = gamesLibrary.some(
      (game) =>
        game.title.toLowerCase().trim() === gameTitle.toLowerCase().trim()
    );

    if (exists) {
      return NextResponse.json(
        { message: "This game already exists in the library." },
        { status: 400 }
      );
    }

    // Check if email config is provided
    if (!process.env.GAME_REQUEST_EMAIL) {
      return NextResponse.json(
        { message: "Email service not configured" },
        { status: 503 }
      );
    }

    // 2️⃣ Send Email to admin
    await resend.emails.send({
      from: "Game Requests <onboarding@resend.dev>",
      to: process.env.GAME_REQUEST_EMAIL,
      subject: `New Game Request: ${gameTitle}`,
      html: `
        <h2>New Game Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Game Title:</strong> ${gameTitle}</p>
        <p><strong>Platform:</strong> ${platform}</p>
        <p><strong>Reason:</strong> ${reason}</p>
      `,
    });

    return NextResponse.json({ message: "Request sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
