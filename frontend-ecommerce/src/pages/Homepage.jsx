import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 20;

  // Reset del filtro se navigo dal logo o altra pagina
  useEffect(() => {
    if (location.state?.resetCategory) {
      setCategory("");
    }
  }, [location.state]);

  // Query per prodotti
  const { data: productData, isLoading } = useQuery({
    queryKey: ["products", currentPage, category, searchTerm],
    queryFn: async () => {
      const skip = (currentPage - 1) * productsPerPage;
      if (searchTerm) return fetchProductsBySearch(searchTerm);
      if (category)
        return fetchProductsByCategory(category, productsPerPage, skip);
      return fetchProducts(productsPerPage, skip);
    },
    keepPreviousData: true, // mantiene i dati della pagina precedente durante il caricamento
    staleTime: 5 * 60 * 1000, // 5 minuti
  });

  // Query per categorie
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });

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
    <main className="min-h-screen p-5 xl:p-8 xl:px-20 dark:bg-neutral-950 dark:text-white">
      <div className="flex flex-col gap-3 md:flex-row">
        <CategoryFilter
          categories={categories}
          selected={category}
          onChange={handleCategoryChange}
        />
        <SearchBar onSearch={handleSearchChange} />
      </div>

      {isLoading && <div className="text-gray-500 mb-2">Caricamento...</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 xl:gap-6">
        {productData?.products?.map((product) => (
          <ProductCard
            key={`${product.id}-${product.title}`}
            product={product}
          />
        ))}
      </div>

      {productData && (
        <Pagination
          totalProducts={productData.total}
          productsPerPage={productsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          maxButtons={5}
        />
      )}
    </main>
  );
}
