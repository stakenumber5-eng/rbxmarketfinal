"use client";

import { useState } from "react";

type RobloxUser = {
  username: string;
  userId: number;
  avatarUrl: string | null;
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [user, setUser] = useState<RobloxUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function generateCode() {
    setLoading(true);
    setMessage("");
    setUser(null);

    try {
      const response = await fetch("/api/roblox/start", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not generate code.");
      }

      setVerificationCode(data.verificationCode);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyAccount() {
    if (!username.trim()) {
      setMessage("Enter your Roblox username first.");
      return;
    }

    if (!verificationCode) {
      setMessage("Generate your verification words first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/roblox/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      setUser({
        username: data.username,
        userId: data.userId,
        avatarUrl: data.avatarUrl,
      });

      setMessage(data.message);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Verify your Roblox account</h1>

        <p className="subtitle">
          Enter your Roblox username to start verification.
        </p>

        <input
          type="text"
          placeholder="Roblox username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          className="generate-button"
          onClick={generateCode}
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate 8 verification words"}
        </button>

        {verificationCode && (
          <div className="verification-box">
            <h2>Your verification words</h2>

            <strong>{verificationCode}</strong>

            <p>
              Put these exact 8 words in your Roblox profile
              About/Bio, then click Verify.
            </p>
          </div>
        )}

        {verificationCode && (
          <button
            className="verify-button"
            onClick={verifyAccount}
            disabled={loading}
          >
            {loading ? "Checking..." : "Verify Roblox Account"}
          </button>
        )}

        {message && <p className="message">{message}</p>}

        {user && (
          <div className="roblox-user">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={`${user.username} Roblox avatar`}
              />
            )}

            <div>
              <span>Verified Roblox account</span>
              <h2>{user.username}</h2>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
