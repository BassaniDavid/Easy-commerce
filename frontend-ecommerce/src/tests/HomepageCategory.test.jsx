import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "../contexts/CartContext";
import { MemoryRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import * as api from "../api/api";

describe("Homepage - Filtraggio per categoria e reset selezionando 'All'", () => {
  beforeEach(() => {
    // Mock per fetchProductsByCategory: filtra prodotti per categoria
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

    // Mock fetchProducts normale: ritorna tutti i prodotti di default
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mostra tutti i prodotti di default all'apertura della pagina", async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Homepage />
        </CartProvider>
      </MemoryRouter>
    );

    // Controlla che tutti i prodotti mockati siano presenti
    expect(await screen.findByText(/iPhone 14/i)).toBeInTheDocument();
    expect(await screen.findByText(/Galaxy S22/i)).toBeInTheDocument();
    expect(await screen.findByText(/MacBook Pro/i)).toBeInTheDocument();
  });

  it("mostra tutti i prodotti selezionando 'All' dal filtro categorie", async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Homepage />
        </CartProvider>
      </MemoryRouter>
    );

    // Trova il select della categoria
    const select = screen.getByRole("combobox", { name: /Category select/i });

    // Seleziona 'All' (valore vuoto)
    await userEvent.selectOptions(select, "");

    // Verifica che tutti i prodotti siano nuovamente visibili
    expect(await screen.findByText(/iPhone 14/i)).toBeInTheDocument();
    expect(await screen.findByText(/Galaxy S22/i)).toBeInTheDocument();
    expect(await screen.findByText(/MacBook Pro/i)).toBeInTheDocument();

    // Controlla che l'API fetchProducts sia stata chiamata per il reset
    expect(api.fetchProducts).toHaveBeenCalledWith(20, 0);
  });
});
