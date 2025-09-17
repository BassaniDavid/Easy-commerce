import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchCategories,
} from "../api/api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import CategoryFilter from "../components/CategoryFilter";

export default function Homepage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const productsPerPage = 20;

  const loadProducts = async (
    page = currentPage,
    categoryFilter = category
  ) => {
    const skip = (page - 1) * productsPerPage;
    const data = categoryFilter
      ? await fetchProductsByCategory(categoryFilter, productsPerPage, skip)
      : await fetchProducts(productsPerPage, skip);

    setProducts(data.products);
    setTotalProducts(data.total);
  };

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    if (location.state?.resetCategory) {
      setCategory(""); // reset filtro
    }
  }, [location.state]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadProducts();
  }, [currentPage, category]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen p-5">
      <CategoryFilter
        categories={categories}
        selected={category}
        onChange={handleCategoryChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {products.map((product) => (
          <ProductCard
            key={`${product.id}-${product.title}`}
            product={product}
          />
        ))}
      </div>

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
