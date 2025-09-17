import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

import { MemoryRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import * as api from "../api/api";

describe("Homepage - Paginazione numerica con chiamata API", () => {
  beforeEach(() => {
    vi.spyOn(api, "fetchProducts").mockImplementation(
      async (limit = 20, skip = 0) => {
        // Array di 40 prodotti mockati
        const allProducts = Array.from({ length: 40 }, (_, i) => ({
          id: i + 1,
          title: `Prodotto ${i + 1}`,
          description: `Descrizione ${i + 1}`,
          price: 10 + i,
          thumbnail: "test.jpg",
        }));

        // Calcola i prodotti della pagina corrente
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

  it("mostra massimo 20 prodotti per pagina e chiama fetchProducts con limit e skip corretti", async () => {
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    // Controlla che siano presenti i primi 20 prodotti
    const prodotti = await screen.findAllByRole("heading", { level: 2 });
    expect(prodotti.length).toBeLessThanOrEqual(20);

    // La prima chiamata deve essere con limit=20, skip=0
    expect(api.fetchProducts).toHaveBeenCalledWith(20, 0);
  });

  it("cambia pagina cliccando sul numero della pagina e chiama fetchProducts correttamente", async () => {
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    // Clic su pagina 2
    await userEvent.click(await screen.findByRole("button", { name: "2" }));

    // La chiamata API deve avere skip=20, limit=20
    expect(api.fetchProducts).toHaveBeenCalledWith(20, 20);

    // Controlla che il prodotto 21 sia visibile
    expect(await screen.findByText(/Prodotto 21/i)).toBeInTheDocument();
  });

  it("torna alla pagina precedente e chiama fetchProducts con skip corretto", async () => {
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    // Vai alla pagina 2
    await userEvent.click(await screen.findByRole("button", { name: "2" }));

    // Torna alla pagina 1
    await userEvent.click(await screen.findByRole("button", { name: "1" }));

    // La chiamata API deve avere skip=0
    expect(api.fetchProducts).toHaveBeenCalledWith(20, 0);

    // Controlla che Prodotto 1 sia visibile
    expect(await screen.findByText(/^Prodotto 1$/i)).toBeInTheDocument();

    // Controlla che Prodotto 20 sia visibile
    expect(await screen.findByText(/^Prodotto 20$/i)).toBeInTheDocument();
  });
});
