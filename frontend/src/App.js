import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './Components/NavBar/Header';
import Hero from './Components/Home/Hero';
import Footer from './Components/Footer/Footer';
import Product from "./Components/Product/Product";

function App() {

  return (
<>
    <Header />
    <Routes>
        <Route path="/" element={<Hero />} />

        <Route path="/products" element={<Product />} />
        <Route path="/about-us" element={<Product />} />
        <Route path="/contact-us" element={<Product />} />
        <Route path="/orders" element={<Product />} />
      </Routes>
          <Footer />
</>
  )
}

export default App
