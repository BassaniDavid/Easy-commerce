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
    <div className="flex flex-col rounded-lg p-4 border h-full hover:shadow-lg hover:scale-101 transition bg-neutral-100/50 border-neutral-300 md:shadow-md shadow-neutral-400 dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-neutral-900">
      {/* Link all’interno della card */}
      <Link
        to={`/products/${slugify(product.title)}`}
        className="flex flex-col w-full mb-5"
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
          <p className=" line-clamp-3 mt-1 text-neutral-700 dark:text-neutral-300">
            {product.description}
          </p>
          <p className="font-bold mt-2">${product.price}</p>
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between">
        <button
          onClick={handleAddToCart}
          className="px-3 py-1 rounded transition bg-lime-500 text-white hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-500"
        >
          Add to Cart
        </button>

        <div className="flex items-center border border-neutral-300 rounded">
          <button
            onClick={decrease}
            className="px-3 py-1 transition rounded bg-sky-200 hover:bg-sky-400 dark:bg-sky-800 dark:text-white dark:hover:bg-sky-500"
          >
            -
          </button>
          <span className="px-4">{quantity}</span>
          <button
            onClick={increase}
            className="px-3 py-1 transition rounded bg-sky-200 hover:bg-sky-400 dark:bg-sky-800 dark:text-white dark:hover:bg-sky-500"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
