import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import Pagination from './Pagination';
import './ProductList.css'; 

const ProductList = ({ discountPercentage }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);  // Added state for cart

  const productsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/products/allProducts');
        setProducts(response.data.products);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existingProductIndex = cartItems.findIndex(item => item._id === product._id);
    if (existingProductIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingProductIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const renderPage = () => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = products.slice(start, end);

    return (
      <div className="row gy-4">
        {paginatedProducts.map((product) => (
          <div key={product._id} className="col-md-6 col-lg-4">
            <ProductItem 
              product={product} 
              discountPercentage={discountPercentage} 
              addToCart={addToCart}  // Pass the addToCart function to each product
            />
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      {renderPage()}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalProducts={products.length}
        productsPerPage={productsPerPage}
      />
    </div>
  );
};

export default ProductList;
