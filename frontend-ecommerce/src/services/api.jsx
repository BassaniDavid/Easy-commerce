export const fetchProducts = async () => {
  try {
    const res = await fetch("https://dummyjson.com/products");
    if (!res.ok) throw new Error("Errore nel fetch dei prodotti");
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};
