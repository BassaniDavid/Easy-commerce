import { useCart } from "../contexts/CartContext";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <main className="min-h-screen dark:bg-neutral-950 dark:text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Your shopping cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-xl font-bold mb-4 text-center text-red-500/50">
          The cart is currently empty
        </p>
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
