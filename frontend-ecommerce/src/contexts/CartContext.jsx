import { createContext, useContext, useState, useEffect } from "react";
import { addCart } from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const userId = 1;

  // funzione per aggiungere e aggiornare il carrello
  const addToCart = async (product) => {
    const updatedProducts = [...cart];
    const existingIndex = updatedProducts.findIndex((p) => p.id === product.id);

    if (existingIndex !== -1) {
      updatedProducts[existingIndex].quantity += product.quantity;
    } else {
      updatedProducts.push({ id: product.id, quantity: product.quantity });
    }

    const response = await addCart(userId, updatedProducts);
    if (response) setCart(response.products);
  };

  // funzione usata solo nella pagina del carrello per aggiornare la quantità
  const updateQuantity = async (productId, quantity) => {
    const updatedProducts = cart.map((p) =>
      p.id === productId ? { ...p, quantity } : p
    );

    const response = await addCart(userId, updatedProducts);
    if (response) setCart(response.products);
  };

  // funzione usata solo nella pagina del carrello per rimuovere totalmente un prodotto
  const removeFromCart = async (productId) => {
    const updatedProducts = cart.filter((p) => p.id !== productId);

    if (updatedProducts.length === 0) {
      setCart([]);
      return;
    }

    const response = await addCart(userId, updatedProducts);
    if (response) setCart(response.products);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// hook personalizzato
export const useCart = () => useContext(CartContext);
