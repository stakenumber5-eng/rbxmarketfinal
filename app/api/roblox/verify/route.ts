import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, words } = await request.json();

    if (!userId || !Array.isArray(words) || words.length !== 8) {
      return NextResponse.json(
        { error: "Invalid verification request." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://users.roblox.com/v1/users/${userId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Could not find Roblox profile." },
        { status: 404 }
      );
    }

    const user = await response.json();

    const about = String(user.description || "").toLowerCase();

    const requiredWords = words.map((word: string) =>
      word.toLowerCase().trim()
    );

    const verified = requiredWords.every((word: string) =>
      about.includes(word)
    );

    return NextResponse.json({
      verified,
      username: user.name,
      userId: user.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Verification failed." },
      { status: 500 }
    );
  }
}
