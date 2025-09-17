import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import { fetchProductsBySearch } from "../api/api";

// Mock della funzione fetchProductsBySearch
vi.mock("../api/api", () => ({
  fetchProductsBySearch: vi.fn(),
}));

describe("Homepage ricerca", () => {
  it("filtro risultati in base alla ricerca", async () => {
    // Mock della risposta API
    fetchProductsBySearch.mockResolvedValue({
      products: [
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
      ],
      total: 2,
      skip: 0,
      limit: 2,
    });

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    const searchInput = screen.getByRole("searchbox");

    await userEvent.type(searchInput, "AirPods");

    // Aspetta che il prodotto filtrato appaia
    const productTitle = await screen.findByText("Apple AirPods Max Silver");
    expect(productTitle).toBeInTheDocument();

    // Controlla che prodotti non corrispondenti non siano presenti
    expect(screen.queryByText("Laptop Pro")).not.toBeInTheDocument();
  });
});
