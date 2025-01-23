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

  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products/allProducts');
        setProducts(response.data.products);
        setFilteredProducts(response.data.products); 
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

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

          <ProductList products={currentProducts} discountPercentage={10} />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalProducts={filteredProducts.length}
            productsPerPage={productsPerPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Product;
