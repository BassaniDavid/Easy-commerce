import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Homepage from "../pages/Homepage";
import * as api from "../services/api";

describe("Homepage - Filtraggio per categoria e reset paginazione", () => {
  beforeEach(() => {
    // Mock da usare per fetchProductsByCategory
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

    // Mock fetchProducts normale (categoria "All")
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

  it("mostra tutti i prodotti di default", async () => {
    render(<Homepage />);

    expect(await screen.findByText(/iPhone 14/i)).toBeInTheDocument();
    expect(await screen.findByText(/Galaxy S22/i)).toBeInTheDocument();
    expect(await screen.findByText(/MacBook Pro/i)).toBeInTheDocument();
  });

  it("filtra i prodotti selezionando 'smartphones' e resetta la paginazione a 1", async () => {
    render(<Homepage />);

    // Simula cambio pagina prima
    const nextButton = screen.getByRole("button", { name: ">" });
    await userEvent.click(nextButton); // passa a pagina 2
    expect(api.fetchProducts).toHaveBeenCalledWith(20, 20);

    // Seleziona categoria
    const select = screen.getByRole("combobox", { name: /Category select/i });
    await userEvent.selectOptions(select, "smartphones");

    // Verifica che prodotti filtrati siano visibili
    expect(await screen.findByText(/iPhone 14/i)).toBeInTheDocument();
    expect(await screen.findByText(/Galaxy S22/i)).toBeInTheDocument();

    // Prodotto di altra categoria non deve essere visibile
    expect(screen.queryByText(/MacBook Pro/i)).not.toBeInTheDocument();

    // La chiamata API deve essere con skip=0 (reset pagina)
    expect(api.fetchProductsByCategory).toHaveBeenCalledWith(
      "smartphones",
      20,
      0
    );
  });

  it("mostra tutti i prodotti selezionando 'All'", async () => {
    render(<Homepage />);

    const select = screen.getByRole("combobox", { name: /Category select/i });
    await userEvent.selectOptions(select, "");

    expect(await screen.findByText(/iPhone 14/i)).toBeInTheDocument();
    expect(await screen.findByText(/Galaxy S22/i)).toBeInTheDocument();
    expect(await screen.findByText(/MacBook Pro/i)).toBeInTheDocument();

    expect(api.fetchProducts).toHaveBeenCalledWith(20, 0); // reset paginazione
  });
});
