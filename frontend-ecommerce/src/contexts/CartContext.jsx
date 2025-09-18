import { createContext, useContext, useState } from "react";
import { addCart } from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = async (product) => {
    const userId = 1; // demo
    const response = await addCart(userId, [
      { id: product.id, quantity: product.quantity },
    ]);
    if (response) {
      setCart(response.products); // aggiorna lo stato con i prodotti del carrello
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
