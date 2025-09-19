import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Homepage from "../pages/Homepage";
import * as api from "../api/api";
import { CartProvider } from "../contexts/CartContext";
import { vi } from "vitest";

describe("Homepage", () => {
  it("mostra i prodotti restituiti dall'API", async () => {
    // Mock della fetchProducts per restituire un prodotto di esempio
    vi.spyOn(api, "fetchProducts").mockResolvedValueOnce({
      products: [
        {
          id: 1,
          title: "Essence Mascara Lash Princess",
          description: "Mascara test",
          price: 9.99,
          thumbnail: "test.jpg",
        },
      ],
      total: 1,
    });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    // Rendering della homepage all'interno di MemoryRouter e CartProvider
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CartProvider>
            <Homepage />
          </CartProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Attende che il componente finisca il rendering dei prodotti (useEffect)
    await waitFor(() => {
      // Controlla che il titolo del prodotto sia presente nel DOM
      expect(
        screen.getByText(/essence mascara lash princess/i)
      ).toBeInTheDocument();
    });

    // Verifica che l'API sia stata chiamata una sola volta
    expect(api.fetchProducts).toHaveBeenCalledTimes(1);
  });
});
