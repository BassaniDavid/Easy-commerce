import { useState, useEffect } from "react";

export default function SearchBar({
  onSearch,
  placeholder = "Cerca prodotti...",
  resetTrigger,
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Svuota l'input quando resetTrigger cambia
    setInputValue("");
  }, [resetTrigger]);

  const handleSearch = () => {
    onSearch(inputValue.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex mb-4 border rounded border-lime-400 dark:border-lime-600 dark:bg-neutral-900 dark:text-white grow">
      <input
        type="text"
        role="searchbox"
        aria-label="Search products"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className=" p-2 rounded flex-1"
      />
      <button
        onClick={handleSearch}
        aria-label="search products"
        className=" px-4 py-2 rounded bg-lime-400 text-black hover:bg-lime-500 dark:bg-lime-600 dark:text-white dark:hover:bg-lime-400"
      >
        Search
      </button>
    </div>
  );
}
