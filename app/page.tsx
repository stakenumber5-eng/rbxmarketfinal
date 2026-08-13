import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07090d",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "60px 8%",
      }}
    >
      <h1 style={{ fontSize: "56px" }}>
        RBLX<span style={{ color: "#ef3340" }}>STORE</span>
      </h1>

      <p style={{ color: "#9fa8b7", fontSize: "18px" }}>
        Your Roblox marketplace.
      </p>

      <Link
        href="/login"
        style={{
          display: "inline-block",
          marginTop: "25px",
          padding: "14px 20px",
          borderRadius: "10px",
          background: "#ef3340",
          color: "white",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        Login with Roblox
      </Link>
    </main>
  );
}
