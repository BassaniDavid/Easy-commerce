import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchCategories,
  fetchProductsBySearch,
} from "../api/api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";

export default function Homepage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const productsPerPage = 20;

  const loadProducts = async (
    page = currentPage,
    categoryFilter = category,
    search = searchTerm
  ) => {
    setLoading(true);
    try {
      const skip = (page - 1) * productsPerPage;
      let data;
      if (search) {
        data = await fetchProductsBySearch(search);
      } else if (categoryFilter) {
        data = await fetchProductsByCategory(
          categoryFilter,
          productsPerPage,
          skip
        );
      } else {
        data = await fetchProducts(productsPerPage, skip);
      }

      setProducts(data.products);
      setTotalProducts(data.total);
    } catch (err) {
      console.error("Errore caricamento prodotti:", err);
    } finally {
      setLoading(false);
    }
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

  // Ricarica prodotti quando cambia pagina, categoria o ricerca
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadProducts();
  }, [currentPage, category, searchTerm]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setCategory("");
  };

  return (
    <main className="min-h-screen p-5">
      {/* Search Bar */}
      <SearchBar onSearch={handleSearchChange} />

      <CategoryFilter
        categories={categories}
        selected={category}
        onChange={handleCategoryChange}
      />

      {loading && <div className="text-gray-500 mb-2">Caricamento...</div>}

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
