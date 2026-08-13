 "use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Category = "All" | "Robux" | "Adopt Me" | "MM2";

const products = [
  {id:1,name:"1,000 Robux",category:"Robux",price:9.99,stock:"Unlimited",emoji:"🪙"},
  {id:2,name:"2,000 Robux",category:"Robux",price:18.49,stock:"Unlimited",emoji:"💰"},
  {id:3,name:"Frost Dragon",category:"Adopt Me",price:4.99,stock:12,emoji:"🐉"},
  {id:4,name:"Crow",category:"Adopt Me",price:7.49,stock:5,emoji:"🐦"},
  {id:5,name:"Mega Neon Pet",category:"Adopt Me",price:9.99,stock:6,emoji:"✨"},
  {id:6,name:"Chroma Knife",category:"MM2",price:6.99,stock:8,emoji:"🔪"},
  {id:7,name:"Godly Bundle",category:"MM2",price:12.99,stock:3,emoji:"💎"},
  {id:8,name:"Rare Knife Pack",category:"MM2",price:3.99,stock:18,emoji:"🗡️"}
] as const;

export default function Home(){
  const [category,setCategory]=useState<Category>("All");
  const filtered=useMemo(()=>category==="All"?products:products.filter(p=>p.category===category),[category]);
  return <>
    <header className="nav container">
      <Link href="/" className="logo">RBLX<span>STORE</span></Link>
      <nav className="navlinks"><a href="#products">Robux</a><a href="#products">Adopt Me</a><a href="#products">MM2</a><a href="#how">How it works</a></nav>
      <Link href="/login" className="pill">Login with Roblox</Link>
    </header>
    <main>
      <section className="hero container">
        <div>
          <div className="eyebrow">Fast • Simple • Secure</div>
          <h1>Your Roblox <span>marketplace.</span></h1>
          <p>Browse Robux, Adopt Me and MM2 products in one clean storefront. Orders use manual fulfillment for now, so you stay in control.</p>
          <div className="actions"><a href="#products" className="btn primary">Browse products</a><a href="#how" className="btn">How it works</a></div>
        </div>
        <div className="heroCard"><div className="heroOrb">R</div></div>
      </section>

      <section id="products" className="section container">
        <div className="sectionHead"><h2>Featured products</h2><div className="muted">Choose a category to filter the store.</div></div>
        <div className="tabs">
          {(["All","Robux","Adopt Me","MM2"] as Category[]).map(item=><button key={item} className={`tab ${category===item?"active":""}`} onClick={()=>setCategory(item)}>{item}</button>)}
        </div>
        <div className="grid">
          {filtered.map(p=><article className="card" key={p.id}><div className="thumb">{p.emoji}</div><div className="body"><div className="tag">{p.category}</div><h3>{p.name}</h3><div className="stock">Stock: {p.stock}</div><div className="row"><div className="price">${p.price.toFixed(2)}</div><button className="buy">Buy</button></div></div></article>)}
        </div>
        <div className="infoGrid">
          <div className="infoBox"><b>⚡ Manual fulfillment</b><span className="muted">You review and deliver paid orders yourself for now.</span></div>
          <div className="infoBox"><b>🔒 Secure payments</b><span className="muted">Stripe can be connected once checkout is ready.</span></div>
          <div className="infoBox"><b>👤 Roblox verification</b><span className="muted">Customers can verify ownership without sharing a password.</span></div>
        </div>
      </section>

      <section id="how" className="section container">
        <div className="sectionHead"><h2>How it works</h2><div className="muted">Simple checkout, clear delivery status.</div></div>
        <div className="infoGrid">
          <div className="infoBox"><b>1. Verify</b><span className="muted">Log in with your Roblox username and complete verification.</span></div>
          <div className="infoBox"><b>2. Order</b><span className="muted">Choose a product and continue to checkout.</span></div>
          <div className="infoBox"><b>3. Delivery</b><span className="muted">Your paid order appears in your manual delivery queue.</span></div>
        </div>
      </section>
    </main>
    <footer className="footer"><div className="container">© 2026 RBLX Store</div></footer>
  </>;
}
