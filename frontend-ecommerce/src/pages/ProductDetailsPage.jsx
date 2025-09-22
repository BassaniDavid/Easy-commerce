import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductByName } from "../api/api";
import { useCart } from "../contexts/CartContext";
import deslugify from "../utils/deslugify";

function ProductDetailsPage() {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id: productData.id, quantity });
  };

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => Math.max(1, q - 1));

  // al caricamento, uso lo slug per ottenere i dati del prodotto
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

  // loader e risposta per l'utente in caso di errore
  if (loading)
    return (
      <main className="min-h-[80vh] text-center pt-10 dark:bg-neutral-950 dark:text-white">
        <div className="flex-col gap-4 w-full min-h-[80vh] flex items-center justify-center">
          <div className="w-40 h-40 border-7 border-transparent text-sky-400 text-4xl animate-spin flex items-center justify-center border-t-sky-400 rounded-full">
            <div className="w-34 h-34 border-6 border-transparent text-lime-400 text-2xl animate-spin flex items-center justify-center border-t-lime-400 rounded-full"></div>
          </div>
        </div>
      </main>
    );

  if (!productData)
    return (
      <main className="min-h-[80vh] text-center mt-10 text-red-500">
        Something went wrong, retry later!
      </main>
    );

  // funzione per calcolare le stelle in base alla valutazione
  function renderStars(rating) {
    const fullStars = Math.ceil(rating);
    const emptyStars = 5 - fullStars;

    return (
      <div>
        {"\u2605".repeat(fullStars)}
        {"\u2606".repeat(emptyStars)}
      </div>
    );
  }

  return (
    <main className="min-h-[80vh] p-5 md:px-[10vw] md:py-15 dark:bg-neutral-950 dark:text-white">
      <div className="flex flex-col gap-6 md:flex-row mb-10">
        {/* Immagine prodotto */}
        <div className="flex-shrink-0 md:w-1/4">
          <img
            src={productData.images[0] || productData.thumbnail}
            alt={productData.title}
            className="w-full h-auto rounded shadow-md"
          />
        </div>

        {/* card prodotto */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="lg:flex items-center justify-between">
            <h1 className="text-3xl font-bold">{productData.title}</h1>
            <p className="text-yellow-500 text-3xl">
              {renderStars(productData.rating)}
            </p>
          </div>
          <h2 className="text-xl font-bold">{productData.brand}</h2>
          <p className="text-gray-700 dark:text-gray-400">
            {productData.description}
          </p>
          <p className="text-xl font-semibold">Prezzo: ${productData.price}</p>

          <div className="flex items-center gap-5 justify-between">
            {/* Selettore quantità */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={decrease}
                className="px-3 py-1 transition rounded bg-gray-200 hover:bg-gray-400 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-500"
              >
                -
              </button>
              <span className="px-4 text-lg font-semibold">{quantity}</span>
              <button
                onClick={increase}
                className="px-3 py-1 transition rounded bg-gray-200 hover:bg-gray-400 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-500"
              >
                +
              </button>
            </div>

            {/* Bottone aggiungi al carrello */}
            <button
              className="mt-4 w-50 lg:w-70 rounded-lg transition p-3 bg-lime-500 text-white hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-500"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {/* dettagli prodotto */}
      <div className="p-3 lg:p-6 mb-5 border rounded-2xl border-neutral-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800">
        <h2 className="text-xl font-semibold mb-4">product details</h2>
        <p className="text-gray-700 dark:text-gray-400">
          dimensions: {productData.dimensions.width} x{" "}
          {productData.dimensions.height} x {productData.dimensions.depth}
        </p>
        <p className="text-gray-700 dark:text-gray-400">
          weight: {productData.weight} pound
        </p>
        <p className="text-gray-700 dark:text-gray-400">
          warranty years: {productData.warrantyInformation.split("y")[0]}
        </p>
        <p className="text-gray-700 dark:text-gray-400">
          return policy: {productData.returnPolicy.split("d")[0]}
        </p>
      </div>

      {/* recensioni */}
      <div>
        <h2 className="text-xl font-semibold mb-5">reviews</h2>
        <div className="text-gray-700 dark:text-gray-200">
          <div>
            {productData.reviews.map((review) => (
              <div
                key={review.reviewerName}
                className="p-3 lg:p-6 mb-5 border rounded-2xl border-neutral-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <div className="flex justify-between mb-4">
                  <h3>{review.reviewerName}</h3>
                  <p className="text-yellow-500">
                    {renderStars(productData.rating)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>{review.comment}</p>
                  <p>{review.date.split("T")[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsPage;
