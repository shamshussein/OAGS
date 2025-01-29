import React, { useState, useEffect } from 'react';
import Sidebar from 'Components/product/Sidebar';
import ProductList from 'Components/product/ProductList';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Product() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const productsPerPage = 6;

  const fetchProducts = async (category = "", page = 1) => {
    try {
      console.log("Fetching products for category:", category || "All", "Page:", page);
  
      const response = await axios.get("http://localhost:3000/api/products/getAllProducts", {
        params: { page, limit: productsPerPage, category },
      });
  
      console.log("API Response:", response.data);
  
      if (response.data.products && response.data.products.length > 0) {
        setProductsByCategory((prev) => {
          const updatedProducts = { ...prev };
  
          // Ensure the category exists in the state
          if (!updatedProducts[category]) {
            updatedProducts[category] = [];
          }
  
          // Filter out duplicates before appending new products
          const existingProductIds = new Set(updatedProducts[category].map((p) => p._id));
          const newProducts = response.data.products.filter(
            (product) => !existingProductIds.has(product._id)
          );
  
          updatedProducts[category] = [...updatedProducts[category], ...newProducts];
  
          return updatedProducts;
        });
      } else {
        console.warn("No products found for category:", category || "All");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  
  useEffect(() => {
    const initialCategories = ["Hiking", "Camping", "Survival", "Travel"];
    initialCategories.forEach((category) => {
      fetchProducts(category, 1);
    });
  }, []);
  

  const loadMoreProducts = (category) => {
    const currentProducts = productsByCategory[category] || [];
    const currentPage = Math.ceil(currentProducts.length / productsPerPage) + 1;
    fetchProducts(category, currentPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const applyFilters = (products) => {
    let filtered = [...products];
  
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.productCategory &&
          product.productCategory.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
  
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter((product) => {
        let price = parseFloat(product.productPrice);
        return price >= min && (max ? price <= max : true);
      });
    }
  
    return filtered;
  };
  

  const getFilteredProducts = (category) => {
    if (!productsByCategory[category]) return [];
    let filtered = productsByCategory[category];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchTerm) ||
          product.productCategory.toLowerCase().includes(searchTerm) ||
          product.productDescription.toLowerCase().includes(searchTerm)
      );
    }

    return applyFilters(filtered);
  };

 return (
  <div className="container mt-5">
    <div className="row">
      <div className="col-md-3">
        <Sidebar
          setSelectedCategory={setSelectedCategory}
          setProductsByCategory={setProductsByCategory}
          setSelectedPriceRange={setSelectedPriceRange}
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

        {Object.keys(productsByCategory).map((category) => {
          const filteredProducts = getFilteredProducts(category);
          console.log("Filtered Products for", category, ":", filteredProducts);

          return (
            <div key={category}>
              <h3>{category}</h3>
              <ProductList products={filteredProducts} discountPercentage={10} />
              {filteredProducts.length >= productsPerPage && (
                <div className="text-center mt-4">
                  <button className="btn btn-secondary" onClick={() => loadMoreProducts(category)}>
                    Load More
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
}

export default Product;
