import { Link } from "react-router-dom";
import { slugify } from "../utils/slugify";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ id: product.id, quantity }); // invia solo id + quantità
  };

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div className="flex flex-col rounded-lg p-4 border border-neutral-300 md:shadow-sm shadow-neutral-200 h-full hover:shadow-lg transition">
      {/* Link all’interno della card */}
      <Link
        to={`/products/${slugify(product.title)}`}
        className="flex flex-col w-full"
      >
        <div className="w-full aspect-square md:mb-3 rounded-lg overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="text-gray-600 line-clamp-3 mt-1">
            {product.description}
          </p>
          <p className="font-bold mt-2">${product.price}</p>
        </div>
      </Link>

      {/* Footer separato con pulsanti + quantità e bottone */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>

        <div className="flex items-center border border-neutral-300 rounded">
          <button
            onClick={decrease}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition rounded-l"
          >
            -
          </button>
          <span className="px-4">{quantity}</span>
          <button
            onClick={increase}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition rounded-r"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
