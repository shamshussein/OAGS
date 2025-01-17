import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './ProductItem.css';

const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? (
    <i className="fa fa-star-half-o text-warning" aria-hidden="true"></i>
  ) : null;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <i key={`full-${i}`} className="fa fa-star text-warning" aria-hidden="true"></i>
      ))}
      {halfStar}
      {[...Array(emptyStars)].map((_, i) => (
        <i key={`empty-${i}`} className="fa fa-star-o text-warning" aria-hidden="true"></i>
      ))}
    </>
  );
};

const ProductItem = ({ product, discountPercentage }) => {
  const productPrice = product.productPrice
    ? parseFloat(product.productPrice.$numberDecimal) 
    : 0;

  const discountedPrice = productPrice * (1 - discountPercentage / 100);
  const imageSrc = product.productImage || '/assets/images/image_fallback.png'; 

  return (
    <div className="card mb-3 product-item-card">
      <div className="row g-0">

        <div className="col-md-4">
          <img
            src={imageSrc}
            className="img-fluid product-item-image"
            alt={product.productName}
          />
        </div>

        <div className="col-md-8">
          <div className="card-body position-relative">

            <div className="position-absolute top-0 end-0 p-2">
              <small className="text-warning">{generateStars(product.productRating || 5)}</small>
            </div>

            <h5 className="card-title">{product.productName}</h5>
            <p className="card-text text-muted">
              <strong>Category:</strong> {product.productCategory}
            </p>
            <p className="card-text text-muted">
              <strong>Quantity:</strong> {product.productQuantity}
            </p>
            {product.isSized && (
              <p className="card-text text-info">
                <strong>Sizes:</strong> M, L, XL
              </p>
            )}
            <p className="card-text">
              <span className="text-muted text-decoration-line-through me-2">
                ${productPrice.toFixed(2)}
              </span>
              <span className="text-success">${discountedPrice.toFixed(2)}</span>
            </p>
            <p className="card-text">{product.productDescription}</p>

            <button className="btn btn-primary w-100" data-id={product.productId}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
