import { it, expect, describe, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import * as api from "../api/api";

describe("Homepage", () => {
  it("mostra i prodotti dall'API", async () => {
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

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", {
        name: /essence mascara lash princess/i,
      })
    ).toBeInTheDocument();

    expect(api.fetchProducts).toHaveBeenCalledTimes(1);
  });
});
