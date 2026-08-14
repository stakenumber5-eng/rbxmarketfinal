import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const username = String(body.username || "").trim();
    const verificationCode = String(
      body.verificationCode || ""
    ).trim();

    if (!username || !verificationCode) {
      return NextResponse.json(
        {
          error: "Username and verification code are required.",
        },
        { status: 400 }
      );
    }

    // Find the Roblox user by username.
    const userResponse = await fetch(
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

    if (!userResponse.ok) {
      return NextResponse.json(
        {
          error: "Unable to contact Roblox.",
        },
        { status: 502 }
      );
    }

    const userData = await userResponse.json();
    const user = userData?.data?.[0];

    if (!user) {
      return NextResponse.json(
        {
          error: "Roblox username not found.",
        },
        { status: 404 }
      );
    }

    // Get the Roblox avatar.
    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=true`,
      {
        cache: "no-store",
      }
    );

    let avatarUrl: string | null = null;

    if (avatarResponse.ok) {
      const avatarData = await avatarResponse.json();
      avatarUrl = avatarData?.data?.[0]?.imageUrl ?? null;
    }

    /*
     * BIO VERIFICATION
     *
     * The generated verificationCode needs to be checked
     * against the Roblox profile About/Bio here.
     *
     * Do NOT put a Roblox session cookie in this source file.
     * We will keep any server credential in a Vercel
     * Environment Variable.
     */

    return NextResponse.json({
      verified: false,
      username: user.name,
      userId: user.id,
      avatarUrl,
      verificationCode,
      message:
        "Roblox account found. Add the verification code to the Roblox About/Bio, then verify again.",
    });
  } catch {
    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
