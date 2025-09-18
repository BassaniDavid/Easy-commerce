import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { CartProvider } from "../contexts/CartContext";
import { MemoryRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import * as api from "../api/api";

describe("Homepage - Paginazione numerica con chiamata API", () => {
  beforeEach(() => {
    // Mock di fetchProducts: crea 40 prodotti fittizi
    vi.spyOn(api, "fetchProducts").mockImplementation(
      async (limit = 20, skip = 0) => {
        const allProducts = Array.from({ length: 40 }, (_, i) => ({
          id: i + 1,
          title: `Prodotto ${i + 1}`,
          description: `Descrizione ${i + 1}`,
          price: 10 + i,
          thumbnail: "test.jpg",
        }));

        // Restituisce solo i prodotti della pagina corrente
        const pagedProducts = allProducts.slice(skip, skip + limit);

        return {
          products: pagedProducts,
          total: allProducts.length,
        };
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mostra massimo 20 prodotti per pagina all'apertura e chiama fetchProducts correttamente", async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Homepage />
        </CartProvider>
      </MemoryRouter>
    );

    // Controlla che siano presenti massimo 20 headings per i prodotti
    const prodotti = await screen.findAllByRole("heading", { level: 2 });
    expect(prodotti.length).toBeLessThanOrEqual(20);

    // Verifica che l'API sia stata chiamata con limit=20, skip=0
    expect(api.fetchProducts).toHaveBeenCalledWith(20, 0);
  });

  it("mostra i prodotti della pagina 2 cliccando sul numero e chiama fetchProducts con skip corretto", async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Homepage />
        </CartProvider>
      </MemoryRouter>
    );

    // Clic su pagina 2
    await userEvent.click(await screen.findByRole("button", { name: "2" }));

    // L'API deve essere chiamata con skip=20 (seconda pagina)
    expect(api.fetchProducts).toHaveBeenCalledWith(20, 20);

    // Controlla che il primo prodotto della pagina 2 sia visibile
    expect(await screen.findByText(/Prodotto 21/i)).toBeInTheDocument();
  });

  it("torna alla pagina precedente e chiama fetchProducts con skip=0", async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Homepage />
        </CartProvider>
      </MemoryRouter>
    );

    // Vai prima alla pagina 2
    await userEvent.click(await screen.findByRole("button", { name: "2" }));

    // Torna alla pagina 1
    await userEvent.click(await screen.findByRole("button", { name: "1" }));

    // L'API deve essere chiamata con skip=0
    expect(api.fetchProducts).toHaveBeenCalledWith(20, 0);

    // Controlla che il prodotto 1 e 20 siano visibili nella pagina 1
    expect(await screen.findByText(/^Prodotto 1$/i)).toBeInTheDocument();
    expect(await screen.findByText(/^Prodotto 20$/i)).toBeInTheDocument();
  });
});
