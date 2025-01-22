import React, { useState } from 'react'; // Import useState
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
  const [ setCartItems] = useState([]);  // Track cart items

  const addToCart = async (product) => {
    try {
      console.log('Adding product to cart:', product);

      const response = await axios.post('http://localhost:3000/api/cart/addToCart', {
        product: product._id,
        productQuantity: 1,  // Quantity can be dynamic
      });

      console.log('Cart updated:', response.data);

      // Assuming response.data.cart contains the updated cart
      setCartItems(response.data.cart.products);  // Update cart state
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const productPrice = product.productPrice ? parseFloat(product.productPrice.$numberDecimal) : 0;
  const discountedPrice = productPrice * (1 - discountPercentage / 100);
  const imageSrc = product.productImage || '/assets/images/image_fallback.png'; 

  return (
    <div className="card mb-3 product-item-card">
      <div className="row g-0">
        <div className="col-md-4">
          <img src={imageSrc} className="img-fluid product-item-image" alt={product.productName} />
        </div>

        <div className="col-md-8">
          <div className="card-body position-relative producr-info">
            <h5 className="card-title">{product.productName}</h5>
            <p className="card-text "><strong>Category:</strong> {product.productCategory}</p>
            <p className="card-text "><strong>Quantity:</strong> {product.productQuantity}</p>
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
          data-id={product.productId} 
          onClick={() => {
            console.log('Add to cart clicked!', product);  // Log when button is clicked
            addToCart(product);  // Call the addToCart function
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
