import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, totalProducts }) => {
    const productsPerPage = 5;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const handleLoadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handleShowLess = () => {
        setCurrentPage(1);
    };

    return (
        <div className="pagination-buttons">
            {currentPage > 1 && <button className="show-less" onClick={handleShowLess}>Show Less</button>}
            {currentPage < totalPages && <button className="load-more" onClick={handleLoadMore}>Load More</button>}
        </div>
    );
};

export default Pagination;
