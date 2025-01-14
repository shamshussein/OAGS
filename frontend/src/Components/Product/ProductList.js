import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import Pagination from './Pagination';

const ProductList = ({ discountPercentage }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const productsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products/allProducts');
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        setError('Error fetching products');
        setLoading(false);
      }
    };   

    fetchProducts();
  }, []);

  const renderPage = () => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = products.slice(start, end);

    return (
      <div className="row">
        {paginatedProducts.map((product) => (
          <div key={product._id} className="col-md-6 col-lg-4">
            <ProductItem product={product} discountPercentage={discountPercentage} />
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
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
