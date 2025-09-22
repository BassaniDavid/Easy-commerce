import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "../contexts/CartContext";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Homepage from "../pages/Homepage";
import * as api from "../api/api";

describe("Homepage - Filtraggio per categoria e reset selezionando 'category'", () => {
  let queryClient;

  beforeEach(() => {
    // Nuovo QueryClient per ogni test
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    // Mock fetchProductsByCategory
    vi.spyOn(api, "fetchProductsByCategory").mockImplementation(
      async (category, limit = 20, skip = 0) => {
        const allProducts = [
          {
            id: 1,
            title: "iPhone 14",
            description: "Smartphone Apple",
            price: 999,
            thumbnail: "iphone.jpg",
            category: "smartphones",
          },
          {
            id: 2,
            title: "Galaxy S22",
            description: "Smartphone Samsung",
            price: 899,
            thumbnail: "galaxy.jpg",
            category: "smartphones",
          },
          {
            id: 3,
            title: "MacBook Pro",
            description: "Laptop Apple",
            price: 1999,
            thumbnail: "macbook.jpg",
            category: "laptops",
          },
        ];
        const filtered = allProducts.filter(
          (p) => !category || p.category === category
        );
        return {
          products: filtered.slice(skip, skip + limit),
          total: filtered.length,
        };
      }
    );

    // Mock fetchProducts
    vi.spyOn(api, "fetchProducts").mockResolvedValue({
      products: [
        {
          id: 1,
          title: "iPhone 14",
          description: "Smartphone Apple",
          price: 999,
          thumbnail: "iphone.jpg",
        },
        {
          id: 2,
          title: "Galaxy S22",
          description: "Smartphone Samsung",
          price: 899,
          thumbnail: "galaxy.jpg",
        },
        {
          id: 3,
          title: "MacBook Pro",
          description: "Laptop Apple",
          price: 1999,
          thumbnail: "macbook.jpg",
        },
      ],
      total: 3,
    });

    queryClient.clear(); // Pulisce la cache
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderHomepage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CartProvider>
            <Homepage />
          </CartProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("mostra tutti i prodotti di default all'apertura della pagina", async () => {
    renderHomepage();

    expect(await screen.findByText(/iPhone 14/i)).toBeInTheDocument();
    expect(await screen.findByText(/Galaxy S22/i)).toBeInTheDocument();
    expect(await screen.findByText(/MacBook Pro/i)).toBeInTheDocument();

    // Verifica che fetchProducts sia stato chiamato
    expect(api.fetchProducts).toHaveBeenCalledWith(20, 0);
  });

  it("mostra tutti i prodotti selezionando 'category' dal filtro categorie", async () => {
    renderHomepage();

    const select = screen.getByRole("combobox", { name: /Category select/i });

    // Seleziona 'category' (valore vuoto)
    await userEvent.selectOptions(select, "");

    expect(await screen.findByText(/iPhone 14/i)).toBeInTheDocument();
    expect(await screen.findByText(/Galaxy S22/i)).toBeInTheDocument();
    expect(await screen.findByText(/MacBook Pro/i)).toBeInTheDocument();

    // Verifica che fetchProducts sia stato chiamato per il reset
    expect(api.fetchProducts).toHaveBeenCalledWith(20, 0);
  });
});
