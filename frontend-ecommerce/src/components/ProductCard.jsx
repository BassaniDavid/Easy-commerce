import { Link } from "react-router-dom";
import { slugify } from "../utils/slugify";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${slugify(product.title)}`}
      className="flex flex-row md:flex-col rounded-lg p-4 border border-neutral-300 md:shadow-sm shadow-neutral-200 h-full hover:shadow-lg transition"
    >
      <div className="w-[35%] aspect-square object-cover md:w-full rounded-lg">
        <img
          src={product.thumbnail}
          alt={product.title}
          className=" aspect-square object-cover md:w-full rounded-lg"
        />
      </div>
      <div className="ml-4 md:ml-0 mt-0 md:mt-3 flex flex-col flex-1">
        <h2 className="text-lg font-semibold">{product.title}</h2>
        <p className="text-gray-600 line-clamp-3 mt-1">{product.description}</p>
        <p className="font-bold mt-2">${product.price}</p>
      </div>
    </Link>
  );
}
