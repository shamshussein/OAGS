import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

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
  // const discountedPrice = product.productPrice * (1 - discountPercentage / 100);

  return (
    <div className="card mb-3" style={{ maxWidth: '540px' }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img src={product.productImage} className="img-fluid rounded-start" alt={product.productName} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{product.productName}</h5>
            <p className="card-text">
              {/* <span className="text-muted text-decoration-line-through me-2">${product.productPrice}</span> */}
              {/* <span className="text-success">${discountedPrice}</span> */}
            </p>
            <p className="card-text">{product.productDescription}</p>
            <p className="card-text">
              <small className="text-muted">{generateStars(product.productRating || 5)}</small>
            </p>
            <button className="btn btn-primary" data-id={product.productId}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
