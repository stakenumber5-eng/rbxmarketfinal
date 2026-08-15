import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Supabase environment variables are missing.");
}

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("rbx_verified_user")?.value;

    if (!userId) {
      return NextResponse.json({
        loggedIn: false,
        user: null,
      });
    }

    const { data: user, error } = await supabase
      .from("verified_users")
      .select(
        "roblox_user_id, username, avatar_url, verified"
      )
      .eq("roblox_user_id", userId)
      .eq("verified", true)
      .maybeSingle();

    if (error) {
      console.error("Supabase session lookup error:", error);

      return NextResponse.json(
        {
          loggedIn: false,
          user: null,
          error: "Could not load saved account.",
        },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({
        loggedIn: false,
        user: null,
      });
    }

    return NextResponse.json({
      loggedIn: true,
      user: {
        userId: user.roblox_user_id,
        username: user.username,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (error) {
    console.error("Auth session error:", error);

    return NextResponse.json(
      {
        loggedIn: false,
        user: null,
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
