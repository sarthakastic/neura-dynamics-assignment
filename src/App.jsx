import { Route, Routes } from "react-router-dom";
import Layout from "./components/ui/Layout";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import MyFavourites from "./pages/MyFavourites";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favourites" element={<MyFavourites />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
