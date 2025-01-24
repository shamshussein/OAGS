import React from 'react';
import ProductItem from './ProductItem';
import './ProductList.css';
import axios from 'axios';

const ProductList = ({ products, discountPercentage }) => {
  // Add to Cart function
  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post('http://localhost:3000/api/cart/addToCart', {
        product: productId,
        productQuantity: quantity,
      });
      console.log('Cart updated:', response.data);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  return (
    <div className="container">
      {products.length > 0 ? (
        <div className="row gy-10">
          {products.map((product) => (
            <div key={product._id} className="col-md-6 col-lg-4">
              <ProductItem
                product={product}
                discountPercentage={discountPercentage}
                addToCart={(product, quantity) => addToCart(product._id, quantity)} // Pass addToCart function
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5">
          <p className="text-muted">No products match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
