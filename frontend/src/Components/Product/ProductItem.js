import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './ProductItem.css';
import axios from 'axios';

// Generate star rating icons
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

// ProductItem component
const ProductItem = ({ product, discountPercentage }) => {
  const [cartQuantity, setCartQuantity] = useState(1); // Track the quantity being added to cart
  const [isOutOfStock, setIsOutOfStock] = useState(product.productQuantity === 0); // Check stock status
  const [isAdding, setIsAdding] = useState(false); // To prevent duplicate clicks

  // Add product to the cart
  const addToCart = async () => {
    if (cartQuantity > product.productQuantity) {
      alert("You can't add more than the available stock.");
      return;
    }

    setIsAdding(true); // Disable button to prevent multiple clicks

    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

    // If no token, alert the user and return
    if (!token) {
      alert('You must be logged in to add items to the cart!');
      setIsAdding(false); // Re-enable the button
      return;
    }

    try {
      console.log('Adding product to cart:', product);

      // Send the POST request to add the product to the cart
      const response = await axios.post('http://localhost:3000/api/cart/addToCart', {
        productId: product._id,  // Pass the product ID
        quantity: cartQuantity,  // Pass the selected quantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`,  // Add Authorization header with the token
        }
      });

      console.log('Cart updated:', response.data);
      alert('Product added to cart successfully!');
      setIsAdding(false); // Re-enable the button

    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart.');
      setIsAdding(false); // Re-enable the button
    }
  };

  // Calculate prices
  const productPrice = product.productPrice ? parseFloat(product.productPrice.$numberDecimal) : 0;
  const discountedPrice = productPrice * (1 - discountPercentage / 100);

  // Image fallback
  const imageSrc = product.productImage || '/assets/images/image_fallback.png';

  // Increment quantity
  const handleIncrement = () => {
    if (cartQuantity < product.productQuantity) {
      setCartQuantity(cartQuantity + 1);
    }
  };

  // Decrement quantity
  const handleDecrement = () => {
    if (cartQuantity > 1) {
      setCartQuantity(cartQuantity - 1);
    }
  };

  return (
    <div className="card mb-3 product-item-card">
      <div className="row g-0">
        <div className="col-md-4">
          <img src={imageSrc} className="img-fluid product-item-image" alt={product.productName} />
        </div>

        <div className="col-md-8">
          <div className="card-body position-relative producr-info">
            <h5 className="card-title">{product.productName}</h5>
            <p className="card-text"><strong>Category:</strong> {product.productCategory}</p>
            <p className="card-text"><strong>Quantity Available:</strong> {product.productQuantity}</p>
            {product.isSized && (
              <p className="card-text text-info">
                <strong style={{ color: 'black' }}>Sizes: M, L, XL</strong>
              </p>
            )}
            <p className="card-text">
              <span className="price">${productPrice.toFixed(2)}</span>
              <span style={{ color: 'red' }}>${discountedPrice.toFixed(2)}</span>
            </p>
            <p className="card-text">{product.productDescription}</p>

            <div className="position-absolute rating">
              <small className="text-warning">{generateStars(product.productRating || 5)}</small>
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={addToCart}
          disabled={isOutOfStock || cartQuantity === 0 || isAdding}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
