import { Routes, Route } from 'react-router-dom';
import Header from './Components/NavBar/Header';
import Hero from './Components/Home/Hero';
import Footer from './Components/Footer/Footer';

function App() {

  return (
    // <Routes>
    //   <Route path="/" element={<Home />} />
    // </Routes>
<>

<Header />
    <Hero />
    <Footer />
</>
  )
}

export default App
