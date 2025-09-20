import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DefaultLayout from "./layouts/DefaultLayout";
import Homepage from "./pages/Homepage";
import CartPage from "./pages/CartPage";
import Page404 from "./pages/Page404";
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
              <Route path="*" element={<Page404 />} />
            </Route>
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
