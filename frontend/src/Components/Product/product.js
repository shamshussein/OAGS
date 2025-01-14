import React from 'react'
import "./products.css"

function Product(){
    return(
        <>
        <section className="sidebar" id="sidebar">
  <h3>Filter Products</h3><br/>
  <div className="filter-section">
      <label for="price-range"><h2 style={{fontSize: "1rem;"}}>Price Range:</h2></label>
      <input type="range" id="price-range" min="0" max="1000" value="500" step="5"/>
      <span id="price-range-value">$500</span> <br/>
  </div>

  <aside className="categories">
      <h2>Categories</h2><br/>
      <ul>
          <li>
              <input type="checkbox" id="camping" value="Camping" className="category-filter"/>
              <label for="camping">Camping</label>
          </li>
          <li>
              <input type="checkbox" id="hiking" value="Hiking" className="category-filter"/>
              <label for="hiking">Hiking</label>
          </li>
          <li>
              <input type="checkbox" id="travel" value="Travel" className="category-filter"/>
              <label for="travel">Travel</label>
          </li>
          <li>
              <input type="checkbox" id="survival" value="Survival" className="category-filter"/>
              <label for="survival">Survival</label>
          </li>
      </ul>
  </aside>
  <button id="apply-filters" className="apply-filters">Apply Filters</button>
</section>

<div className="filter-icon-container">
  <i className="bx bx-filter-alt" id="filter-icon"></i>
</div>

    <section>
        <ul id="product-list" className="product-list"></ul>
    </section>
        </>
    )
}

export default Product;