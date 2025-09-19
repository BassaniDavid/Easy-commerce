import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductByName } from "../api/api";

// Funzione helper per “deslugificare” lo slug in query string
function deslugify(slug) {
  return slug.replace(/-/g, " "); // converte "macbook-pro" → "macbook pro"
}

function ProductDetailsPage() {
  const { slug } = useParams(); // esempio: "macbook-pro"
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const nameQuery = deslugify(slug);
        const data = await fetchProductByName(nameQuery);
        setProductData(data);
      } catch (error) {
        console.error("Errore nel fetch:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading)
    return (
      <main className="min-h-[80vh] text-center mt-10 text-gray-500">
        Caricamento in corso...
      </main>
    );

  if (!productData)
    return (
      <main className="min-h-[80vh] text-center mt-10 text-red-500">
        Prodotto non trovato
      </main>
    );

  return (
    <main className=" flex flex-col gap-6 min-h-[80vh] p-5 md:flex-row md:px-[10vw] dark:bg-neutral-950 dark:text-white">
      {/* Immagine prodotto */}
      <div className="flex-shrink-0 md:w-1/4">
        <img
          src={productData.images}
          alt={productData.title}
          className="w-full h-auto rounded shadow-md"
        />
      </div>

      {/* Dettagli prodotto */}
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{productData.title}</h1>
        <p className="text-gray-700 dark:text-gray-400">
          {productData.description}
        </p>
        <p className="text-xl font-semibold">Prezzo: ${productData.price}</p>
        <p className="text-yellow-500">Rating: {productData.rating}</p>
        <button
          className="mt-4 transition p-3 bg-lime-500 text-white hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-500"
          onClick={() => console.log("Add to cart:", productData)}
        >
          Add to cart
        </button>
      </div>
    </main>
  );
}

export default ProductDetailsPage;
