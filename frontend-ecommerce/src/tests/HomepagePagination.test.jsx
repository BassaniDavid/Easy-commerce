import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import Homepage from "../pages/Homepage";
import { vi } from "vitest";

describe("test per la Paginazione", () => {
  beforeEach(() => {
    // Mock dei prodotti: 40 prodotti fittizi
    vi.spyOn(api, "fetchProducts").mockResolvedValue(
      Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        title: `Prodotto ${i + 1}`,
        description: `Descrizione ${i + 1}`,
        price: 10 + i,
        thumbnail: "test.jpg",
      }))
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mostra un numero limitato di prodotti per pagina", async () => {
    render(<Homepage />);

    // Attende il caricamento dei prodotti
    const prodotti = await screen.findAllByRole("heading", { level: 2 });

    // Assicurati che siano massimo 20 prodotti
    expect(prodotti.length).toBeLessThanOrEqual(20);
  });

  it("cambia pagina cliccando sul numero della pagina", async () => {
    render(<Homepage />);

    // La pagina 1 deve contenere Prodotto 1
    expect(await screen.findByText(/Prodotto 1/i)).toBeInTheDocument();

    // Clic sul numero pagina 2
    await userEvent.click(screen.getByRole("button", { name: "2" }));

    // Ora dovrebbe comparire Prodotto 21
    expect(await screen.findByText(/Prodotto 21/i)).toBeInTheDocument();
  });

  it("permette di tornare a una pagina precedente", async () => {
    render(<Homepage />);

    // Vai alla pagina 2
    await userEvent.click(await screen.findByRole("button", { name: "2" }));

    // Torna alla pagina 1
    await userEvent.click(screen.getByRole("button", { name: "1" }));

    // Controlla che Prodotto 1 sia visibile
    expect(await screen.findByText(/Prodotto 1/i)).toBeInTheDocument();
  });
});
