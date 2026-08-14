import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, verificationCode } = await request.json();

    if (!username || !verificationCode) {
      return NextResponse.json(
        { error: "Username and verification code are required." },
        { status: 400 }
      );
    }

    // 1. Find Roblox user
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
        { error: "Could not contact Roblox." },
        { status: 502 }
      );
    }

    const userData = await userResponse.json();
    const user = userData?.data?.[0];

    if (!user) {
      return NextResponse.json(
        { error: "Roblox username not found." },
        { status: 404 }
      );
    }

    // 2. Get avatar
    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=true`,
      { cache: "no-store" }
    );

    const avatarData = avatarResponse.ok
      ? await avatarResponse.json()
      : null;

    const avatarUrl =
      avatarData?.data?.[0]?.imageUrl ?? null;

    /*
     * 3. ABOUT VERIFICATION
     *
     * This is intentionally NOT implemented with a Roblox
     * session cookie in source code.
     *
     * We need a supported authenticated Roblox API method
     * to retrieve the user's About/description.
     *
     * Once that is available:
     *
     * const about = await getRobloxAbout(user.id);
     *
     * const verified =
     *   about.trim() === verificationCode.trim();
     */

    return NextResponse.json({
      verified: false,
      username: user.name,
      userId: user.id,
      avatarUrl,
      message:
        "Account found. About verification still needs an authenticated Roblox API connection.",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
