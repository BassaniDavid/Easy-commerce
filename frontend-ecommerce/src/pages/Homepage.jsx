import { useState, useEffect } from "react";

import { fetchProducts } from "../services/api";
import ProductCard from "../components/ProductCard";

const Homepage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);
  return (
    <main>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  );
};

export default Homepage;
