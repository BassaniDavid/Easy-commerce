// Fetch prodotti con paginazione
export const fetchProducts = async (limit = 20, skip = 0) => {
  try {
    const res = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    );
    if (!res.ok) throw new Error("Errore nel fetch dei prodotti");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return { products: [], total: 0 };
  }
};

// Fetch prodotti per categoria con paginazione
export const fetchProductsByCategory = async (
  category,
  limit = 20,
  skip = 0
) => {
  try {
    const res = await fetch(
      `https://dummyjson.com/products/category/${encodeURIComponent(
        category
      )}?limit=${limit}&skip=${skip}`
    );
    if (!res.ok)
      throw new Error(
        `Errore nel fetch dei prodotti per categoria ${category}`
      );
    const data = await res.json();
    return data; // { products: [...], total: n }
  } catch (error) {
    console.error("Fetch error:", error);
    return { products: [], total: 0 };
  }
};

// Fetch lista categorie
export const fetchCategories = async () => {
  try {
    const res = await fetch("https://dummyjson.com/products/category-list");
    if (!res.ok) throw new Error("Errore nel fetch delle categorie");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};
