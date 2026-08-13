import Link from "next/link";

export default function AdminPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07090d",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "40px 6%",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#ff4d55",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        ← Back to store
      </Link>

      <h1 style={{ marginTop: 30 }}>Developer Dashboard</h1>

      <p style={{ color: "#9fa8b7" }}>
        Manage products and manual delivery orders.
      </p>

      <section
        style={{
          marginTop: 30,
          padding: 25,
          background: "#0d1117",
          border: "1px solid #202732",
          borderRadius: 16,
        }}
      >
        <h2>Add Product</h2>

        <div
          style={{
            display: "grid",
            gap: 14,
            marginTop: 20,
            maxWidth: 600,
          }}
        >
          <input placeholder="Product name" />
          <select defaultValue="Adopt Me">
            <option>Adopt Me</option>
            <option>MM2</option>
            <option>Robux</option>
          </select>

          <input
            type="number"
            placeholder="Price (USD)"
            step="0.01"
          />

          <input placeholder="Stock" />

          <input type="file" accept="image/*" />

          <button
            style={{
              padding: 14,
              border: 0,
              borderRadius: 10,
              background: "#ef3340",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Add Product
          </button>
        </div>
      </section>

      <section
        style={{
          marginTop: 25,
          padding: 25,
          background: "#0d1117",
          border: "1px solid #202732",
          borderRadius: 16,
        }}
      >
        <h2>Manual Delivery Queue</h2>

        <p style={{ color: "#9fa8b7" }}>
          Paid orders will appear here once the database and
          Stripe checkout are connected.
        </p>
      </section>
    </main>
  );
}
