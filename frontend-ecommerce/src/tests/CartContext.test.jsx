import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../contexts/CartContext";
import * as api from "../api/api";

beforeEach(() => {
  vi.clearAllMocks();
});

// Stato iniziale per i test
const initialCart = [
  {
    id: 144,
    title: "Cricket Helmet",
    price: 44.99,
    quantity: 1,
    total: 44.99,
    discountPercentage: 10.75,
    discountedPrice: 40,
    thumbnail:
      "https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Helmet/thumbnail.png",
  },
];

describe("CartContext - add/remove e gestione quantità", () => {
  it("aggiunge un prodotto al carrello e aggiorna lo stato", async () => {
    // Mock della risposta API: restituisce sempre i prodotti inviati
    const mockResponse = {
      id: 1,
      products: [
        {
          id: 144,
          title: "Cricket Helmet",
          price: 44.99,
          quantity: 1,
          total: 44.99,
          discountPercentage: 9.64,
          discountedPrice: 41,
          thumbnail:
            "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-helmet/thumbnail.webp",
        },
      ],
    };
    vi.spyOn(api, "addCart").mockResolvedValueOnce(mockResponse);

    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const newProduct = { id: 144, quantity: 1, title: "Cricket Helmet" };

    // Aggiunta del prodotto
    await act(async () => {
      await result.current.addToCart(newProduct);
    });

    // Controllo stato cart aggiornato correttamente
    expect(result.current.cart).toEqual(mockResponse.products);
    expect(api.addCart).toHaveBeenCalledWith(1, [{ id: 144, quantity: 1 }]);
  });

  it("aggiorna la quantità di un prodotto esistente nel carrello", async () => {
    // Mock coerente per tutte le chiamate: restituisce sempre i prodotti inviati
    vi.spyOn(api, "addCart").mockImplementation(async (userId, products) => {
      return {
        id: 51,
        products: products.map((p) => ({
          ...p,
          total: p.price * p.quantity,
          discountedPrice: p.price * p.quantity * 0.9,
          discountPercentage: 10,
          thumbnail:
            "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-helmet/thumbnail.webp",
          title: "Cricket Helmet",
          price: 44.99,
        })),
      };
    });

    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    // Aggiunta iniziale prodotto (quantity = 1)
    await act(async () => {
      await result.current.addToCart(initialCart[0]);
    });

    // Aggiunta ulteriore dello stesso prodotto (quantity = 2)
    await act(async () => {
      await result.current.addToCart({ ...initialCart[0], quantity: 2 });
    });

    // Controlla che la quantità totale sia aggiornata
    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 144,
          quantity: 3, // 1 + 2
          title: "Cricket Helmet",
          price: 44.99,
        }),
      ])
    );
  });

  it("rimuove un prodotto dal carrello", async () => {
    // Mock coerente: restituisce sempre i prodotti inviati
    vi.spyOn(api, "addCart").mockImplementation(async (userId, products) => {
      return {
        id: 1,
        products: products.map((p) => ({
          ...p,
          total: p.price * p.quantity,
          discountedPrice: p.price * p.quantity * 0.9,
          discountPercentage: 10,
          thumbnail:
            "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-helmet/thumbnail.webp",
          title: "Cricket Helmet",
          price: 44.99,
        })),
      };
    });

    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    // Aggiungi inizialmente il prodotto
    await act(async () => {
      await result.current.addToCart(initialCart[0]);
    });

    // Rimuovi il prodotto
    await act(async () => {
      await result.current.removeFromCart(144);
    });

    // Controlla che il carrello sia vuoto
    expect(result.current.cart).toEqual([]);
  });
});
