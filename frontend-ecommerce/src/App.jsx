import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Homepage from "./pages/Homepage";
import CartPage from "./pages/CartPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          {/* Rotta per l'Homepage */}
          <Route path="/" element={<Homepage />} />

          {/* Rotta per il carrello */}
          <Route path="/cart" element={<CartPage />} />

          {/* Rotta dinamica per le pagine dei singoli prodotti */}
          <Route path="/products/:slug" element={<ProductDetailsPage />} />

          {/* Rotta per gestire i casi di "pagina non trovata" */}
          <Route path="*" element={<h1>404: Pagina non trovata</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
