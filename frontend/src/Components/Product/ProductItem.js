import React from 'react';

const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? <i className="fa fa-star" style={{ color: 'yellow' }} aria-hidden="true"></i> : null;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <>
            {[...Array(fullStars)].map((_, i) => (
                <i key={`full-${i}`} className="fa fa-star" style={{ color: 'rgba(245, 245, 78, 0.87)' }} aria-hidden="true"></i>
            ))}
            {halfStar}
            {[...Array(emptyStars)].map((_, i) => (
                <i key={`empty-${i}`} className="fa fa-star-o" style={{ color: 'rgba(245, 245, 78, 0.87)' }} aria-hidden="true"></i>
            ))}
        </>
    );
};


const ProductItem = ({ product, discountPercentage }) => {
    const discountedPrice = product.price * (1 - discountPercentage / 100);

    return (
        <li className="product-item">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
                <h2>{product.name}</h2><br />
                <span className="original-price">${product.price.toFixed(2)}</span>
                <span className="discounted-price">${discountedPrice.toFixed(2)}</span><br />
                <p className="product-description">{product.description}</p><br />
                <div className="product-sizes">
                </div>
                <button className="add-to-cart" data-id={product.id}>Add to Cart</button>
            </div>
            <div className="product-rating">
                <span className="stars">{generateStars(product.rating || 5)}</span>
            </div>
        </li>
    );
};

export default ProductItem;
