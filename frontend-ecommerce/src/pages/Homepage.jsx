import { useState, useEffect } from "react";

import { fetchProducts } from "../api/api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      const skip = (currentPage - 1) * limit;
      const data = await fetchProducts(limit, skip);
      setProducts(data.products);
      setTotalProducts(data.total);
    };
    loadProducts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <main className="min-h-screen grid grid-cols-1 p-[5%] gap-2 md:grid-cols-4 md:gap-3 lg:md:grid-cols-5  lg:px-[10%] lg:py-[2%]">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
};

export default Homepage;
