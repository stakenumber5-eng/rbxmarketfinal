import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { products } from "../lib/products";

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="logo">
            RBLX<span>STORE</span>
          </Link>

          <nav className="nav">
            <Link href="/?category=Robux">Robux</Link>
            <Link href="/?category=Adopt%20Me">Adopt Me</Link>
            <Link href="/?category=MM2">MM2</Link>
          </nav>

          <div className="header-actions">
            <Link href="/login">Login</Link>
            <Link href="/admin">Developer</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">FAST • SIMPLE • SECURE</div>

            <h1>
              Your Roblox
              <br />
              <span>marketplace.</span>
            </h1>

            <p>
              Shop Robux and gaming products with a clean checkout.
              Delivery is manual for now.
            </p>

            <div className="hero-buttons">
              <Link href="#products" className="primary-button">
                Browse products
              </Link>

              <Link href="/login" className="secondary-button">
                Verify Roblox
              </Link>
            </div>
          </div>
        </section>

        <section id="products" className="products-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">SHOP</div>
              <h2>Featured products</h2>
            </div>

            <div className="category-buttons">
              <button className="active">All</button>
              <button>Robux</button>
              <button>Adopt Me</button>
              <button>MM2</button>
            </div>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                stock={product.stock}
                emoji={product.emoji}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
