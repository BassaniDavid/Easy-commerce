import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DefaultLayout from "./layouts/DefaultLayout";
import Homepage from "./pages/Homepage";
import CartPage from "./pages/CartPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { CartProvider } from "./contexts/CartContext";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/products/:slug" element={<ProductDetailsPage />} />
              <Route path="*" element={<h1>404: Pagina non trovata</h1>} />
            </Route>
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
