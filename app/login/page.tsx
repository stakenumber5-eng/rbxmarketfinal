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
  const [verified, setVerified] = useState(false);
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
    setVerified(false);

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

      if (!Array.isArray(data.words) || data.words.length !== 8) {
        throw new Error(
          "The server did not return exactly 8 verification words."
        );
      }

      setVerificationCode(data.words.join(" "));

      // Account found ≠ verified.
      setUser({
        username: data.username,
        userId: data.userId,
        avatarUrl: null,
      });

      setMessage(
        "8 verification words generated. Add them to your Roblox About/Bio, then click Verify."
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

  async function verifyAccount() {
    if (!user) {
      setMessage("Generate your verification words first.");
      return;
    }

    if (!verificationCode) {
      setMessage("Generate your 8 verification words first.");
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
        throw new Error(
          data.error || "Verification failed."
        );
      }

      // Verification failed.
      if (!data.verified) {
        setVerified(false);

        setMessage(
          "Verification failed. Make sure all 8 words are in your Roblox About/Bio."
        );

        return;
      }

      // ONLY successful verification reaches this point.
      setVerified(true);

      // Roblox avatar.
      const avatarUrl =
        `https://www.roblox.com/headshot-thumbnail/image?userId=${user.userId}&width=150&height=150&format=png`;

      setUser({
        username: data.username || user.username,
        userId: data.userId || user.userId,
        avatarUrl,
      });

      setMessage(
        "✓ Roblox account successfully verified!"
      );
    } catch (error) {
      console.error("Verification error:", error);

      setVerified(false);

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
      {/* HEADER */}
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

      {/* MAIN */}
      <section className="verify-container">
        {/* LEFT SIDE */}
        <div className="verify-content">
          <div className="verify-title">
            <div className="shield-icon">
              ✓
            </div>

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

          {/* STEP 1 */}
          <section className="verify-step">
            <div className="step-title">
              <span className="step-number">
                1
              </span>

              <h2>
                Enter your Roblox username
              </h2>
            </div>

            <input
              className="username-input"
              type="text"
              placeholder="Roblox username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
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

          {/* STEP 2 */}
          <section className="verify-step">
            <div className="step-title">
              <span className="step-number">
                2
              </span>

              <h2>
                Add the words to your Roblox About/Bio
              </h2>
            </div>

            <p className="step-description">
              Copy the 8 words below and paste them
              exactly into your Roblox profile About/Bio.
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
              ⓘ Make sure all 8 words are added to your
              Roblox About/Bio.
            </p>
          </section>

          <div className="divider" />

          {/* STEP 3 */}
          <section className="verify-step">
            <div className="step-title">
              <span className="step-number">
                3
              </span>

              <h2>
                Verify your account
              </h2>
            </div>

            <p className="step-description">
              After adding the words to your Roblox
              About/Bio, click the button below to verify
              ownership.
            </p>

            <button
              className="verify-button"
              onClick={verifyAccount}
              disabled={
                loading ||
                !verificationCode ||
                !user
              }
            >
              {loading
                ? "Checking Roblox..."
                : "✓ Verify Roblox Account"}
            </button>

            {message && (
              <p className="verify-message">
                {message}
              </p>
            )}

            <p className="security-note">
              🔒 We never ask for your password. This is a{" "}
              <span>secure</span> verification process.
            </p>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <aside className="verify-sidebar">
          <h2>
            Verification Status
          </h2>

          {/* STATUS */}
          <div
            className={`status-pill ${
              verified ? "verified" : ""
            }`}
          >
            {verified
              ? "✓ Verified"
              : "Not Verified"}
          </div>

          {/* AVATAR */}
          <div className="avatar-container">
            {verified && user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.username} Roblox avatar`}
              />
            ) : (
              <div className="empty-avatar">
                R
              </div>
            )}
          </div>

          {/* USER INFO */}
          {user ? (
            <>
              <h3>
                {user.username}
              </h3>

              <p>
                {verified
                  ? "Roblox account verified"
                  : "Roblox account found"}
              </p>
            </>
          ) : (
            <>
              <h3>
                No user selected
              </h3>

              <p>
                Enter your Roblox username to get started.
              </p>
            </>
          )}

          {/* SECURITY */}
          <div className="security-card">
            <div className="security-item">
              <span>🛡</span>

              <div>
                <strong>
                  Secure & Private
                </strong>

                <p>
                  We only check your public About/Bio.
                </p>
              </div>
            </div>

            <div className="security-item">
              <span>🔒</span>

              <div>
                <strong>
                  No Password Required
                </strong>

                <p>
                  Your account stays completely safe.
                </p>
              </div>
            </div>

            <div className="security-item">
              <span>✓</span>

              <div>
                <strong>
                  Trusted Verification
                </strong>

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
