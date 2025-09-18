import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../contexts/CartContext";

// Mock globale di fetch
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CartContext", () => {
  it("aggiunge un prodotto e simula chiamata a DummyJSON con output corretto", async () => {
    const mockCartResponse = {
      id: 51,
      products: [
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
      ],
      total: 44.99,
      discountedTotal: 40,
      userId: 1,
      totalProducts: 1,
      totalQuantity: 1,
    };

    // Mock fetch per restituire solo Cricket Helmet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCartResponse,
    });

    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const newProduct = { id: 144, title: "Cricket Helmet", quantity: 1 };
    await act(async () => {
      await result.current.addToCart(newProduct);
    });

    // Controllo stato cart
    expect(result.current.cart).toEqual(mockCartResponse.products);

    // Controllo chiamata fetch
    expect(fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/carts/add",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          products: [{ id: 144, quantity: 1 }],
        }),
      })
    );
  });
});
