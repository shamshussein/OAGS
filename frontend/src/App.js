import { Route, Routes } from "react-router-dom";
import Header from 'Components/layout/NavBar/Header';
import Hero from 'pages/home/Hero';
import Footer from 'Components/layout/Footer/Footer';
import Product from "pages/product/Product";

function App() {

  return (
<>
    <Header />
    <Routes>
        <Route path="/" element={<Hero />} />

        <Route path="/products" element={<Product />} />
        <Route path="/about-us"
        //  element={<Product />} 
         />
        <Route path="/contact-us"
        //  element={<Product />} 
         />
        <Route path="/orders" 
        // element={<Product />} 
        />
      </Routes>
          <Footer />
</>
  )
}

export default App
