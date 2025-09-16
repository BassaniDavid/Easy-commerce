export default function ProductCard({ product }) {
  return (
    <div className="flex flex-row md:flex-col  rounded-lg p-4 border border-neutral-300 md:shadow-sm shadow-neutral-200 h-full">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-[35%] aspect-square object-cover md:w-full  rounded-lg "
      />
      <div>
        <h2 className="text-lg font-semibold mt-3">{product.title}</h2>
        <p className="text-gray-600 line-clamp-3">{product.description}</p>
        <p className="font-bold mt-2">${product.price}</p>
      </div>
    </div>
  );
}
