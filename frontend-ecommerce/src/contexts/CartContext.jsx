import { createContext, useContext, useState, useEffect } from "react";
import { addCart } from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const userId = 1;

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

  const updateQuantity = async (productId, quantity) => {
    const updatedProducts = cart.map((p) =>
      p.id === productId ? { ...p, quantity } : p
    );

    const response = await addCart(userId, updatedProducts);
    if (response) setCart(response.products);
  };

  const removeFromCart = async (productId) => {
    const updatedProducts = cart.filter((p) => p.id !== productId);

    if (updatedProducts.length === 0) {
      // Se non ci sono più prodotti, resetta lo stato cart
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

export const useCart = () => useContext(CartContext);
