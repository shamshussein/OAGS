import React, { useState } from 'react';

function Sidebar({ setFilteredProducts }) {
  const [priceRange, setPriceRange] = useState(500);
  const [categories, setCategories] = useState([]);

  const applyFilters = () => {
    setFilteredProducts(prevProducts => prevProducts.filter(product => product.price <= priceRange));
  };

  return (
    <section className="sidebar">
      <h3>Filter Products</h3><br />
      <div className="filter-section">
        <label htmlFor="price-range"><h2 style={{ fontSize: '1rem' }}>Price Range:</h2></label>
        <input
          type="range"
          id="price-range"
          min="0"
          max="1000"
          value={priceRange}
          step="5"
          onChange={(e) => setPriceRange(e.target.value)}
        />
        <span id="price-range-value">${priceRange}</span><br />
      </div>

      <aside className="categories">
        <h2>Categories</h2><br />
        <ul>
          <li>
            <input
              type="checkbox"
              id="camping"
              value="Camping"
              onChange={(e) => setCategories([...categories, e.target.value])}
            />
            <label htmlFor="camping">Camping</label>
          </li>
        </ul>
      </aside>

      <button id="apply-filters" className="apply-filters" onClick={applyFilters}>
        Apply Filters
      </button>
    </section>
  );
}

export default Sidebar;
