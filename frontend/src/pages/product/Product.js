import React, { useState, useEffect } from 'react';
import Sidebar from 'Components/product/Sidebar';
import ProductList from 'Components/product/ProductList';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from 'Components/product/Pagination';

function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([]); // Track cart items
  const [error, setError] = useState(null); // Error state

  const productsPerPage = 6;

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setError(null); // Reset error state
      try {
        const response = await axios.get('http://localhost:3000/api/products/allProducts');
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchTerm(search);

    const results = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(search) ||
        product.productCategory.toLowerCase().includes(search) ||
        product.productDescription.toLowerCase().includes(search)
    );

    setFilteredProducts(results);
    setCurrentPage(1);
  };

  // Handle adding products to the cart
  const handleAddToCart = async (productId, quantity) => {
    if (quantity < 1) {
      alert('Quantity must be at least 1.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/cart/add', {
        productId,
        quantity
      });
      setCart(response.data.cart.items); // Update cart after adding
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error.response ? error.response.data : error);
      alert('Failed to add the product to the cart. Please try again.');
    }
  };

  // Pagination logic
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <Sidebar
            products={products}
            setFilteredProducts={setFilteredProducts}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <div className="col-md-9">
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, category, or description"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Handle error and no products */}
          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-muted">
              No products match your search or filters. Try a different query!
            </div>
          ) : (
            <ProductList
              products={currentProducts}
              handleAddToCart={handleAddToCart}
              discountPercentage={10}
            />
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalProducts={filteredProducts.length}
              productsPerPage={productsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
