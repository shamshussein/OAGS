import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from 'Components/product/Sidebar';
import ProductList from 'Components/product/ProductList';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from "config";


function Product() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [hasMore, setHasMore] = useState({});
  const [pages, setPages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const productsPerPage = 6;
  const discountPercentage = 10;

  const initialCategories = useMemo(() => ["Hiking", "Camping", "Survival", "Travel"], []);

  const categories = useMemo(() => {
    return selectedCategory ? [selectedCategory] : initialCategories;
  }, [selectedCategory, initialCategories]);

  const fetchProducts = useCallback(
    async (category, page = 1, append = false) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/getAllProducts`, {
          params: {
            page,
            limit: productsPerPage,
            search: searchTerm,           
            filterCategory: category,      
            priceRange: selectedPriceRange 
          },
        });
        setProductsByCategory((prev) => ({
          ...prev,
          [category]: append
            ? [...(prev[category] || []), ...response.data.products]
            : response.data.products,
        }));

        setHasMore((prev) => ({
          ...prev,
          [category]: response.data.hasMore,
        }));
      } catch (err) {
        console.error("Error fetching products for category", category, err);
      }
    },
    [searchTerm, selectedPriceRange, productsPerPage]
  );

  useEffect(() => {
    const newPages = {};
    categories.forEach((cat) => {
      newPages[cat] = 1;
    });
    setPages(newPages);

    categories.forEach((cat) => {
      fetchProducts(cat, 1, false);
    });
  }, [categories, fetchProducts]);

  const loadMoreProducts = (category) => {
    const nextPage = (pages[category] || 1) + 1;
    fetchProducts(category, nextPage, true);
    setPages((prev) => ({
      ...prev,
      [category]: nextPage,
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
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
              placeholder=" 🔍 Search by name, category, or description "
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {categories.map((category) => {
            const categoryProducts = productsByCategory[category] || [];
            if (categoryProducts.length > 0) {
              return (
                <div key={category}>
                  <h3
                    style={{
                      marginBottom: "7vh",
                      marginTop: "5vh",
                      textAlign: "center",
                    }}
                  >
                    {category}
                  </h3>
                  <ProductList
                    products={categoryProducts}
                    discountPercentage={discountPercentage}
                  />
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

          {categories.every((cat) => (productsByCategory[cat] || []).length === 0) && (
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
