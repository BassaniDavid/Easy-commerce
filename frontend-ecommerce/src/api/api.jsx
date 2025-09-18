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
    return data;
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

// Fetch per singolo prodotto
export async function fetchProductByName(name) {
  const res = await fetch(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(name)}`
  );
  const data = await res.json();
  return data.products[0] || null;
}

// Fetch prodotti per ricerca generica
export const fetchProductsBySearch = async (query) => {
  if (!query) return { products: [], total: 0, skip: 0, limit: 0 };
  try {
    const res = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
    );
    if (!res.ok)
      throw new Error(`Errore nella ricerca prodotti per query "${query}"`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return { products: [], total: 0, skip: 0, limit: 0 };
  }
};

// Crea o aggiorna il carrello (in DummyJSON addCart simula anche update)
export const addCart = async (userId, products) => {
  try {
    const res = await fetch("https://dummyjson.com/carts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, products }),
    });
    if (!res.ok)
      throw new Error("Errore nella creazione/aggiornamento del carrello");
    const data = await res.json();
    return data; // restituisce l'intero carrello simulato
  } catch (err) {
    console.error("API error:", err);
    return null;
  }
};
