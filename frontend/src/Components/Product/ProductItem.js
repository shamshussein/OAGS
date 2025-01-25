import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './ProductItem.css';
import axios from 'axios';

const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? (
    <i className="fa fa-star-half-o text-warning custom-icon" aria-hidden="true"></i>
  ) : null;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <i key={`full-${i}`} className="fa fa-star text-warning custom-icon" aria-hidden="true"></i>
      ))}
      {halfStar}
      {[...Array(emptyStars)].map((_, i) => (
        <i key={`empty-${i}`} className="fa fa-star-o text-warning custom-icon" aria-hidden="true"></i>
      ))}
    </>
  );
};

const ProductItem = ({ product, discountPercentage }) => {
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  useEffect(() => {
    setIsOutOfStock(product.productQuantity === 0);
  }, [product.productQuantity]);

  const addToCart = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); 
  
      if (!user || !user.token) {
        alert("User is not logged in.");
        return;
      }
  
      const response = await axios.post(
        'http://localhost:3000/api/carts/addToCart',
        {
          product: product._id,
          productQuantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
  
      console.log('Cart updated:', response.data);
      alert('Product added to cart successfully.');
    } catch (error) {
      console.error('Error adding product to cart:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'An error occurred.');
    }
  };
  

  const productPrice = product.productPrice ? parseFloat(product.productPrice.$numberDecimal) : 0;
  const discountedPrice = productPrice * (1 - discountPercentage / 100);
  const imageSrc = product.productImage || '/assets/images/image_fallback.png';

  return (
    <div className="card mb-4 product-item-card shadow-sm">
      <div className="row g-0">
        <div className="col-md-4">
          <img src={imageSrc} className="img-fluid rounded-start product-item-image" alt={product.productName} />
        </div>
        <div className="col-md-8 d-flex flex-column justify-content-between">
          <div className="card-body">
            <h5 className="card-title">{product.productName}</h5>
            <p className="card-text"><strong>Category:</strong> {product.productCategory}</p>
            <p className="card-text"><strong>Quantity:</strong> {product.productQuantity}</p>
            <p className="card-text">
              <span className="price">${productPrice.toFixed(2)}</span>
              <span className="text-danger">${discountedPrice.toFixed(2)}</span>
            </p>
            <p className="card-text">{product.productDescription}</p>
            <div className="rating">{generateStars(product.productRating || 5)}</div>
          </div>

          <div className="d-flex align-items-center justify-content-between px-3">
            {isOutOfStock ? (
              <p className="text-danger mb-0">Out of Stock</p>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
