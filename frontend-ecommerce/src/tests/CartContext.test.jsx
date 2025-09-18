import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../contexts/CartContext";
import * as api from "../api/api";

beforeEach(() => {
  vi.clearAllMocks();
});

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

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe("CartContext - add/update/remove", () => {
  it("aggiunge un prodotto e aggiorna lo stato cart", async () => {
    const mockCartResponse = {
      id: 51,
      products: [...initialCart],
      total: 44.99,
      discountedTotal: 40,
      userId: 1,
      totalProducts: 1,
      totalQuantity: 1,
    };

    vi.spyOn(api, "addCart").mockResolvedValue(mockCartResponse);

    const { result } = renderHook(() => useCart(), { wrapper });

    const newProduct = { id: 144, quantity: 1, title: "Cricket Helmet" };

    await act(async () => {
      await result.current.addToCart(newProduct);
    });

    expect(result.current.cart).toEqual(mockCartResponse.products);
    expect(api.addCart).toHaveBeenCalledWith(1, [{ id: 144, quantity: 1 }]);
  });

  it("aggiorna quantità di un prodotto nel carrello", async () => {
    const updatedCartResponse = {
      id: 51,
      products: [
        { ...initialCart[0], quantity: 3, total: 134.97, discountedPrice: 120 },
      ],
      total: 134.97,
      discountedTotal: 120,
      userId: 1,
      totalProducts: 1,
      totalQuantity: 3,
    };

    vi.spyOn(api, "updateCart").mockResolvedValue(updatedCartResponse);

    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.setCart(initialCart));

    await act(async () => {
      await result.current.updateQuantity(144, 3);
    });

    expect(result.current.cart).toEqual(updatedCartResponse.products);
    expect(api.updateCart).toHaveBeenCalledWith(1, [{ id: 144, quantity: 3 }]);
  });

  it("rimuove un prodotto dal carrello", async () => {
    const updatedCartResponse = {
      id: 51,
      products: [],
      total: 0,
      discountedTotal: 0,
      userId: 1,
      totalProducts: 0,
      totalQuantity: 0,
    };

    vi.spyOn(api, "updateCart").mockResolvedValue(updatedCartResponse);

    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.setCart(initialCart));

    await act(async () => {
      await result.current.removeFromCart(144);
    });

    expect(result.current.cart).toEqual([]);
    expect(api.updateCart).toHaveBeenCalledWith(1, []);
  });
});
