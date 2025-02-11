import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './bundles.css';
import API_BASE_URL from "config";

function BundleBanner() {
  const [bundles, setBundles] = useState([]);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bundles/`);
        setBundles(response.data);
      } catch (err) {
        console.error("Error fetching bundles:", err.message);
      }
    };

    fetchBundles();
  }, []);

  const addBundleToCart = async (bundleId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.token) {
        alert("User is not logged in.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/carts/addBundleToCart`,
        { bundleId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Server Response:", response.data);
      alert("Bundle added to cart successfully.");
      window.location.reload();

    } catch (err) {
      console.error("Error adding bundle to cart:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "An error occurred.");
    }
  };

  const calculateBundleQuantity = (bundle) => {
    if (!bundle.products || bundle.products.length === 0) return 0;
    const minQuantity = Math.min(...bundle.products.map(product => product.productQuantity));
    return minQuantity;
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? '#ffc107' : '#e4e5e9',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bundle-container">
      <h2 className="text-center" style={{ fontSize: '1.5rem' }}>
        OUR OFFERS
      </h2>
      <div className="row">
        {bundles.map((bundle, index) => (
          <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="bundle-card">
              <div className="bundle-card-content">
                <div className="bundle-image">
                  <img
                    src={bundle.image}
                    alt={bundle.name}
                    className="img-fluid rounded"
                  />
                </div>
                <div className="bundle-info">
                  <h2 className="bundle-title">{bundle.name}</h2>

                  { <div className="bundle-products">
                    <ul>
                      {bundle.products.map((product, idx) => (
                        <li key={idx}>
                          {product.productName} 
                          {/* (Qty: {product.productQuantity}) */}
                        </li>
                      ))}
                    </ul>
                  </div> }

                  <div className="price-section">
                    <s className="original-price">
                      ${parseFloat(bundle.originalPrice).toFixed(2)}
                    </s>
                    <span className="discounted-price">
                      ${parseFloat(bundle.originalPrice * (1 - 0.1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="availability">
                      <strong>Available Quantity:</strong> {calculateBundleQuantity(bundle)}
                    </div> 
                  <div className="availability-rating">
                     
                    <div className="rating">
                     {renderRatingStars(bundle.rating)}
                    </div>
                  </div>
                  <div className='button-container'>
                  <button
                    className="addtocart"
                    onClick={() => addBundleToCart(bundle._id)}
                  >
                    Add to Cart
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BundleBanner;
