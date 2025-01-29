import React, { useState, useEffect } from 'react';
import Sidebar from 'Components/product/Sidebar';
import ProductList from 'Components/product/ProductList';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Product() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [displayCount, setDisplayCount] = useState({}); 
  const [hasMore, setHasMore] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const productsPerPage = 6;
  const discountPercentage = 10;

  const fetchProducts = async (category = "", page = 1) => {
    try {
      const response = await axios.get("http://localhost:3000/api/products/getAllProducts", {
        params: { page, limit: productsPerPage, category },
      });
  
      console.log("API Response for", category, ":", response.data);
  
      if (response.data.products && response.data.products.length > 0) {
        setProductsByCategory((prev) => {
          const updatedProducts = { ...prev };
  
          if (!updatedProducts[category]) {
            updatedProducts[category] = [];
          }
  
          const existingProductIds = new Set(updatedProducts[category].map((p) => p._id));
          const newProducts = response.data.products.filter(
            (product) => !existingProductIds.has(product._id)
          );
  
          updatedProducts[category] = [...updatedProducts[category], ...newProducts];
  
          setHasMore((prev) => ({
            ...prev,
            [category]: response.data.hasMore,
          }));
  
          return updatedProducts;
        });
      } else {
        setHasMore((prev) => ({
          ...prev,
          [category]: false,
        }));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    const initialCategories = ["Hiking", "Camping", "Survival", "Travel"];
    initialCategories.forEach((category) => {
      fetchProducts(category, 1);
      setDisplayCount((prev) => ({ ...prev, [category]: productsPerPage })); 
    });
  }, []);

  const loadMoreProducts = (category) => {
    const currentProducts = productsByCategory[category] || [];
    const currentPage = Math.ceil(currentProducts.length / productsPerPage) + 1;
    fetchProducts(category, currentPage);
    setDisplayCount((prev) => ({ ...prev, [category]: prev[category] + productsPerPage }));
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
        const productPrice = product.productPrice
          ? parseFloat(product.productPrice.$numberDecimal || product.productPrice)
          : 0;
        const discountedPrice = productPrice * (1 - discountPercentage / 100);
        return discountedPrice >= min && (max ? discountedPrice <= max : true);
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
            setSelectedPriceRange={setSelectedPriceRange}
            selectedCategory={selectedCategory}
            selectedPriceRange={selectedPriceRange}
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
            const displayedProducts = filteredProducts.slice(0, displayCount[category] || productsPerPage);

            if (displayedProducts.length > 0) {
              return (
                <div key={category}>
                  <h3>{category}</h3>
                  <ProductList products={displayedProducts} discountPercentage={discountPercentage} />

                  {hasMore[category] && (
                    <div className="text-center mt-4">
                      <button
                        className="btn btn-secondary"
                        onClick={() => loadMoreProducts(category)}
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}

          {Object.keys(productsByCategory).every(
            (category) => getFilteredProducts(category).length === 0
          ) && (
            <div className="text-center mt-5">
              <p className="text-muted">No products match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;