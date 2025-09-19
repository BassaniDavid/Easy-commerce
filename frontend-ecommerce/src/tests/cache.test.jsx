// cache.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import * as api from "../api/api";

// Mock realistici dei prodotti
const mockProduct1 = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  description: "Volumizing and lengthening mascara.",
  price: 9.99,
  thumbnail: "mock-thumbnail-1.jpg",
};
const mockProduct2 = {
  id: 2,
  title: "Lipstick Rouge",
  description: "Red lipstick with matte finish.",
  price: 12.5,
  thumbnail: "mock-thumbnail-2.jpg",
};

// Mock delle funzioni API
vi.mock("../api/api", () => ({
  fetchProducts: vi.fn(),
  fetchProductsByCategory: vi.fn(),
  fetchCategories: vi.fn(),
  fetchProductsBySearch: vi.fn(),
}));

function renderWithClient(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Homepage con caching React Query", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = () => {};
  });

  it("carica la prima pagina e la seconda, tornando indietro legge dalla cache", async () => {
    api.fetchProducts
      .mockResolvedValueOnce({ products: [mockProduct1], total: 40 })
      .mockResolvedValueOnce({ products: [mockProduct2], total: 40 });

    renderWithClient(<Homepage />);

    // Prima pagina
    await screen.findByRole("heading", { name: mockProduct1.title });

    // Vai a pagina 2
    fireEvent.click(screen.getByLabelText("Next"));
    await screen.findByRole("heading", { name: mockProduct2.title });

    // Torna a pagina 1 → caching
    fireEvent.click(screen.getByLabelText("Previous"));
    await screen.findByRole("heading", { name: mockProduct1.title });

    // fetchProducts chiamato solo due volte (prima e seconda pagina)
    expect(api.fetchProducts).toHaveBeenCalledTimes(2);
  });

  it("mostra prodotti dopo ricerca", async () => {
    api.fetchProductsBySearch.mockResolvedValueOnce({
      products: [mockProduct1],
      total: 1,
    });

    renderWithClient(<Homepage />);

    const input = await screen.findByRole("searchbox");
    fireEvent.change(input, { target: { value: "Mascara" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await screen.findByRole("heading", { name: mockProduct1.title });
    expect(api.fetchProductsBySearch).toHaveBeenCalledWith("Mascara");
  });

  it("mostra prodotti filtrati per categoria", async () => {
    api.fetchCategories.mockResolvedValue(["beauty", "makeup"]);
    api.fetchProductsByCategory.mockResolvedValueOnce({
      products: [mockProduct1],
      total: 1,
    });

    renderWithClient(<Homepage />);

    const select = await screen.findByLabelText("Category select");
    fireEvent.change(select, { target: { value: "beauty" } });

    await screen.findByRole("heading", { name: mockProduct1.title });
    expect(api.fetchProductsByCategory).toHaveBeenCalledWith("beauty", 20, 0);
  });
});
