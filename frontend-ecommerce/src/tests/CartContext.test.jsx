import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../contexts/CartContext";
import * as api from "../api/api";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CartContext - addToCart", () => {
  it("aggiunge un prodotto e aggiorna lo stato cart", async () => {
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

    // Mock di addCart per restituire la risposta simulata
    vi.spyOn(api, "addCart").mockResolvedValue(mockCartResponse);

    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const newProduct = { id: 144, quantity: 1, title: "Cricket Helmet" };

    // Aggiungi il prodotto
    await act(async () => {
      await result.current.addToCart(newProduct);
    });

    // Controlla che lo stato del carrello sia aggiornato correttamente
    expect(result.current.cart).toEqual(mockCartResponse.products);

    // Controlla che addCart sia stata chiamata correttamente
    expect(api.addCart).toHaveBeenCalledWith(1, [{ id: 144, quantity: 1 }]);
  });
});
