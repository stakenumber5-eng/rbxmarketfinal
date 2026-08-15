```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  {
    title: "ROBUX",
    description: "Buy Robux at the best prices.",
    icon: "💰",
    className: "category-robux",
    href: "/browse?category=robux",
  },
  {
    title: "ADOPT ME",
    description: "Get your favorite pets & items.",
    icon: "🐾",
    className: "category-adopt",
    href: "/browse?category=adopt-me",
  },
  {
    title: "MM2",
    description: "Knives, guns & godlys.",
    icon: "🔪",
    className: "category-mm2",
    href: "/browse?category=mm2",
  },
];

const products = [
  {
    name: "FR Frost Dragon",
    category: "Adopt Me",
    price: "$24.99",
    icon: "🐉",
  },
  {
    name: "Batwing",
    category: "MM2",
    price: "$14.99",
    icon: "🦇",
  },
  {
    name: "1,000 Robux",
    category: "Robux",
    price: "$8.99",
    icon: "🪙",
  },
  {
    name: "Candy Cannon",
    category: "MM2",
    price: "$4.99",
    icon: "🍭",
  },
  {
    name: "NFR Shadow Dragon",
    category: "Adopt Me",
    price: "$29.99",
    icon: "🐲",
  },
  {
    name: "2,200 Robux",
    category: "Robux",
    price: "$17.99",
    icon: "💎",
  },
];

type LoggedInUser = {
  userId: number;
  username: string;
  avatarUrl: string | null;
};

export default function HomePage() {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(
    null
  );
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          setLoggedInUser(null);
          return;
        }

        const data = await response.json();

        if (data?.loggedIn === true && data?.user) {
          setLoggedInUser({
            userId: data.user.userId,
            username: data.user.username,
            avatarUrl: data.user.avatarUrl || null,
          });
        } else {
          setLoggedInUser(null);
        }
      } catch (error) {
        console.error("Could not load saved session:", error);
        setLoggedInUser(null);
      } finally {
        setSessionLoading(false);
      }
    }

    loadSession();
  }, []);

  return (
    <main className="home-page">
      <header className="home-header">
        <Link href="/" className="brand">
          <div className="brand-logo">R</div>
          <div className="brand-text">
            RBX<span>MARKET</span>
          </div>
        </Link>

        <nav className="home-nav">
          <Link href="/" className="active">
            Home
          </Link>
          <Link href="/browse">Browse</Link>
          <Link href="/login">How It Works</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/support">Support</Link>
        </nav>

        <div className="header-actions">
          {sessionLoading ? (
            <span className="login-button">Loading...</span>
          ) : loggedInUser ? (
            <Link href="/login" className="logged-in-user">
              <div className="header-avatar">
                {loggedInUser.avatarUrl ? (
                  <img
                    src={loggedInUser.avatarUrl}
                    alt={`${loggedInUser.username} Roblox avatar`}
                  />
                ) : (
                  <span>
                    {loggedInUser.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <span className="header-username">
                {loggedInUser.username}
              </span>

              <span className="header-arrow">▾</span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="login-button">
                Login
              </Link>

              <Link href="/login" className="verify-button">
                🛡 Verify Roblox
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-glow" />

        <div className="hero-content">
          <div className="trusted-badge">
            <span className="green-dot" />
            Trusted by 10,000+ Roblox players
          </div>

          <h1>
            BUY SAFE.
            <br />
            PLAY <span>MORE.</span>
          </h1>

          <p>
            The safe and fast marketplace to buy
            <br />
            Robux, Adopt Me pets, MM2 items and more.
          </p>

          <div className="hero-buttons">
            <Link href="/browse" className="primary-button">
              Browse All Products <span>→</span>
            </Link>

            <Link href="/login" className="secondary-button">
              <span>▶</span> How It Works
            </Link>
          </div>

          <div className="hero-features">
            <span>⚡ Fast Delivery</span>
            <span>🛡 Secure Trades</span>
            <span>🎧 24/7 Support</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle hero-circle-one" />
          <div className="hero-circle hero-circle-two" />

          <div className="roblox-character">
            <div className="character-head">
              <div className="character-hair" />
              <div className="character-face">
                <span className="eye left-eye" />
                <span className="eye right-eye" />
                <span className="smile" />
              </div>
            </div>

            <div className="character-body">
              <div className="character-logo">R</div>
            </div>

            <div className="character-leg left-leg" />
            <div className="character-leg right-leg" />

            <div className="character-sword">⚔</div>
          </div>

          <div className="security-floating-card">
            <div className="security-icon">🛡</div>
            <div>
              <strong>100% Secure</strong>
              <p>Your account is safe with our verification system.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-label">SHOP BY CATEGORY</div>
        <h2>Explore Our Top Categories</h2>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              href={category.href}
              key={category.title}
              className={`category-card ${category.className}`}
            >
              <div className="category-content">
                <h3>{category.title}</h3>
                <p>{category.description}</p>

                <span className="category-button">
                  Shop {category.title} <b>→</b>
                </span>
              </div>

              <div className="category-icon">{category.icon}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="section-label">FEATURED ITEMS</div>

        <div className="products-heading">
          <h2>Popular Right Now</h2>

          <div className="slider-buttons">
            <button type="button">←</button>
            <button type="button">→</button>
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <Link
              href="/browse"
              className="product-card"
              key={product.name}
            >
              <div className="product-image">
                <span>{product.icon}</span>
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <strong>{product.price}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <div className="benefit">
          <div className="benefit-icon">🛡</div>
          <div>
            <h3>Safe & Secure</h3>
            <p>
              We use advanced verification systems to keep your account
              and purchases safe.
            </p>
          </div>
        </div>

        <div className="benefit">
          <div className="benefit-icon">⚡</div>
          <div>
            <h3>Instant Delivery</h3>
            <p>
              Most items are delivered quickly through our marketplace
              system.
            </p>
          </div>
        </div>

        <div className="benefit">
          <div className="benefit-icon">🎧</div>
          <div>
            <h3>24/7 Support</h3>
            <p>
              Our support team is ready to help whenever you need
              assistance.
            </p>
          </div>
        </div>

        <div className="benefit">
          <div className="benefit-icon">👥</div>
          <div>
            <h3>Trusted By Thousands</h3>
            <p>Join thousands of customers who use RBXMARKET.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat">
          <strong>10,000+</strong>
          <span>Happy Customers</span>
        </div>

        <div className="stat">
          <strong>50,000+</strong>
          <span>Orders Completed</span>
        </div>

        <div className="stat">
          <strong>99.9%</strong>
          <span>Positive Reviews</span>
        </div>

        <div className="stat">
          <strong>24/7</strong>
          <span>Customer Support</span>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <div className="brand-logo">R</div>
            <div className="brand-text">
              RBX<span>MARKET</span>
            </div>
          </Link>

          <p>
            The #1 Roblox marketplace to buy Robux, Adopt Me pets, MM2
            items and more.
          </p>

          <div className="socials">
            <span>◉</span>
            <span>𝕏</span>
            <span>▶</span>
            <span>♪</span>
          </div>
        </div>

        <div className="footer-column">
          <h3>Marketplace</h3>
          <Link href="/browse">Browse All</Link>
          <Link href="/browse?category=robux">Robux</Link>
          <Link href="/browse?category=adopt-me">Adopt Me</Link>
          <Link href="/browse?category=mm2">MM2</Link>
        </div>

        <div className="footer-column">
          <h3>Info</h3>
          <Link href="/login">How It Works</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/refunds">Refund Policy</Link>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <Link href="/support">Contact Us</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/delivery">Delivery Info</Link>
        </div>

        <div className="footer-community">
          <h3>Join Our Community</h3>

          <p>
            Stay updated with the latest news, deals and giveaways.
          </p>

          <div className="email-box">
            <input type="email" placeholder="Enter your email" />
            <button type="button">→</button>
          </div>
        </div>
      </footer>

      <div className="footer-bottom">
        <span>© 2026 RBXMARKET. All rights reserved.</span>

        <span>
          This website is not affiliated with Roblox Corporation.
        </span>
      </div>
    </main>
  );
}
```
