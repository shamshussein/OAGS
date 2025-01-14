import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ProductList from './ProductList';
import "./products.css";

const products = [
  {
    id: 1,
    name: 'Tent',
    price: 100,
    category: 'Camping',
    rating: 4.5,
    image: '/assets/images/camping/Camping chair.jpg',
    description: 'A great camping tent.',
    isSized: true,
  },
];

function Product() {
  const [filteredProducts, setFilteredProducts] = useState(products);

  return (
    <>
    <div className="product-container">
      <Sidebar setFilteredProducts={setFilteredProducts} />
      <ProductList products={filteredProducts} discountPercentage={10} />
      </div>
      </>
  );
}

export default Product;
