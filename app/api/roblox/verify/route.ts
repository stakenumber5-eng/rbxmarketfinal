import { NextResponse } from "next/server";

const WORDS = [
  "red",
  "blue",
  "shadow",
  "storm",
  "pixel",
  "nova",
  "alpha",
  "rapid",
  "frost",
  "neon",
  "orbit",
  "lunar",
  "rocket",
  "silver",
  "gold",
  "dark",
  "bright",
  "wild",
  "royal",
  "phantom",
  "crimson",
  "dragon",
  "tiger",
  "wolf",
  "eagle",
  "star",
  "cosmic",
  "fire",
  "ice",
  "thunder",
];

function generateWords(count: number) {
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    result.push(word);
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = body?.username?.trim();

    if (!username) {
      return NextResponse.json(
        {
          error: "Roblox username is required.",
        },
        { status: 400 }
      );
    }

    const robloxResponse = await fetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernames: [username],
          excludeBannedUsers: false,
        }),
        cache: "no-store",
      }
    );

    if (!robloxResponse.ok) {
      return NextResponse.json(
        {
          error: "Roblox username lookup failed.",
          status: robloxResponse.status,
        },
        { status: 502 }
      );
    }

    const data = await robloxResponse.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        {
          error: "Roblox user was not found.",
        },
        { status: 404 }
      );
    }

    const robloxUser = data.data[0];

    const words = generateWords(8);

    return NextResponse.json({
      success: true,
      username: robloxUser.name,
      displayName: robloxUser.displayName,
      userId: robloxUser.id,
      words,
    });
  } catch (error) {
    console.error("ROBLOX START ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while contacting Roblox.",
      },
      { status: 500 }
    );
  }
}
