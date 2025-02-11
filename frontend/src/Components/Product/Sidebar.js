import React from 'react';
import './Sidebar.css';

const Sidebar = ({
  setSelectedCategory,
  setSelectedPriceRange,
  selectedCategory,
  selectedPriceRange,
}) => {
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriceRangeChange = (e) => {
    setSelectedPriceRange(e.target.value);
  };

  const resetFilters = () => {
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
          onChange={handleCategoryChange}
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
          onChange={handlePriceRangeChange}
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
        <button className="btn btn-secondary w-100" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Sidebar;