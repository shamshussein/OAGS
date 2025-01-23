import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({
  setFilteredProducts,
  products,
  setCurrentPage,
  setSelectedCategory,
  setSelectedPriceRange,
  searchTerm,
}) => {
  const [selectedCategory, setCategory] = useState('');
  const [selectedPriceRange, setPriceRange] = useState('');

  const applyFilter = () => {
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
        const price = parseFloat(product.productPrice.$numberDecimal || product.productPrice);
        return price >= min && (max ? price <= max : true);
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchTerm) ||
          product.productCategory.toLowerCase().includes(searchTerm) ||
          product.productDescription.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);

    setSelectedCategory(selectedCategory);
    setSelectedPriceRange(selectedPriceRange);
  };

  const resetFilters = () => {
    setCategory('');
    setPriceRange('');
    setFilteredProducts(products);
    setCurrentPage(1);

    setSelectedCategory('');
    setSelectedPriceRange('');
  };

  return (
    <div className="sidebar">
      <h5>Filter Products</h5>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Hiking">Hiking</option>
          <option value="Survival">Survival</option>
          <option value="Camping">Camping</option>
          <option value="Travel">Travel</option>
        </select>
      </div>

      <div className="filter-group mt-3">
        <label htmlFor="price-range">Price Range</label>
        <select
          id="price-range"
          className="form-select"
          value={selectedPriceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="">All Prices</option>
          <option value="0-50">$0 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-200">$100 - $200</option>
          <option value="200-500">$200 - $500</option>
          <option value="500-1000">$500 - $1000</option>
        </select>
      </div>

      <div className="mt-4">
        <button className="btn btn-secondary w-100" onClick={applyFilter}>
          Apply Filter
        </button>
      </div>

      <div className="mt-2">
        <button className="btn btn-secondary w-100" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
