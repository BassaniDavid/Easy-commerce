import { useState, useEffect } from "react";
import { fetchProducts } from "../api/api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

export default function Homepage() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts(
        productsPerPage,
        (currentPage - 1) * productsPerPage
      );
      setProducts(data.products);
      setTotalProducts(data.total);
    };
    loadProducts();
  }, [currentPage]);

  return (
    <main className="min-h-screen p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      <Pagination
        totalProducts={totalProducts}
        productsPerPage={productsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        maxButtons={5}
      />
    </main>
  );
}
