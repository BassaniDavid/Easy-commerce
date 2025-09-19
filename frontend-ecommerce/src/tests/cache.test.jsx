import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import { CartProvider } from "../contexts/CartContext";
import * as api from "../api/api";

// Helper per render con QueryClient, Router e CartProvider
function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>{ui}</CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Mock dei prodotti per pagina
const mockPages = {
  1: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Prodotto Pagina 1 - ${i + 1}`,
    thumbnail: `img1-${i + 1}.jpg`,
  })),
  2: Array.from({ length: 20 }, (_, i) => ({
    id: i + 21,
    title: `Prodotto Pagina 2 - ${i + 21}`,
    thumbnail: `img2-${i + 21}.jpg`,
  })),
};

describe("Homepage - caching con React Query", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(api, "fetchProducts").mockImplementation(
      async (limit = 20, skip = 0) => {
        if (skip === 0) return { products: mockPages[1], total: 40 };
        if (skip === 20) return { products: mockPages[2], total: 40 };
        return { products: [], total: 0 };
      }
    );
  });

  it("carica pagina 1, pagina 2 e torna indietro usando cache", async () => {
    renderWithProviders(<Homepage />);

    // Controlla alcuni prodotti della pagina 1
    expect(
      await screen.findByText(/^Prodotto pagina 1 - 1$/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Prodotto Pagina 1 - 20/i)
    ).toBeInTheDocument();

    // Vai alla pagina 2
    await userEvent.click(await screen.findByRole("button", { name: "2" }));

    // Controlla alcuni prodotti della pagina 2
    expect(
      await screen.findByText(/Prodotto Pagina 2 - 21/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Prodotto Pagina 2 - 40/i)
    ).toBeInTheDocument();

    // Torna alla pagina 1 (cache)
    await userEvent.click(await screen.findByRole("button", { name: "1" }));

    expect(
      await screen.findByText(/^Prodotto pagina 1 - 1$/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Prodotto pagina 1 - 20/i)
    ).toBeInTheDocument();

    // fetchProducts chiamato solo due volte
    expect(api.fetchProducts).toHaveBeenCalledTimes(2);
  });
});
