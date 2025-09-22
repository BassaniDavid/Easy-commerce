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
import ProductCardLoader from "../components/ProductCardLoader";

export default function Homepage() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 20;

  // Reset del filtro se navigo dal logo o altra pagina
  useEffect(() => {
    if (location.state?.resetFilter) {
      setCategory("");
      setSearchTerm("");
      setCurrentPage(1);
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
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000, // 10 minuti
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
        {/* filtro categoria */}
        <CategoryFilter
          categories={categories}
          selected={category}
          onChange={handleCategoryChange}
        />

        {/* filtro ricerca */}
        <SearchBar onSearch={handleSearchChange} resetTrigger={category} />
      </div>

      {/* loader card prodotti */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 xl:gap-6">
          {" "}
          {Array.from({ length: productsPerPage }).map((_, index) => (
            <ProductCardLoader key={index} />
          ))}
        </div>
      )}

      {/* parte centrale con le card dei prodotti */}
      {productData && productData.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 xl:gap-6">
          {productData.products.map((product) => (
            <ProductCard
              key={`${product.id}-${product.title}`}
              product={product}
            />
          ))}
        </div>
      ) : (
        <p className="text-center font-semibold">
          Ops, unfortunately, it appears that we do not have the product you are
          looking for
        </p>
      )}

      {/* paginazione */}
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
