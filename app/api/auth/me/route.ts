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

export async function GET(request: NextRequest) {
  try {
    const sessionToken =
      request.cookies.get("rbx_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({
        loggedIn: false,
      });
    }

    const sessionTokenHash =
      hashToken(sessionToken);

    const { data: session, error } =
      await supabase
        .from("auth_sessions")
        .select(
          `
          roblox_user_id,
          expires_at,
          verified_users (
            roblox_user_id,
            username,
            avatar_url,
            verified,
            verified_at
          )
        `
        )
        .eq(
          "session_token_hash",
          sessionTokenHash
        )
        .maybeSingle();

    if (error || !session) {
      return NextResponse.json({
        loggedIn: false,
      });
    }

    if (
      new Date(session.expires_at) <
      new Date()
    ) {
      return NextResponse.json({
        loggedIn: false,
      });
    }

    const user = Array.isArray(
      session.verified_users
    )
      ? session.verified_users[0]
      : session.verified_users;

    if (!user || !user.verified) {
      return NextResponse.json({
        loggedIn: false,
      });
    }

    return NextResponse.json({
      loggedIn: true,
      user: {
        userId: user.roblox_user_id,
        username: user.username,
        avatarUrl: user.avatar_url,
        verified: user.verified,
        verifiedAt: user.verified_at,
      },
    });

  } catch (error) {
    console.error(
      "Session check error:",
      error
    );

    return NextResponse.json(
      {
        loggedIn: false,
      },
      { status: 500 }
    );
  }
}
