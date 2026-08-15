import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Supabase environment variables are missing.");
}

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
);

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { userId, words } = await request.json();

    if (!userId || !Array.isArray(words) || words.length !== 8) {
      return NextResponse.json(
        {
          error: "User ID and exactly 8 words are required.",
        },
        { status: 400 }
      );
    }

    // Get Roblox public profile
    const response = await fetch(
      `https://users.roblox.com/v1/users/${userId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Could not find Roblox account.",
        },
        { status: 404 }
      );
    }

    const profile = await response.json();

    const description =
      typeof profile.description === "string"
        ? profile.description.trim()
        : "";

    const expectedWords = words.join(" ").trim();

    const verified =
      description.length > 0 &&
      description === expectedWords;

    // Verification failed
    if (!verified) {
      return NextResponse.json({
        verified: false,
        username: profile.name,
        userId: profile.id,
        message:
          "The About/Bio does not exactly match the 8 verification words.",
      });
    }

    // Roblox avatar
    const avatarUrl =
      `https://www.roblox.com/headshot-thumbnail/image?userId=${profile.id}&width=150&height=150&format=png`;

    // Save verified Roblox account
    const { error: databaseError } = await supabase
      .from("verified_users")
      .upsert(
        {
          roblox_user_id: profile.id,
          username: profile.name,
          avatar_url: avatarUrl,
          verified: true,
          verified_at: new Date().toISOString(),
        },
        {
          onConflict: "roblox_user_id",
        }
      );

    if (databaseError) {
      console.error(
        "Supabase database error:",
        databaseError
      );

      return NextResponse.json(
        {
          error:
            "Roblox was verified, but we could not save the account.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // CREATE LOGIN SESSION
    // --------------------------------------------------

    const sessionToken = crypto.randomBytes(32).toString("hex");

    const sessionTokenHash = hashToken(sessionToken);

    // Session lasts 30 days
    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { error: sessionError } = await supabase
      .from("auth_sessions")
      .insert({
        session_token_hash: sessionTokenHash,
        roblox_user_id: profile.id,
        expires_at: expiresAt,
      });

    if (sessionError) {
      console.error(
        "Session database error:",
        sessionError
      );

      return NextResponse.json(
        {
          error:
            "Roblox was verified, but the login session could not be created.",
        },
        { status: 500 }
      );
    }

    // Create response
    const result = NextResponse.json({
      verified: true,
      username: profile.name,
      userId: profile.id,
      avatarUrl,
      message:
        "✓ Roblox account successfully verified!",
    });

    // Secure login cookie
    result.cookies.set({
      name: "rbx_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(expiresAt),
    });

    return result;

  } catch (error) {
    console.error(
      "Verification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while verifying the account.",
      },
      { status: 500 }
    );
  }
}
