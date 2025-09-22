import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "../contexts/CartContext";
import Homepage from "../pages/Homepage";
import * as api from "../api/api";

// Mock delle API usate in Homepage
vi.mock("../api/api", async () => {
  const actual = await vi.importActual("../api/api");
  return {
    ...actual,
    fetchProductsBySearch: vi.fn(),
    fetchCategories: vi.fn(),
  };
});

describe("Homepage - Ricerca prodotti", () => {
  it("filtra i risultati in base al titolo o alla descrizione", async () => {
    // Mock dinamico della ricerca prodotti
    api.fetchProductsBySearch.mockImplementation((query) => {
      const allProducts = [
        {
          id: 101,
          title: "Apple AirPods Max Silver",
          description: "High-end headphones",
          price: 599,
          thumbnail: "airpods.jpg",
        },
        {
          id: 102,
          title: "Laptop Pro",
          description: "Powerful laptop for work",
          price: 1200,
          thumbnail: "laptop.jpg",
        },
      ];

      const filtered = allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

      return Promise.resolve({
        products: filtered,
        total: filtered.length,
        skip: 0,
        limit: filtered.length,
      });
    });

    // Mock categorie
    api.fetchCategories.mockResolvedValue(["mobile-accessories", "laptops"]);

    // Client React Query per i test
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    // Render della Homepage con i provider necessari
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CartProvider>
            <Homepage />
          </CartProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const searchInput = screen.getByRole("searchbox");
    const searchButton = screen.getByRole("button", {
      name: /search products/i,
    });

    // --- Ricerca per titolo ---
    await userEvent.type(searchInput, "AirPods");
    await userEvent.click(searchButton);

    const productByTitle = await screen.findByText("Apple AirPods Max Silver");
    expect(productByTitle).toBeInTheDocument();
    expect(screen.queryByText("Laptop Pro")).not.toBeInTheDocument();

    // --- Ricerca per descrizione ---
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "Powerful laptop");
    await userEvent.click(searchButton);

    const productByDesc = await screen.findByText("Laptop Pro");
    expect(productByDesc).toBeInTheDocument();
    expect(
      screen.queryByText("Apple AirPods Max Silver")
    ).not.toBeInTheDocument();
  });
});
