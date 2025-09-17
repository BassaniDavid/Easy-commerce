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
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        role="searchbox"
        aria-label="Search products"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="border p-2 rounded flex-1"
      />
      <button
        onClick={handleSearch}
        aria-label="search products"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  );
}
