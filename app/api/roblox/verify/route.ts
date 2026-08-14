"use client";

import { useState } from "react";

type RobloxUser = {
  username: string;
  userId: number;
  avatarUrl: string | null;
};

export default function VerifyPage() {
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [user, setUser] = useState<RobloxUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
        throw new Error(
          data.error || "Could not generate verification words."
        );
      }

      if (!Array.isArray(data.words)) {
        throw new Error("Verification words were not returned.");
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
    if (!user || !verificationCode) {
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
          userId: user.userId,
          words: verificationCode.split(/\s+/),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      if (!data.verified) {
        setMessage(
          "Verification failed. Make sure all 8 words are in your Roblox About/Bio."
        );
        return;
      }

      let avatarUrl: string | null = null;

      try {
        const avatarResponse = await fetch(
          `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.userId}&size=150x150&format=Png&isCircular=false`
        );

        if (avatarResponse.ok) {
          const avatarData = await avatarResponse.json();
          avatarUrl = avatarData.data?.[0]?.imageUrl || null;
        }
      } catch (error) {
        console.error("Avatar loading error:", error);
      }

      setUser({
        username: data.username || user.username,
        userId: data.userId || user.userId,
        avatarUrl,
      });

      setMessage("✓ Roblox account successfully verified!");
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

  function copyCode() {
    if (!verificationCode) return;

    navigator.clipboard.writeText(verificationCode);
    setMessage("Verification words copied!");
  }

  return (
    <main className="verify-page">
      <header className="verify-header">
        <div className="verify-logo">
          <span className="logo-mark">R</span>

          <div>
            <strong>
              RBX<span>MARKET</span>
            </strong>
            <small>FINAL</small>
          </div>
        </div>

        <nav className="verify-nav">
          <a href="/">⌂ Home</a>
          <a href="/">▢ Browse</a>
          <a href="/login">♢ Safe & Trusted</a>
          <a href="/">▱ Discord</a>
        </nav>

        <a className="admin-button" href="/admin">
          Admin Panel
        </a>
      </header>

      <section className="verify-container">
        <div className="verify-content">
          <div className="verify-title">
            <div className="shield-icon">✓</div>

            <div>
              <h1>
                Verify your <span>Roblox</span> account
              </h1>

              <p>
                Follow the steps below to verify your Roblox
                account and unlock full access.
              </p>
            </div>
          </div>

          <div className="divider" />

          <section className="verify-step">
            <div className="step-title">
              <span className="step-number">1</span>
              <h2>Enter your Roblox username</h2>
            </div>

            <input
              className="username-input"
              type="text"
              placeholder="Roblox username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

            <button
              className="red-button"
              onClick={generateCode}
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : "◈ Generate 8 verification words"}
            </button>
          </section>

          <div className="divider" />

          <section className="verify-step">
            <div className="step-title">
              <span className="step-number">2</span>
              <h2>Add the words to your Roblox About/Bio</h2>
            </div>

            <p className="step-description">
              Copy the 8 words below and paste them exactly
              in your Roblox profile About/Bio.
            </p>

            <div className="code-box">
              <strong>
                {verificationCode ||
                  "Generate your verification words"}
              </strong>

              {verificationCode && (
                <button
                  type="button"
                  onClick={copyCode}
                  className="copy-button"
                >
                  ▣
                </button>
              )}
            </div>

            <p className="info-text">
              ⓘ Make sure the words are added exactly as shown.
            </p>
          </section>

          <div className="divider" />

          <section className="verify-step">
            <div className="step-title">
              <span className="step-number">3</span>
              <h2>Verify your account</h2>
            </div>

            <p className="step-description">
              After adding the words to your Roblox About/Bio,
              click the button below to verify.
            </p>

            <button
              className="verify-button"
              onClick={verifyAccount}
              disabled={loading || !verificationCode || !user}
            >
              {loading
                ? "Checking Roblox..."
                : "✓ Verify Roblox Account"}
            </button>

            {message && (
              <p className="verify-message">{message}</p>
            )}

            <p className="security-note">
              🔒 We never ask for your password. This is a{" "}
              <span>secure</span> verification process.
            </p>
          </section>
        </div>

        <aside className="verify-sidebar">
          <h2>Verification Status</h2>

          <div
            className={`status-pill ${
              user?.avatarUrl ? "verified" : ""
            }`}
          >
            {user?.avatarUrl ? "✓ Verified" : "Not Verified"}
          </div>

          <div className="avatar-container">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.username} Roblox avatar`}
              />
            ) : (
              <div className="empty-avatar">R</div>
            )}
          </div>

          {user ? (
            <>
              <h3>{user.username}</h3>
              <p>
                {user.avatarUrl
                  ? "Roblox account verified"
                  : "Roblox account found"}
              </p>
            </>
          ) : (
            <>
              <h3>No user selected</h3>
              <p>
                Enter your Roblox username to get started.
              </p>
            </>
          )}

          <div className="security-card">
            <div className="security-item">
              <span>🛡</span>
              <div>
                <strong>Secure & Private</strong>
                <p>We only check your public About/Bio.</p>
              </div>
            </div>

            <div className="security-item">
              <span>🔒</span>
              <div>
                <strong>No Password Required</strong>
                <p>Your account stays completely safe.</p>
              </div>
            </div>

            <div className="security-item">
              <span>✓</span>
              <div>
                <strong>Trusted Verification</strong>
                <p>
                  Verify ownership without sharing
                  credentials.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
