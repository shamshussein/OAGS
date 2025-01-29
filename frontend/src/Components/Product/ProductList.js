import React from 'react';
import ProductItem from './ProductItem';
import './ProductList.css';

const ProductList = ({ products, discountPercentage }) => {
  return (
    <div className="container">
      {products.length > 0 ? (
        <div className="row gy-10">
          {products.map((product) => (
            <div key={product._id} className="col-md-6 col-lg-4">
              <ProductItem product={product} discountPercentage={discountPercentage} />
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