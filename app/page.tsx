import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <>
      <header className="nav wrap">
        <div className="logo">
          RBLX<span>STORE</span>
        </div>

        <nav className="links">
          <a href="#products">Robux</a>
          <a href="#products">Adopt Me</a>
          <a href="#products">MM2</a>
        </nav>

        <div>
          <Link href="/login">Login</Link>{" "}
          <Link href="/admin">Developer</Link>
        </div>
      </header>

      <main>
        <section className="hero wrap">
          <div>
            <small>FAST • SIMPLE • SECURE</small>

            <h1>
              Your Roblox
              <br />
              <span style={{ color: "#ef3340" }}>marketplace.</span>
            </h1>

            <p>
              Shop Robux and gaming products with a clean checkout.
              Delivery is manual for now.
            </p>

            <div className="actions">
              <a className="btn red" href="#products">
                Browse products
              </a>

              <a className="btn" href="/login">
                Verify Roblox
              </a>
            </div>
          </div>

          <div className="hero-art">
            <div className="orb">R</div>
          </div>
        </section>

        <section id="products" className="section wrap">
          <h2>Featured products</h2>

          <div className="tabs">
            <span className="tab active">All</span>
            <span className="tab">Robux</span>
            <span className="tab">Adopt Me</span>
            <span className="tab">MM2</span>
          </div>

          <div className="grid">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
