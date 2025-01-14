import React, { useState } from 'react';
import ProductItem from './ProductItem';
import Pagination from './Pagination';

const ProductList = ({ products, discountPercentage }) => {
    const productsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const renderPage = () => {
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginatedProducts = products.slice(start, end);

        return (
            <>
                <ul className="product-list">
                    {paginatedProducts.map(product => (
                        <ProductItem key={product.id} product={product} discountPercentage={discountPercentage} />
                    ))}
                </ul>
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalProducts={products.length} />
            </>
        );
    };

    return <div>{renderPage()}</div>;
};

export default ProductList;
