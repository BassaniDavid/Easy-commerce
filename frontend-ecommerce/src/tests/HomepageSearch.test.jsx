import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import * as api from "../api/api";

// Mock completo del modulo API
vi.mock("../api/api", async () => {
  const actual = await vi.importActual("../api/api");
  return {
    ...actual,
    fetchProductsBySearch: vi.fn(),
    fetchCategories: vi.fn(),
    fetchProducts: vi.fn(),
    fetchProductsByCategory: vi.fn(),
  };
});

beforeAll(() => {
  window.scrollTo = vi.fn();
});

describe("Homepage ricerca", () => {
  it("filtro risultati in base alla ricerca (title o description)", async () => {
    // Mock dinamico della ricerca
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

    // Mock categorie per evitare errori in Homepage
    api.fetchCategories.mockResolvedValue(["mobile-accessories", "laptops"]);

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    const searchInput = screen.getByRole("searchbox");
    const searchButton = screen.getByRole("button", {
      name: /search products/i,
    });

    // Ricerca tramite titolo
    await userEvent.type(searchInput, "AirPods");
    await userEvent.click(searchButton);
    const productByTitle = await screen.findByText("Apple AirPods Max Silver");
    expect(productByTitle).toBeInTheDocument();
    expect(screen.queryByText("Laptop Pro")).not.toBeInTheDocument();

    // Resetta input e ricerca tramite descrizione
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "laptop");
    await userEvent.click(searchButton);
    const productByDesc = await screen.findByText("Laptop Pro");
    expect(productByDesc).toBeInTheDocument();
    expect(
      screen.queryByText("Apple AirPods Max Silver")
    ).not.toBeInTheDocument();
  });
});
