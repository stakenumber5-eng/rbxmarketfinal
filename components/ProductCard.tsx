import type { ReactNode } from "react";

type ProductCardProps = {
  name: string;
  category: string;
  price: number;
  stock: number | string;
  emoji: ReactNode;
};

export default function ProductCard({
  name,
  category,
  price,
  stock,
  emoji,
}: ProductCardProps) {
  return (
    <div className="card">
      <div className="thumb">
        {emoji}
      </div>

      <div className="body">
        <small>{category}</small>

        <h3>{name}</h3>

        <p>Stock: {stock}</p>

        <strong>${price.toFixed(2)}</strong>

        <button type="button">
          Buy / Claim
        </button>
      </div>
    </div>
  );
}
