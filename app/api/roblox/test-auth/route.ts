import { NextResponse } from "next/server";

export async function GET() {
  const cookie = process.env.ROBLOX_AUTH_COOKIE;

  if (!cookie) {
    return NextResponse.json(
      { error: "ROBLOX_AUTH_COOKIE is not configured." },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://users.roblox.com/v1/users/authenticated",
    {
      headers: {
        Cookie: `.ROBLOSECURITY=${cookie}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Roblox authentication failed.",
        status: response.status,
      },
      { status: 401 }
    );
  }

  const user = await response.json();

  return NextResponse.json({
    authenticated: true,
    username: user.name,
    userId: user.id,
  });
}
