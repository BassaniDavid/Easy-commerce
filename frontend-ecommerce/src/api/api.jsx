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
