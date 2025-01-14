import React, { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';

function Sidebar({ setFilteredProducts }) {
  const [priceRange, setPriceRange] = useState(500);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const applyFilters = () => {
    setFilteredProducts((prevProducts) =>
      prevProducts.filter((product) => product.price <= priceRange)
    );
    handleClose(); 
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="m-3">
        Apply Filters
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Products</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mb-4">
            <label htmlFor="price-range" className="form-label">
              Price Range:
            </label>
            <input
              type="range"
              id="price-range"
              className="form-range"
              min="0"
              max="1000"
              value={priceRange}
              step="5"
              onChange={(e) => setPriceRange(e.target.value)}
            />
            <div className="mt-2">${priceRange}</div>
          </div>

          <div className="mb-4">
            <h5>Categories</h5>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="camping"
                value="Camping"
                onChange={(e) => setCategories([...categories, e.target.value])}
              />
              <label className="form-check-label" htmlFor="camping">
                Camping
              </label>
            </div>
          </div>

          <Button variant="success" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
