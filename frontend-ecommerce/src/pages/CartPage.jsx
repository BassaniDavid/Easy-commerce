import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen dark:bg-neutral-950 dark:text-white p-5 xl:p-10">
      <h1 className="text-2xl font-bold pb-4 xl:pb-10 text-center">
        Your shopping cart
      </h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 lg:mx-[30%] border rounded-2xl border-neutral-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h18l-1.5 12.5a2 2 0 01-2 1.5H8a2 2 0 01-2-1.5L3 3z"
            />
          </svg>
          <p className="text-2xl font-semibold text-center text-red-500 mb-2">
            Your cart is empty
          </p>
          <p className="text-center text-gray-500 mb-4">
            Browse our products and add something to get started!
          </p>
          <button
            className="px-4 py-2 rounded-md transition animate-bounce  bg-lime-400 text-black hover:bg-lime-500 dark:bg-lime-600 dark:text-white dark:hover:bg-lime-400"
            onClick={() => navigate("/")}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {cart.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border p-4 rounded"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{product.title}</h2>
                  <p>${product.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) =>
                    updateQuantity(product.id, Number(e.target.value))
                  }
                  className="w-16 border rounded p-1 text-center"
                />
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Rimuovi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default CartPage;
