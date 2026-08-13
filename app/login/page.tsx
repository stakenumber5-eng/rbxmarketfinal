export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07090d",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#0d1117",
          border: "1px solid #202732",
          borderRadius: "16px",
          padding: "30px",
        }}
      >
        <h1>Verify your Roblox account</h1>

        <p style={{ color: "#9fa8b7" }}>
          Enter your Roblox username to start verification.
        </p>

        <input
          placeholder="Roblox username"
          style={{
            width: "100%",
            padding: "13px",
            marginTop: "20px",
            background: "#090c11",
            color: "white",
            border: "1px solid #28303b",
            borderRadius: "9px",
          }}
        />

        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            background: "#090c11",
            border: "1px dashed #394352",
            borderRadius: "10px",
          }}
        >
          <strong>Your verification words</strong>
          <p style={{ color: "#ff5258", fontWeight: "bold" }}>
            Tiger Moon Rocket 4827
          </p>
          <p style={{ color: "#9fa8b7" }}>
            Put these exact words in your Roblox profile About/Bio.
          </p>
        </div>

        <button
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "14px",
            border: "0",
            borderRadius: "10px",
            background: "#ef3340",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Verify Roblox Account
        </button>
      </div>
    </main>
  );
}
