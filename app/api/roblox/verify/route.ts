import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, words } = await request.json();

    if (!userId || !Array.isArray(words) || words.length !== 8) {
      return NextResponse.json(
        { error: "User ID and exactly 8 words are required." },
        { status: 400 }
      );
    }

    // Get the public Roblox profile
    const response = await fetch(
      `https://users.roblox.com/v1/users/${userId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Could not find Roblox account." },
        { status: 404 }
      );
    }

    const profile = await response.json();

    /*
     * Roblox's public user endpoint may not expose the About
     * description in every API context.
     *
     * We therefore do NOT claim verification unless we actually
     * receive and compare the description.
     */
    const description =
      typeof profile.description === "string"
        ? profile.description.trim()
        : "";

    const expectedWords = words.join(" ").trim();

    const verified =
      description.length > 0 &&
      description === expectedWords;

    return NextResponse.json({
      verified,
      username: profile.name,
      userId: profile.id,
      message: verified
        ? "✓ Roblox account successfully verified!"
        : "The About/Bio does not exactly match the 8 verification words.",
    });
  } catch (error) {
    console.error("Verification error:", error);

    return NextResponse.json(
      { error: "Something went wrong while verifying the account." },
      { status: 500 }
    );
  }
}
