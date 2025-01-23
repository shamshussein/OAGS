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
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  useEffect(() => {
    setIsOutOfStock(product.productQuantity === 0);
  }, [product.productQuantity]);

  const addToCart = async (product) => {
    if (cartQuantity > product.productQuantity) {
      alert("You can't add more than the available stock.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/cart/addToCart', {
        product: product._id,
        productQuantity: cartQuantity,
      });

      console.log('Cart updated:', response.data);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const productPrice = product.productPrice ? parseFloat(product.productPrice.$numberDecimal) : 0;
  const discountedPrice = productPrice * (1 - discountPercentage / 100);
  const imageSrc = product.productImage || '/assets/images/image_fallback.png';

  const handleIncrement = () => {
    if (cartQuantity < product.productQuantity) {
      setCartQuantity(cartQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (cartQuantity > 1) {
      setCartQuantity(cartQuantity - 1);
    }
  };

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
            {product.isSized && (
              <p className="card-text text-info">
                <strong style={{ color: 'black' }}>Sizes: M, L, XL</strong>
              </p>
            )}
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
              <div className="quantity-controls d-flex align-items-center">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleDecrement}
                  disabled={cartQuantity <= 1}
                >
                  -
                </button>
                <span className="mx-2">{cartQuantity}</span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleIncrement}
                  disabled={cartQuantity >= product.productQuantity}
                >
                  +
                </button>
              </div>
            )}
            <button
              className="btn btn-primary btn-sm"
              onClick={() => addToCart(product)}
              disabled={isOutOfStock || cartQuantity === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
