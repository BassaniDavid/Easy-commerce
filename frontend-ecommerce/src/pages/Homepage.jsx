import { useState, useEffect } from "react";

import { fetchProducts } from "../api/api";
import ProductCard from "../components/ProductCard";

const Homepage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);
  return (
    <main className="min-h-screen grid grid-cols-1 p-[5%] gap-2 md:grid-cols-4 md:gap-3 lg:md:grid-cols-5  lg:px-[10%] lg:py-[2%]">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  );
};

export default Homepage;
