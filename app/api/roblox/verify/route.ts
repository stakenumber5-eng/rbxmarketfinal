async function generateCode() {
  const cleanUsername = username.trim();

  if (!cleanUsername) {
    setMessage("Enter your Roblox username first.");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    const response = await fetch("/api/roblox/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: cleanUsername,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not generate verification words.");
    }

    if (!data.words || !Array.isArray(data.words)) {
      throw new Error("Roblox verification words were not returned.");
    }

    setVerificationCode(data.words.join(" "));

    setUser({
      username: data.username,
      userId: data.userId,
      avatarUrl: null,
    });

    setMessage(
      "Your 8 verification words have been generated. Add them to your Roblox About/Bio."
    );
  } catch (error) {
    console.error("Generate verification error:", error);

    setMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}
