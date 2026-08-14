import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    // Find the Roblox user by username
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
    const user = userData.data?.[0];

    if (!user) {
      return NextResponse.json(
        { error: "Roblox user not found." },
        { status: 404 }
      );
    }

    // Get the user's public profile information
    const profileResponse = await fetch(
      `https://users.roblox.com/v1/users/${user.id}`,
      {
        cache: "no-store",
      }
    );

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: "Could not get Roblox profile." },
        { status: 502 }
      );
    }

    const profile = await profileResponse.json();

    // Get Roblox avatar
    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`,
      {
        cache: "no-store",
      }
    );

    let avatarUrl = null;

    if (avatarResponse.ok) {
      const avatarData = await avatarResponse.json();
      avatarUrl = avatarData.data?.[0]?.imageUrl ?? null;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.name,
        displayName: user.displayName,
        description: profile.description ?? "",
        avatarUrl,
      },
    });
  } catch (error) {
    console.error("Roblox API error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
