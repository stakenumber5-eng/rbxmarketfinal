import { NextResponse } from "next/server";

const words = [
  "apple", "blue", "cloud", "dragon", "forest",
  "gold", "moon", "ocean", "pixel", "river",
  "shadow", "silver", "star", "storm", "sun",
  "tiger", "wolf", "zero", "rocket", "flame",
];

function randomWords(count: number) {
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Roblox username is required." },
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
        { error: "Could not contact Roblox." },
        { status: 502 }
      );
    }

    const data = await robloxResponse.json();

    if (!data.data?.length) {
      return NextResponse.json(
        { error: "Roblox user not found." },
        { status: 404 }
      );
    }

    const user = data.data[0];
    const verificationWords = randomWords(8);

    return NextResponse.json({
      userId: user.id,
      username: user.name,
      words: verificationWords,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
